

import { group } from '@angular/animations';
import { whAddSA, whMainListItem, whUser } from './../models/wh-dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { whDialogVM } from '../models/wh-dialog';
import { WarehouseService } from '../services/warehouse.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/base-component';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbCheckBox } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { DeliveryArea } from '../../maintenance/_model/maintenance-model';
import { whDeliveryArea, whSearchItem } from '../models/_wh-common';



@Component({
  selector: 'app-wh-add-dialog',
  templateUrl: './wh-add-dialog.component.html',
  styleUrls: ['./wh-add-dialog.component.scss']
})
export class WhAddDialogComponent extends BaseComponent implements OnInit {

  modelVM: whDialogVM; 
  displayedColumns: string[] = ['select','province','assignedTo']//,'province'];//,'assignedTo'];
  selection = new SelectionModel<whAddSA>(true, []);
  datasource:MatTableDataSource<whAddSA>;
  headerUserForm= new FormControl('');
  headerForm = new FormControl('', [Validators.required]);

  // get datasource:FormArray
  // {
  //   this.modelVM.formDialog.get('saListForm').controls
  // }

  constructor(
    @Inject(MAT_DIALOG_DATA) public fromDialog: any,
    private dialogRef: MatDialogRef<WhAddDialogComponent>,
    private _service: WarehouseService,
    private fb: FormBuilder,
    //private azureBlobService: AzureBlobStorageService,
    private cdr: ChangeDetectorRef) { super() }

  
    
  //#region  INIT----------------------------------------------
  ngOnInit(): void {
    this.modelVM = new whDialogVM();
    this.modelVM.selected = this.fromDialog.selected;

    let userId = "Unassigned";
    if(this.modelVM.selected)
      userId = this.modelVM.selected.adminUserId;
      

    let first = new whUser();
    first.id = "Unassigned";
    first.userName = "Unassigned";
    this._service.getAdminUsers(userId).pipe(takeUntil(this.stop$)).subscribe(list=>{

      this.modelVM.adminList = list as Array<whUser>;    
      
      this.modelVM.adminList.unshift(first);

    });
    

    if (!this.fromDialog.isAdd) { //edit...
      //#1 profile
      this.setValue()//whSearchItem
      //#2 unassigned      
      //#3 Append Assigned
      this.getProvincesOfWarhouse();



    }
    else//New...
    {
        //get only unassing sa
       this.getUnassigned();

    }
    
  }
  
  getUnassigned(){
     //
     this._service.getUnsignedOnly()
     .pipe(takeUntil(this.stop$)).subscribe(list => {

       let das = list as Array<whAddSA>;

       //get distinct province
       let filteredArray = das.reduce((saArray, current) => {
         if (!saArray.find(x => x.province === current.province)) {
           saArray.push(current);
         }
         return saArray;
       }, []);

       filteredArray.sort((a, b) => {
         if (a.province < b.province) return -1;
         if (a.province > b.province) return 1;
         return 0;
       });

       this.modelVM.saList = filteredArray;

       this.datasource = new MatTableDataSource<whAddSA>(this.modelVM.saList );
      
     });
   this.cdr.detectChanges();
  }

  getProvincesOfWarhouse(){
    //
    let unAssignedList = new Array<whAddSA>();
    this._service.getUnsignedOnly()
    .pipe(takeUntil(this.stop$)).subscribe(list => {

      let das = list as Array<whDeliveryArea>;

      //get distinct province
      let filteredArray = das.reduce((saArray, current) => {
        if (!saArray.find(x => x.province === current.province)) {
          saArray.push(current);
        }
        return saArray;
      }, []);

      // filteredArray.sort((a, b) => {
      //   if (a.province < b.province) return -1;
      //   if (a.province > b.province) return 1;
      //   return 0;
      // });
      // this.modelVM.saList = filteredArray;
      unAssignedList = filteredArray; 
     
       let masterList = this.modelVM.selected.deliveryAreas as Array<whDeliveryArea>;

      let userList = this.modelVM.adminList.filter(u=>u.id === this.modelVM.selected.adminUserId);
      let userName = "Unassigned";
      if(userList[0])
          userName = userList[0]['username']

       const distinctProvinces = Array.from(
        new Set(masterList.map(area => area.province))
      ).map(province => {
       return {
        name: this.modelVM.selected.name,
        province: province,
        position:0,        
        deliveryAreas: [],
        isChecked:true,
        userName:userName       
       }
        
       // return { province };
      });

      distinctProvinces.forEach(i=>
        {
          let wh  = i as whAddSA;
          unAssignedList.push(wh);
          this.selection.select(wh);
        }
      );

      unAssignedList.sort((a, b) => {
        if (a.province < b.province) return -1;
        if (a.province > b.province) return 1;
        return 0;
      });      

      this.modelVM.saList = unAssignedList;    

      this.datasource = new MatTableDataSource<whAddSA>(this.modelVM.saList );
      this.cdr.detectChanges();    
      //this.modelVM.selected.
     
    });

  
   // this.datasource.data = this.modelVM.saList ;
    
 }



