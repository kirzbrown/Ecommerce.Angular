import { Y } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { InventoryManagementService } from '../services/inventory-management-service';
import { HostListener } from "@angular/core";


@Component({
  selector: 'app-inventory-dialog',
  templateUrl: './inventory-dialog.component.html',
  styleUrls: ['./inventory-dialog.component.scss']
})
export class InventoryDialogComponent implements OnInit {
  inventoryFormGroup: FormGroup;
   
  // Declare height and width variables
  scrHeight:any;
  scrWidth:any;
  isMobileView: boolean = false;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, 
              private dialogRef: MatDialogRef<InventoryDialogComponent>,
              private managementService: InventoryManagementService,
              private _sanitizer: DomSanitizer,
              private cdr: ChangeDetectorRef) {
                this.getScreenSize();
              }
  
  ngOnInit(): void {
    this.initalization()
    this.isMobileView = this.scrWidth < 515 ? true : false;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
      // console.log(this.scrHeight, this.scrWidth);
  }
  
  initalization(){
    this.loadFormControl()
  }

  loadFormControl(){
    this.inventoryFormGroup = new FormGroup({
      stock: new FormControl(null, [Validators.required, Validators.min(1)]),
      isActive: new FormControl(null, [Validators.required]),
    })

    this.setValue(this.data)
  }

  setValue(data){
    this.inventoryFormGroup.controls.stock.setValue(data.stock)
    this.inventoryFormGroup.controls.isActive.setValue(data.isActive)
  }

  closeDialog(){
    this.dialogRef.close();
  }

  save() {
      let obj = this.data;
      obj.stock = this.inventoryFormGroup.value.stock;
      obj.isActive = true;

      Swal.fire('Updating warehouse product')
      Swal.showLoading()
      // api call
      this.managementService.createUpdateWarehouseCatalog(obj).subscribe(r => {
        Swal.hideLoading()
        Swal.fire('Updated warehouse product!','Your warehouse product has been updated.','success')
        this.dialogRef.close(this.inventoryFormGroup.value); 
      }, (err) => {
        Swal.fire('Unable to update warehouse product','Your warehouse product is not updated. Please try again..','error')
      })
  }
  
}