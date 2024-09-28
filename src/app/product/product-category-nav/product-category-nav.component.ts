import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { ProductCategoryService } from '../product-category.service';
import { ProductCatalogService } from '../product-catalog.service';
@Component({
  selector: 'app-product-category-nav',
  templateUrl: './product-category-nav.component.html',
  styleUrls: ['./product-category-nav.component.css']
})
export class ProductCategoryNavComponent implements OnInit, OnDestroy {
  @Input() navigationList: any = [];
  @Input() sortList: any = [];
  @Input() priceList: any = [];
  @Input() searchKey: any = "";
  @Input() filterQuery: any = "";
  @Output() updateSortData = new EventEmitter();
  @Output() clearSearchKey = new EventEmitter();
  filterSub: Subscription;
  filters = {
    "SortBy": null,
    "Price": null
  };
  filterQueries: string = "";
  filterColumns: string = "";
  searchKeyword: string = "";
  
  constructor(private productCategoryService: ProductCategoryService,
             private productCatalogService: ProductCatalogService) { }

  ngOnInit() {
    this.searchKeyword = "";
    // this.filters["SortBy"] = this.sortList[0];
    // this.filterSub = this.productCategoryService.filters.subscribe(result => {
    //   if (result && result.name && result.name == 'tab'){
    //     this.filters["SortBy"] = result.filters["SortBy"];
    //     this.filters["Price"] = result.filters["Price"];
    //   }
    // })
  }

  ngOnDestroy(){
    if(this.filterSub){
      this.filterSub.unsubscribe();
    }
  }


  filterByCategory(item: any, type: any, checkboxRef?: MatCheckbox){

    // if (type == "SortBy" && this.filters[type].name == item.name && checkboxRef){
    //   // checkboxRef.checked = true;
    //   return;
    // }

    if (this.filters[type] && this.filters[type].name == item.name && checkboxRef.checked == false) {
      // this.filters[type] = {};
      this.filters[type] = null;
    } else {
      this.filters[type] = item;
    } 
  }

  filter(){

    // console.log("filter query", this.filterQuery)

    for(let key in this.filters){
      if(key != "SortBy"){
        if (this.filters[key] && this.filters[key].catalogFilter && !this.filterColumns.includes(key)) {
          this.filterColumns += `${this.filters[key].catalogFilter}|`;
        }

        if (key == "Price" && this.filters[key] && this.filters[key].value && !this.filterQueries.includes(this.filters[key].value)) {
          this.filterQueries += `${this.filters[key].value}|`;
        } 
      }
    }

    // if(this.filterQuery){
    //   this.filterQueries += `|${this.filterQuery}`
    // }

    this.updateSortData.emit({
      sortColumn: this.filters["SortBy"] && this.filters["SortBy"].sortColumn ? this.filters["SortBy"].sortColumn : 'Created', //default => create date
      sortOrder: this.filters["SortBy"] && this.filters["SortBy"].sortOrder ? this.filters["SortBy"].sortOrder : 'ASC', //default => ascending
      filterColumn: this.filterColumns ? this.filterColumns.substring(0, this.filterColumns.length - 1) : null,
      filterQuery: this.filterQueries ? this.filterQueries.substring(0, this.filterQueries.length - 1) :  null,
      searchKey: this.searchKeyword 
    });

    this.filterColumns = '';
    this.filterQueries = '';

    this.productCategoryService.updateFilters({ name: 'nav', filters: this.filters });
    this.searchKeyword = '';
    this.productCatalogService.updateSearchKey({searchKey: this.searchKeyword });
  }
}
