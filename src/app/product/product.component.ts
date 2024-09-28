import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { ProductCatalogService } from './product-catalog.service';
import { ProductCategoryService } from './product-category.service';
import { catchError } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { HostListener } from "@angular/core";
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { MainHeaderService } from '../main-header/main-header.service';
import { CarouselService } from '../profile/carousel-management/services/carousel.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})

export class ProductComponent implements OnInit {
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [10, 30, 50];
  dataCount: number = 0;
  dataSource: any;
  sortColumn: string = "";
  sortOrder: string = "";
  filterColumn: string = "";
  filterQuery: string = "";
  searchKey: string = "";
  searchColumn: string = "Title";
  layoutType: string = 'list';
  categoryList: any;
  selectedCategory: any;
  selectedCategoryFilter: any;
  defaultCategory: any;
  navigationList: any;
  productList: any;
  product: any = {};
  carouselList: any;
  sortList = [
    { name: 'Newest', sortOrder: 'ASC', sortColumn: 'Created' },
    { name: 'Oldest', sortOrder: 'DESC', sortColumn: 'Created' },
    { name: 'Price - Low to high', sortOrder: 'ASC', sortColumn: 'Price' },
    { name: 'Price - High to low', sortOrder: 'DESC', sortColumn: 'Price' }
  ];
  priceList = [
    { name: 'Srp 0 - Srp 10,000', value: '0-10000', catalogFilter: 'Price' },
    { name: 'Srp 10,001 - Srp 20,000', value: '10001-20000', catalogFilter: 'Price' },
    { name: 'Srp 20,001 - Srp 30,000', value: '20001-30000', catalogFilter: 'Price' },
    { name: 'Srp 30,001 - Srp 50,000+', value: '30001-50000+', catalogFilter: 'Price' }
  ];
  reqs: Observable<any>[] = [];
  productTitle: string = "Hot Auctions"
  called = 0;
  categoryHtmlContent = ``;
  searchKeyForProduct: string = '';
  hasloadedCarousel: boolean = false;
  prevCategoryName;
  currentCategoryName;
  observableCategoryNameSubject = new Subject<string>();
  observableCategoryName = this.observableCategoryNameSubject.asObservable();
  isFilterVisible: boolean = false;

  // Declare height and width variables
  scrHeight:any;
  scrWidth:any;
  isMobileView: boolean = false;
  
  constructor(
    private dialog: MatDialog,
    private productCalatogService: ProductCatalogService,
    private productCategoryService: ProductCategoryService,
    private carouselService: CarouselService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthorizeService,
    private guestCheckout: MainHeaderService,
  ) { 
    this.getScreenSize();
  }
  
  ngOnInit(): void {
    this.isMobileView = this.scrWidth < 515 ? true : false;

    this.sortColumn = this.sortList[0].sortColumn;
    this.sortOrder = this.sortList[0].sortOrder;
    this.searchKey = "";
    this.reqs.push(
      this.productCalatogService.getDataByPage(this.pageSize, this.pageIndex, this.sortColumn, this.sortOrder, this.filterColumn, this.filterQuery, this.searchKey, this.searchColumn)
        .pipe(
          catchError((err) => {
            console.log(err)
            return of(undefined)
          })
        )
    );

    this.reqs.push(
      this.productCategoryService.getCategoriesTab()
        .pipe(
          catchError((err) => {
            console.log(err)
            return of(undefined)
          })
        )
    );

    this.reqs.push(
      this.productCategoryService.getCategoriesNav()
        .pipe(
          catchError((err) => {
            console.log(err)
            return of(undefined)
          })
        )
    );

    combineLatest(this.reqs).subscribe(result  => {
      if(result.length > 0){
        //Data by page
        this.productList = result[0]["data"];
        this.pageSize = result[0]["pageSize"];
        this.pageIndex = result[0]["pageIndex"];
        this.sortColumn = result[0]["sortColumn"] == null ? "" : result[0]["sortColumn"];
        this.sortOrder = result[0]["sortOrder"] == null ? "" : result[0]["sortOrder"];
        this.filterColumn = result[0]["filterColumn"] == null ? "" : result[0]["filterColumn"];
        this.filterQuery = result[0]["filterQuery"] == null ? "" : result[0]["filterQuery"];
        this.searchKey = result[0]["searchKey"] == null ? "" : result[0]["searchKey"];
        this.dataCount = result[0]["totalCount"];
        //Categories tab data
        this.categoryList = result[1];
        this.selectedCategory = this.categoryList.filter(x => x.name == this.filterQuery)[0];
        //Categories navigation data
        this.navigationList = result[2];

        this.cdr.detectChanges();
      }
    });

    this.observableCategoryName.subscribe(x => {
      this.getCarouselBySelectedCategory("Category", x);
    });
  }

  ngDoCheck(){
    this.getFilteredCatalog()
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
  }


