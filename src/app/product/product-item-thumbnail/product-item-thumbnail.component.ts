import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-item-thumbnail',
  templateUrl: './product-item-thumbnail.component.html',
  styleUrls: ['./product-item-thumbnail.component.css']
})
export class ProductItemThumbnailComponent implements OnInit {
  @Input() product;
  @Input() viewType;
  
  constructor() { }

  ngOnInit(): void {
  }

}
