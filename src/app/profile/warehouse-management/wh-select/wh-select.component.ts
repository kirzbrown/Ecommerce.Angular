
import { FormControl } from '@angular/forms';

import { BaseComponent } from 'src/app/shared/base-component';

import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { WarehouseService } from '../services/warehouse.service';
import { catchError, takeUntil } from 'rxjs/operators';
import { whSelectVM } from '../models/wh-select';

import { MatCheckbox } from '@angular/material/checkbox';
import { CurrencyPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { whDeliveryArea, whRespond } from '../models/_wh-common';
import { MatDialog } from '@angular/material/dialog';
import { WhAddDialogComponent } from '../wh-add-dialog/wh-add-dialog.component';

import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import { of } from 'rxjs';

@Component({
  selector: 'app-wh-select',
  templateUrl: './wh-select.component.html',
  styleUrls: ['./wh-select.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: 0, opacity: 0 })),
      transition('in => out', [animate('300ms ease-in')]),
      transition('out => in', [animate('300ms ease-out')])
    ])
  ]
})
export class WhSelectComponent extends BaseComponent implements OnInit {

  //selectedWarehouse:whSearchItem; 
  modelVM: whSelectVM;
  provinceForm = new FormControl('');
  //dataSource: any;//= ELEMENT_DATA;//Observable<WareHouseDto>; //= ELEMENT_DATA;
  dataSource:MatTableDataSource<whDeliveryArea>;//(this.modelVM.cityList);
  origCityList: ReadonlyArray<whDeliveryArea>;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _service: WarehouseService
  ) {
    super();
  }



  ngOnInit() {
    this.modelVM = new whSelectVM();
    this._service.currentWareHouse$
      .pipe(takeUntil(this.stop$)).subscribe(wh0 => {

        this.modelVM.selectedWh = wh0.data;

        this._service.getWarehouseByName(this.modelVM.selectedWh.name)
          .pipe(takeUntil(this.stop$)).pipe(
            catchError(error => {
              // Handle the error here
              this.openSnackBar('Error retrieving','Error');        
              return of(null);
            }))
          .subscribe(whList => {

            if(whList === null)
               return;

            let result = whList as whRespond;
            if (result.data[0]) {
              let wh1 = result.data[0];
              this.modelVM.selectedWh = wh1;
              this.modelVM.clearCityList();

              this.modelVM.selectedP = this.modelVM.provinces[0];
              if (this.provinceForm && this.modelVM.selectedP !== '')
                this.provinceForm.setValue(this.modelVM.selectedP);

              console.info(`province: ${this.modelVM.selectedP}`);
            
              this.cdr.detectChanges();

            }

            this.origCityList = JSON.parse(JSON.stringify(this.modelVM.cityList));
            this.dataSource = new MatTableDataSource<whDeliveryArea>(this.modelVM.cityList);
            this.dataSource.sort = this.sort;

            this.previousProvince = this.modelVM.selectedP;
            //console.log(wh);
            //this.modelVM.selectedWh
            if (this.isDivVisible === true)
              this.isDivVisible = false;

          });

      });
      
  }



  ngAfterViewInit() {
    if(this.dataSource)
       this.dataSource.sort = this.sort;

  }

  //#region ------------ANIMATIONS
  private _isDivVisible = false;
  public set isDivVisible(isVisible: boolean) {
    this._isDivVisible = isVisible;
    if (isVisible) {
      this.show();
      this.isApplyToAll = false;
      this.modelVM.cityList.forEach(row => this.selection.select(row));

    }
    else {
      this.hide();
      this.selection.clear();

    }

  }

  public get isDivVisible() {
    return this._isDivVisible;
  }

  visibility = 'out';

  show() {
    this.visibility = 'in';
  }

  hide() {
    this.visibility = 'out';
  }

  //#endregion


  //#region ----------------TABLE LIST  

  arraysEqual(a: whDeliveryArea[], b: whDeliveryArea[], id: keyof whDeliveryArea, shippingFee: keyof whDeliveryArea): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    return a.every(val1 => b.some(val2 => val1[id] === val2[id] && val1[shippingFee] === val2[shippingFee]));
  }


  toggleApplyAll()
  {
    let isListEqual = this.arraysEqual( JSON.parse(JSON.stringify(this.origCityList)),this.modelVM.cityList,'id','shippingFee');
    if(!isListEqual)
    {
      this.isApplyToAll = false;
    }

  }


  previousProvince:string;
  onSelectionChange(event) {
    //console.log(event.value);

    let isListEqual = this.arraysEqual(JSON.parse(JSON.stringify(this.origCityList)),this.modelVM.cityList,'id','shippingFee');
    if(!isListEqual)
    {

      Swal.fire({
        title: 'Are you sure?',
        text: "Your changes is not yet saved.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Discard Changes'
      }).then((result) => {
        if (result.isConfirmed) {
              this.modelVM.cityList = JSON.parse(JSON.stringify(this.origCityList));             
              this.openSnackBar("Your changes is not saved", 'Warning');
              this.cdr.detectChanges();

              this.isLockedNotify = true;
              this.modelVM.selectedP = event.value;

              this.dataSource.data =this.modelVM.cityList;
              this.origCityList = JSON.parse(JSON.stringify(this.modelVM.cityList));       
          
              this.selection.clear();
              this.isDivVisible = false;
              this.previousProvince = this.modelVM.selectedP;
              this.cdr.detectChanges();
            }
            else
            {
              event.source.value = this.previousProvince;
              this.modelVM.selectedP = this.previousProvince;
              return;
            }
          });//end confirm     
      
    }//end if
    else{// all saved or no change
      this.isLockedNotify = true;
      this.modelVM.selectedP = event.value;

      this.dataSource.data =this.modelVM.cityList;
      this.origCityList = JSON.parse(JSON.stringify(this.modelVM.cityList));   
  
      this.selection.clear();
      this.isDivVisible = false;
      this.previousProvince = this.modelVM.selectedP;
      this.cdr.detectChanges();
    }

   
  }

  displayedColumns: string[] = ['select', 'city', 'shippingFee', 'extra'];
  datasource: any;


  //#endregion


  //#region ----------ACTIONS
  edit() {

    if(this.modelVM.selectedWh.name)    
     this.openWizard(false, this.modelVM.selectedWh);
  }

  saveList() {

    if (this.isDivVisible === false)
      return;

    // whDeliveryArea{  
    //   province: string;
    //   city: string;
    //   isActive: true;
    //   shippingFee:number;
    //   warehouseId: number;
    //   warehouse: null;
    //   id: number;
    //   rowVersion: string;
    //   position:number;
    //   private _pesoFee : string;
    
    const cityShippingFees = this.modelVM.cityList.map(da => ({ city: da.city, shippingFee: da.shippingFee }))   

    let createObj = {
      province: this.modelVM.selectedP,
      cityShippingFees: cityShippingFees
    }

    this._service.saveShippingFees(createObj).pipe(takeUntil(this.stop$)).pipe(
      catchError(error => {
        // Handle the error here
        this.openSnackBar('Error updating','Not Saved');   
        this.spinnerVisible = false;      
        return of(null);
      })
    ).subscribe((res) => {

      

      if(res === null)
        return;

      this.isDivVisible = false;
      this.cdr.detectChanges();

      this.openSnackBar("Changes is saved.", 'Updated');
      this.dataSource.data =this.modelVM.cityList;
      this.origCityList = JSON.parse(JSON.stringify(this.modelVM.cityList));
      this.spinnerVisible = false; 
      
    }   
    );



  }
  cancel() {
    
    let isListEqual = this.arraysEqual(JSON.parse(JSON.stringify(this.origCityList)),this.modelVM.cityList,'id','shippingFee');
    if(!isListEqual)
    {
        this.modelVM.cityList = JSON.parse(JSON.stringify(this.origCityList));
        this.dataSource.data =this.modelVM.cityList;
        this.openSnackBar('Changes is reverted back','Undo');
    }  

    this.cdr.checkNoChanges();
    this.isDivVisible = false;
    

  

  }

  openSnackBar(message: string, title: string,duration:number = 3000) {

    let lowerTitle = title.toLowerCase();

    switch (lowerTitle) {

      case 'error':
        this._snackBar.open(message, title, {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          //duration: 5000,
          panelClass: ['dai-error-snackbar'],       

        });    
        break;
        case 'not saved':
        this._snackBar.open(message, title, {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          //duration: 5000,
          panelClass: ['dai-error-snackbar']
        });    
        break;


      default:
        this._snackBar.open(message, title, {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: duration,
          //panelClass: ['dai-success-snackbar']
        });    
        break;
    }//endSwitch   
  }


  //#endregion

  //#region ----------SELECT NgbCheckBox

  applyProvince = new FormControl('');

  //toggleApplyToProvince:boolean;
  private _isApplyToAll = false;
  public set isApplyToAll(isApply: boolean) {
    this._isApplyToAll = isApply;
    if (isApply) {
      let fee = this.applyProvince.value;
      this.modelVM.cityList.forEach(row => {
        const filteredCities = this.selection.selected.filter(da => da.city === row.city);
        if (filteredCities.length > 0) {
          row.shippingFee = fee;
        }
      });

      this.dataSource.data =this.modelVM.cityList;

    }
  }
  public get isApplyToAll() {
    return this._isApplyToAll;
  }



  /** Whether the number of selected elements matches the total number of rows. */
  selection = new SelectionModel<whDeliveryArea>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.modelVM.cityList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */

  @ViewChildren(MatCheckbox) checkboxes: QueryList<MatCheckbox>;
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.modelVM.cityList.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: whDeliveryArea): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  getPesoFee(element: any): string {
    let wh = element as whDeliveryArea;

    const currencyPipe = new CurrencyPipe('en-US');
    if (!wh.shippingFee)
      wh.shippingFee = 0;

    let amount = currencyPipe.transform(wh.shippingFee, '₱ ');// 'symbol-narrow', '4.2-2');    
    return amount;
  }

  //#endregion



  //#region ------------Selection 
  selectedRowIndex: number;
  selectRow(event, row) {
    this.selectedRowIndex = row.id;
    // if (this.isDivVisible === true)
    //   this.selection.toggle(row);
    // else
      event.stopPropagation();
  }

  toggleRow(row) {
    this.selectedRowIndex = row.id;
    if (this.isDivVisible === true)
      this.selection.toggle(row);


  }

  //#endregion

  //#region EDIT DIALOG

  // Declare height and width variables
  scrHeight: any;
  scrWidth: any;
  isMobileView: boolean = false;
  openWizard(isAdd: boolean = false, data?: any) {
    // dont let add here , add happens in search component
    if (isAdd === true)
      return;

    const dialogRef = this.dialog.open(WhAddDialogComponent, {
      data: {
        isAdd: isAdd,
        userId: data.userId,
        selected: data
      },
      width: this.isMobileView ? '80vw' : '50vw',
      height: 'auto',
      minWidth: this.isMobileView ? '80vw' : '50vw',
      disableClose: true,
      autoFocus: false,
      panelClass: 'warehouse-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.isOpenFlag=null;
      if (result) {
        //send messag to search to refresh
        this._service.selectWareHouse(this.modelVM.selectedWh, true);
      }
    });
  }
  //#endregion


  isLockedNotify:boolean = true;

  lockedNotify(event){    
    event.stopPropagation();

    if(this.isDivVisible===true)
      return;

    if(this.isLockedNotify)
    {
      this.openSnackBar("Toggle 'Edit List' to make changes.",'Locked',5000);
      this.isLockedNotify = false;
    }

  }

  get cityCount():number{
    return this.modelVM.cityList.length;
  }

  get isEnabled():boolean
  {
    if(this.modelVM.selectedP)
    {
      return true;
    }
    else
      return false;
  }

  spinnerVisible:boolean;

}