  getDataByPage(filterColumn?, filterQuery?) {
    this.productCalatogService.getDataByPage(this.pageSize, this.pageIndex, this.sortColumn, this.sortOrder, encodeURIComponent(filterColumn ? filterColumn : this.filterColumn), encodeURIComponent(filterQuery ? filterQuery :  this.filterQuery), encodeURIComponent(this.searchKey),encodeURIComponent(this.searchColumn)).subscribe(result => {
      this.productList = result["data"]; 
      this.pageSize = result["pageSize"];
      this.pageIndex = result["pageIndex"];
      this.sortColumn = result["sortColumn"] == null ? "" : result["sortColumn"];
      this.sortOrder = result["sortOrder"] == null ? "" : result["sortOrder"];
      this.filterColumn = result["filterColumn"] == null ? "" : result["filterColumn"];
      this.filterQuery = result["filterQuery"] == null ? "" : result["filterQuery"];
      this.searchKey = result["searchKey"] == null ? "" : result["searchKey"];
      this.dataCount = result["totalCount"];
      this.selectedCategory = this.categoryList.filter(x => x.name.toLowerCase() == this.selectedCategoryFilter.toLowerCase())[0];
      this.prevCategoryName = this.currentCategoryName;
      this.currentCategoryName = this.selectedCategory?.name;



      if(this.currentCategoryName && !this.hasloadedCarousel) {
        this.observableCategoryNameSubject.next(this.currentCategoryName)
        this.hasloadedCarousel = true;
      }
      else {
        if(this.prevCategoryName != this.currentCategoryName) { 
          this.observableCategoryNameSubject.next(this.currentCategoryName)
        }
      }

      this.cdr.detectChanges();
    });
  }
 
  getCarouselBySelectedCategory(filterColumn?, filterQuery?) {
    this.carouselService.getDataByPage(this.pageIndex, 100, this.sortColumn, this.sortOrder, encodeURIComponent(filterColumn ? filterColumn : this.filterColumn), encodeURIComponent(filterQuery ? filterQuery : this.filterQuery)).subscribe(result => {
      this.carouselList = result["data"];
      this.cdr.detectChanges();
    })
  }

  search(arr: any, searchKey: any) {
    return arr.filter((obj: any) => {
      return Object.keys(obj).some((key) => {
        if (obj[key] !== null) {
          const tempKey = obj[key].toString().toLowerCase();
          const tempSearch = searchKey.toLowerCase();
          return tempKey.includes(tempSearch);
        }
      });
    });
  } 

  clearSearch(event) {
    if(this.searchKeyForProduct != "") return;

    this.searchProduct();
  }

  searchProduct(){
    this.productCalatogService.getDataByPage(this.pageSize, this.pageIndex, this.sortColumn, this.sortOrder, encodeURIComponent(this.filterColumn), encodeURIComponent(this.filterQuery), encodeURIComponent(this.searchKeyForProduct), encodeURIComponent(this.searchColumn)).subscribe(result => {
        this.productList = result["data"]; 
        this.pageSize = result["pageSize"];
        this.pageIndex = result["pageIndex"];
        this.sortColumn = result["sortColumn"] == null ? "" : result["sortColumn"];
        this.sortOrder = result["sortOrder"] == null ? "" : result["sortOrder"];
        this.filterColumn = result["filterColumn"] == null ? this.filterColumn : result["filterColumn"];
        this.filterQuery = result["filterQuery"] == null ? this.filterQuery : result["filterQuery"];
        this.searchKey = result["searchKey"] == null ? "" : result["searchKey"];
        this.dataCount = result["totalCount"];
        this.selectedCategory = this.categoryList.filter(x => x.name == this.filterQuery)[0];
        if(!this.selectedCategory){this.selectedCategory = this.categoryList.filter(x => x.name.toLowerCase() == this.selectedCategoryFilter.toLowerCase())[0];}

        this.cdr.detectChanges();
    });
  }

  getFilteredCatalog(){
    this.productCalatogService.products$.subscribe(res => {
      this.productList = res["data"];
      this.cdr.detectChanges();
    });
  }

  changeLayout(layout:string){
    this.layoutType = layout;
    this.getDataByPage();
  }

  productOnChanges(event){
    this.layoutType = event.viewType;
    this.product = event.product;
  }

  onPaginatorClicked(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getDataByPage();
  }

  updateData(event){
    this.layoutType = event.layoutType;
    this.sortColumn = event.sortColumn;
    this.sortOrder = event.sortOrder;
    this.filterColumn = event.filterColumn;
    this.filterQuery = event.filterQuery;
    this.selectedCategoryFilter = event.selectedCategory;
    this.searchKey = event.searchKey;
    this.getDataByPage();
    this.layoutType = 'list';
  }

  updateView(event){
    this.layoutType = event.layoutType
  }

  updateSortData(event){
    this.sortColumn = event.sortColumn;
    this.sortOrder = event.sortOrder;
    let filterColumn = event.filterColumn ? event.filterColumn + `|Category` : 'Category';
    let filterQuery = this.filterQuery = event.filterQuery ? event.filterQuery + `|${this.selectedCategoryFilter}` : this.selectedCategoryFilter;
  
    this.getDataByPage(filterColumn, filterQuery);
  }

  goBackToGridView(){
    this.layoutType = 'grid'
    this.cdr.checkNoChanges();
  }

  goBackToListView(){
    this.layoutType = 'list'
    this.cdr.checkNoChanges();
  }

  sanatizeHtml(htmlString) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }
  
  redirect(pageUrl: string) {
    window.open(pageUrl)
  }
}
