import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ProductCatalogService } from '../product-catalog.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnInit {
  @Input() productList: any;
  @Input() viewType: any;
  @Input() productTitle: string;
  @Output() productOnChanges : EventEmitter<any> = new EventEmitter();
  

  constructor(private productCatalogService: ProductCatalogService) { }

  ngOnInit(): void {
  }

  viewDetails(product: any) {
    this.productOnChanges.emit({ viewType: 'details', product });
  }
}
