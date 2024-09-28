import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductCategoryService } from '../product-category.service';
import { ProductCatalogService } from '../product-catalog.service';

@Component({
  selector: 'app-product-category-tab',
  templateUrl: './product-category-tab.component.html',
  styleUrls: ['./product-category-tab.component.scss']
})
export class ProductCategoryTabComponent implements OnInit, OnDestroy, OnChanges {
  @Output() updateData = new EventEmitter();
  @Output() updateView = new EventEmitter();
  @Input() categoryList: any = null;
  @Input() sortList: any = [];
  @Input() priceList: any = [];
  @Input() searchKey: any = "";
  selectedIndex= 0;
  filters = {
    "SortBy": null,
    "Category": null,
    "Price": null
  };
  filterQueries: string = "";
  filterColumns: string = "";
  searchKeyword: string = "";
  filterSub: Subscription;
  
  constructor(private productCategoryService: ProductCategoryService,
             private productCatalogService: ProductCatalogService) { }

  ngOnInit(){
    this.searchKeyword = "";
    this.filters["SortBy"] = this.sortList[0];
    this.filterSub = this.productCategoryService.filters.subscribe(result => {
      if (result && result.name && result.name == 'nav'){
        this.filters  = result.filters;
      }
    });
  }

  ngOnDestroy(){
    this.filterSub.unsubscribe();
  }

  ngOnChanges() {
    if (this.categoryList) {
      let categories = this.categoryList.filter(e => e.catalogFilter == 'Category');
      if (categories) this.filters["Category"] = categories[0];
    }
  } 

  filterByCategory(event: any, type: any) {
    let item = this.categoryList[event.index];
    this.filters[type] = { name: item.name, catalogFilter: item.catalogFilter }; 

    for (let key in this.filters) {
      if (key != "SortBy") {
        if (this.filters[key] && this.filters[key].catalogFilter && !this.filterColumns.includes(key)) {
          this.filterColumns += `${this.filters[key].catalogFilter}|`;
        }

        if (key == "Category" && this.filters[key] && this.filters[key].name && !this.filterQueries.includes(this.filters[key].name)) {
          this.filterQueries += `${this.filters[key].name}|`;
        }

        if (key == "Price" && this.filters[key] && this.filters[key].value && !this.filterQueries.includes(this.filters[key].value)) {
          this.filterQueries += `${this.filters[key].value}|`;
        }
      }
    }

    this.updateData.emit({
      layoutType: 'grid',
      sortColumn: this.filters["SortBy"] && this.filters["SortBy"].sortColumn ? this.filters["SortBy"].sortColumn : '',
      sortOrder: this.filters["SortBy"] && this.filters["SortBy"].sortOrder ? this.filters["SortBy"].sortOrder : '',
      filterColumn: this.filterColumns ? this.filterColumns.substring(0, this.filterColumns.length - 1) : '',
      filterQuery: this.filterQueries ? this.filterQueries.substring(0, this.filterQueries.length - 1) : '',
      selectedCategory: this.categoryList[event.index].name,
      searchKey: this.searchKeyword
    });

    this.filterColumns = '';
    this.filterQueries = '';

    this.productCategoryService.updateFilters({ name: 'tab', filters: this.filters });

    this.searchKeyword = '';
    this.productCatalogService.updateSearchKey({searchKey: this.searchKeyword });
  }

  selectedIndexChange(){
    this.updateView.emit({layoutType: 'list'});
  }
  
}
