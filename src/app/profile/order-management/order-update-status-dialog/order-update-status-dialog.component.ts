import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { OrderManagementService } from '../services/order-management-service.component';

@Component({
  selector: 'app-order-update-status-dialog',
  templateUrl: './order-update-status-dialog.component.html',
  styleUrls: ['./order-update-status-dialog.component.scss']
})
export class OrderUpdateStatusDialogComponent implements OnInit {
  statuses = [
    { id: 4, name: 'Order Placed' },
    { id: 5, name: 'For Packing' },
    { id: 6, name: 'For Dispatch' },
    { id: 7, name: 'Out For Delivery' },
    { id: 8, name: 'Successfully Delivered' },
  ];

  orderUpdateFormGroup: FormGroup;
  
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, 
              private dialogRef: MatDialogRef<OrderUpdateStatusDialogComponent>,
              private managementService: OrderManagementService,
              private cdr: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.initalization()
  }
  
  initalization(){
    this.loadStatuses()
    this.loadFormControl()
  }

  loadStatuses(){
    this.statuses = this.statuses.filter(x => x.id >= this.data.orderStatus);
  }

  loadFormControl(){
    this.orderUpdateFormGroup = new FormGroup({
      status: new FormControl(null, [Validators.required]),
    })

    this.setValue(this.data)
  }

  setValue(data){
    let selectedStatus = this.statuses.filter(x => x.id == data.orderStatus)[0] ?? null;
    this.orderUpdateFormGroup.controls.status.setValue(selectedStatus)
  }

  closeDialog(){
    this.dialogRef.close();
  }

  save() {
      let statusToUpdate = this.orderUpdateFormGroup.value.status.id;

      Swal.fire('Updating order status')
      Swal.showLoading()
      // api call
      this.managementService.updateOrderStatus(this.data.orderId, statusToUpdate).subscribe(r => {
        Swal.hideLoading()
        Swal.fire('Updated order status!','Your order status has been updated.','success')
        this.dialogRef.close(this.orderUpdateFormGroup.value); 
      }, (err) => {
        Swal.fire('Unable to update order status','Your order status is not updated. Please try again..','error')
      })
  }
}
