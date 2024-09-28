import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderManagementService } from '../services/order-management-service.component';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent implements OnInit {
  orderFormGroup: FormGroup;
  selectedOrder;
  orderItems;
  orderStatus = [
    { id: 4, name: 'Order Placed' },
    { id: 5, name: 'For Packing' },
    { id: 6, name: 'For Dispatch' },
    { id: 7, name: 'Out For Delivery' },
    { id: 8, name: 'Successfully Delivered' },
  ];
  
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, 
              private datePipe: DatePipe,
              private dialogRef: MatDialogRef<OrderDialogComponent>,
              private managementService: OrderManagementService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initalization()
  }
  
  initalization(){
    this.selectedOrder = this.data.selectedOrder
    this.loadFormControl()
  }

  loadFormControl(){
    this.orderFormGroup = new FormGroup({
      // id: new FormControl(Math.floor(Math.random() * 100)),
      orderNumber: new FormControl(null),
      orderDate: new FormControl(null),
      orderStatus: new FormControl(null),
      totalPrice: new FormControl(null),
      notes: new FormControl(null),
      receiverStreetBlgHouseNo: new FormControl(null),
      receiverAddress: new FormControl(null),
      receiverName: new FormControl(null),
      receiverEmail: new FormControl(null),
      receiverContactNumber: new FormControl(null)
    })

    this.setValue(this.data.selectedOrder)
  }

  setValue(orderData){
    this.orderItems = orderData.orderItems;
    this.orderFormGroup.controls.orderNumber.setValue(orderData.orderNumber)
    this.orderFormGroup.controls.orderDate.setValue(this.datePipe.transform(orderData.orderDate, "yyyy-MM-dd"))
    this.orderFormGroup.controls.orderStatus.setValue(this.getOrderStatus(orderData.status))
    this.orderFormGroup.controls.totalPrice.setValue(orderData.totalPrice)
    this.orderFormGroup.controls.notes.setValue(orderData.notes)
    this.orderFormGroup.controls.receiverStreetBlgHouseNo.setValue(orderData.address?.streetBldgHouseNo)
    this.orderFormGroup.controls.receiverAddress.setValue(`${orderData.address?.region}, ${orderData.address?.province}, ${orderData.address?.city}, ${orderData.address?.barangay}`)
    this.orderFormGroup.controls.receiverName.setValue(orderData.address?.receiverName)
    this.orderFormGroup.controls.receiverEmail.setValue(orderData.address?.receiverEmail)
    this.orderFormGroup.controls.receiverContactNumber.setValue(orderData.address?.receiverContactNumber)
  }


  closeDialog(){
    this.dialogRef.close();
  }

  getOrderStatus(statusNumber) {
    return this.orderStatus.filter(x => x.id == statusNumber)[0]?.name;
  }

  save(){
    // if(this.data.isAdd){
    //   this.managementService.createCategory(this.categoryFormGroup.value).subscribe(r => {
    //     Swal.fire('Created new category!','Your category has been added.','success')
    //     this.dialogRef.close(this.categoryFormGroup.value); 
    //   }, (err) => {
    //     Swal.fire('Unable to add category','Your category is not added. Please try again..','error')
    //   })
    // } else {
    //   let obj = this.data.selectedCategory;
    //   obj.name = this.categoryFormGroup.value.name;
    //   obj.description = this.categoryFormGroup.value.description;
    //   obj.imageUrl = this.categoryFormGroup.value.imageUrl;
    //   obj.bannerImageUrl = this.categoryFormGroup.value.bannerImageUrl;
    //   obj.htmlContent = this.categoryFormGroup.value.htmlContent;
    //   this.managementService.updateCategory(obj.id, obj).subscribe(r => {
    //     Swal.fire('Updated category!','Your category has been updated.','success')
    //     this.dialogRef.close(this.categoryFormGroup.value); 
    //   }, (err) => {
    //     Swal.fire('Unable to update category','Your category is not updated. Please try again..','error')
    //   })
    // }
  }
}
