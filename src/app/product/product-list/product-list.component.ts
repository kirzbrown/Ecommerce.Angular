import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @Input() productList: any;
  @Input() viewType: any;
  @Input() productTitle: string;
  @Output() productOnChanges : EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  viewDetails(product: any){
    this.productOnChanges.emit({ viewType: 'details', product });
  }

  onPaginatorClicked(){
    
  }

}
 