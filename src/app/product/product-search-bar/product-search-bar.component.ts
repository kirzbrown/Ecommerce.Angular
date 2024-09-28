import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductCategoryService } from '../product-category.service';
import { ProductCatalogService } from '../product-catalog.service';


@Component({
  selector: 'app-product-search-bar',
  templateUrl: './product-search-bar.component.html',
  styleUrls: ['./product-search-bar.component.css']
})
export class ProductSearchBarComponent implements OnInit, OnDestroy {
  @Input() searchKey: string = "";
  @Output() updateData = new EventEmitter();
  filters = {
    "SortBy": null,
    "Category": null,
    "Price": null
  };
  filterQueries: string = "";
  filterColumns: string = "";
  searchKeyword: string = "";
  filterSub: Subscription;
  isSearchKey: boolean = false;
  searchKeySub: Subscription;

  constructor(private productCategoryService: ProductCategoryService,
             private productCatalogService: ProductCatalogService) { }

  ngOnInit(): void {
    this.searchKeyword = "";
    this.filterSub = this.productCategoryService.filters.subscribe(result => {
      if (result && result.name ){
        this.filters  = result.filters;
      }
    });
    this.searchKeySub = this.productCatalogService.searchKey.subscribe(result => {
      if (result) {
        this.searchKeyword = result.searchKey;
        if (this.searchKeyword != "") {
          this.isSearchKey = true;
        } else {
          this.isSearchKey = false;
        }
      }
    });

  }

  ngOnDestroy() {
    this.filterSub.unsubscribe();
    this.searchKeySub.unsubscribe();
  }

  ifSearchKey(): boolean {
    return this.isSearchKey;
  }
  
  searchByEnterKey(event) {
		if (event.keyCode == 13) {
			this.searchAnything();
		}
	}
  searchAnything() {

   if (this.searchKeyword != "") {
    this.isSearchKey = true;
   }

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
      sortColumn: this.filters["SortBy"] && this.filters["SortBy"].sortColumn ? this.filters["SortBy"].sortColumn : '',
      sortOrder: this.filters["SortBy"] && this.filters["SortBy"].sortOrder ? this.filters["SortBy"].sortOrder : '',
      filterColumn: this.filterColumns ? this.filterColumns.substring(0, this.filterColumns.length - 1) : '',
      filterQuery: this.filterQueries ? this.filterQueries.substring(0, this.filterQueries.length - 1) : '',
      searchKey: this.searchKeyword
    });

    this.filterColumns = '';
    this.filterQueries = '';
   
    this.productCategoryService.updateFilters({ name: 'tab', filters: this.filters });   
  }

}
