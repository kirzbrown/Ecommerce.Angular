import { BaseComponent } from 'src/app/shared/base-component';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { WarehouseService } from './services/warehouse.service';
import { of } from 'rxjs';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-warehouse-management',
  templateUrl: './warehouse-management.component.html',
  styleUrls: ['./warehouse-management.component.scss']
})
export class WarehouseManagementComponent extends BaseComponent implements OnInit {

  //isApplyToall:boolean;
  shippingFeeForm = new FormControl('0');
  @ViewChild('toggle') toggle: MatSlideToggle;


  private _isApplyToAll = false;
  public set isApplyToAll(isApply: boolean) {
   
    if (isApply) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, apply to all!'
      }).then((result) => {
        if (result.isConfirmed) {
           this._isApplyToAll = true;         

          this._service.saveGlobalFees(this.shippingFeeForm.value).pipe(takeUntil(this.stop$))
          .pipe(
            catchError(error => {
              // Handle the error here
              this.openSnackBar('Error saving Global fees','Error');        
              return of(null);
            }))
          .subscribe((result)=>{
            
            if(result===null)
            {
              this.shippingFeeForm.enable();
              this._isApplyToAll =false;
              this.toggle.checked = false;
              this.cdr.detectChanges();
              return;
             
            }

            this.shippingFeeForm.disable();
            this.openSnackBar("Global change is saved.",'Updated');
            this._service.reloadWarhouse();

           
          });
          //console.log(this.shippingFeeForm.value);      

        }
        else
        {
          this._isApplyToAll = false;
          this.shippingFeeForm.enable();
         
        }
      })
    }
    else
    {
      this.shippingFeeForm.enable();
      this._isApplyToAll =false;
      this.cdr.detectChanges();
    }

  }//end set

 
  public get isApplyToAll() {
    return this._isApplyToAll;
  }

  constructor(private cdr: ChangeDetectorRef,
    private _snackBar:MatSnackBar, 
    private _service: WarehouseService
  ) { super()}

  ngOnInit() {
    this.shippingFeeForm.valueChanges.subscribe(value => {
      //console.log('Form control value:', value);
      if (this.isApplyToAll === true) {
        this.isApplyToAll = false;

      }

    });
  }//end init

  openSnackBar(message:string,title:string) {
    this._snackBar.open(message, title, {
      horizontalPosition:'end',
      verticalPosition: 'bottom',
      duration: 3000
    });}



}