  setValue() {

    let wh = this.modelVM.selected; //data as whSearchItem;     
    this.headerForm.setValue(wh.name); 
    //this.modelVM.formDialog.get('headerUser').setValue(wh.adminUserId);   
    this.headerUserForm.setValue(wh.adminUserId); 
  }
  //#endregion-------------END INIT--------------------------------------------


  
  closeDialog() {
    this.dialogRef.close();
  }

  
  save() {  
  
    if (this.fromDialog.isAdd) {
      // {
      //   "name": "string",
      //   "address": "string",
      //   "contactNumber": "string",
      //   "email": "string",
      //   "adminUserId": "string",
      //   "deliveryAreaIds": [
      //     0
      //   ]
      // }

      const provinces = this.selection.selected.map(da => da.province);
      
      let createObj = {
        name: this.headerForm.value,  
        adminUserId: this.headerUserForm.value,//this.modelVM.formDialog.get('headerUser').value,  
        provinces:provinces       
        
     }
     if(createObj.adminUserId ==="Unassigned" || createObj.adminUserId==='')
          createObj.adminUserId = null;
         

     console.info(createObj);

      //api call
      this._service.createWarehouse(createObj).subscribe(r => {
        Swal.fire('Created new category!', 'Your warehouse has been added.', 'success')
        this.dialogRef.close(createObj);
      }, (err) => {

         if(!err.error)
            err.error = 'Your warehouse is not added. Please try again..';          

        Swal.fire('Unable to add warehouse', err.error , 'error')
        this.spinnerVisible = false;

      })
    } else {
      //mapping on update
      const provinces = this.selection.selected.map(da => da.province);  
      
      // {
      //   "name": "string",
      //   "address": "string",
      //   "contactNumber": "string",
      //   "email": "string",
      //   "adminUserId": "string",
      //   "provinces": [
      //     "string"
      //   ]
      // }
      
      
      let createObj = {
        name: this.headerForm.value, 
        address:this.modelVM.selected.address,
        contactNumber:this.modelVM.selected.contactNumber,
        id:this.modelVM.selected.id, 
        adminUserId: this.headerUserForm.value,//this.modelVM.formDialog.get('headerUser').value,  
        provinces:provinces
        
     }
     if(createObj.adminUserId ==="Unassigned" || createObj.adminUserId==='')
     createObj.adminUserId = null;          


      //api call
      this._service.updateWarehouse(this.modelVM.selected.id, createObj).subscribe(r => {
      
        Swal.fire('Updated Warhouse!', 'Your warehouse has been updated.', 'success')        
        this.dialogRef.close(createObj);

        let wh = Object.assign(new whSearchItem, this.modelVM.selected);
        wh.name = createObj.name;
        wh.adminUserId = createObj.adminUserId;

        //reload warehouse
        this._service.selectWareHouse(wh,false);

      }, (err) => {
        Swal.fire('Unable to update Warehouse', 'Your warehouse is not updated. Please try again..', 'error')
        this.spinnerVisible =false;
      })
    }
  }

  //#region ----------SELECT NgbCheckBox
  /** Whether the number of selected elements matches the total number of rows. */

 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.modelVM.saList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.modelVM.saList.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: whAddSA): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  //#endregion

  formatUserText(user:string)
  {
     if( user ==="Unassigned" || user==='' || !user)
            return 'Unassigned';
      else
        return user;      
  }

  spinnerVisible:boolean;


}
