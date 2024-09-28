import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderManagementService } from '../profile/order-management/services/order-management-service.component';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss']
})
export class TrackOrderComponent implements OnInit {

  orderNumber;
  order;
  invalidOrder;
  routeOrderNumber;

  constructor(
    private orderService : OrderManagementService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) { 
    this.getRouteParams();
  }

  getRouteParams(){
    this.route.params.subscribe(params => {
      this.routeOrderNumber = params.routeOrderNumber;
    });
  }

  ngOnInit(): void {
    if(this.routeOrderNumber) {
      this.orderNumber = this.routeOrderNumber;
      this.getOrderByOrderNumber(this.routeOrderNumber);
    }
    

  }

  removeAll() {
    
  }

  track() {
    if(this.orderNumber) {
      this.getOrderByOrderNumber(this.orderNumber);
    }
  }

  getOrderByOrderNumber(orderNumber) {
    this.orderService.getOrderByOrderNumber(orderNumber).subscribe(result => {
      if(!result.hasError) {
        this.order = result.data;
        
        this.invalidOrder = false;
        this.cdr.detectChanges();
      } else {
        this.invalidOrder = true;
        this.cdr.detectChanges();
      }
    })
  }
}
