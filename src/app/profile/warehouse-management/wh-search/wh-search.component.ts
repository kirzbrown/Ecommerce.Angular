import { FormControl } from '@angular/forms';

import { BaseComponent } from 'src/app/shared/base-component';
import { WareHouseDto } from './../models/sample';
import { Observable, Subscription } from 'rxjs';
import { WhAddDialogComponent } from './../wh-add-dialog/wh-add-dialog.component';

import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { ManagementService } from '../../category-management/services/management-service.component';
import { ELEMENT_DATA } from '../models/sample';
import { MatTableDataSource } from '@angular/material/table';
import { WarehouseService } from '../services/warehouse.service';
import { takeUntil, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { whSearchItem } from '../models/_wh-common';
import { whSearchVM } from '../models/wh-search';


@Component({
  selector: 'app-wh-search',
  templateUrl: './wh-search.component.html',
  styleUrls: ['./wh-search.component.css']
})
export class WhSearchComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['name'];
  dataSource :any ;//= ELEMENT_DATA;//Observable<WareHouseDto>; //= ELEMENT_DATA;
  searchKey:string;
  searchControl$= new FormControl('');
  

 
  //table
  @ViewChild(MatSort) sort: MatSort;
  
  //paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize: number = 50;
  pageLength: number = 0;
  userId: any;

 // Declare height and width variables
 scrHeight:any;
 scrWidth:any;
 isMobileView: boolean = false;
 modelVM:whSearchVM;


  constructor(private authService: AuthorizeService,
    private cdr: ChangeDetectorRef, 
    private dialog: MatDialog,
    private managementService: WarehouseService
    ) {  
      super();
      this.getScreenSize();
    }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
      // console.log(this.scrHeight, this.scrWidth);
  } 

  isOpenFlag:boolean

  ngOnInit() {
    this.modelVM = new whSearchVM();
    
     this.search();
     if(this.managementService.lastWarhouse)
         this.selectedRowIndex = this.managementService.lastWarhouse.id;

     this.searchControl$.valueChanges     
     .pipe(distinctUntilChanged())
     .pipe(takeUntil(this.stop$)).pipe(debounceTime(1000))
     .subscribe(value => {
        this.searchKey = value;
        this.search();
     });

     //listen for edit
     this.managementService.currentWareHouse$
     .pipe(takeUntil(this.stop$)).subscribe(wh=>{

      if(this.isOpenFlag)
         return;

       if(wh.isEdit )
         {
          this.isOpenFlag=true;
          //this.openWizard(false,wh.data);
          this.getList();
         }
        
     });


  }

  getList(pageEvent?: any){
    this.managementService
    .getPaginatedWarehouse(pageEvent ? pageEvent.pageSize : this.pageSize, pageEvent ? pageEvent.pageIndex : 0, this.searchKey && this.searchKey != "" ? this.searchKey : null)
    .pipe(takeUntil(this.stop$))
    .subscribe( data => {
      let tableData = data as any; //Array<whSearchItem>;
      tableData.data = tableData.data.map((item, i) => ({...item, index: i}));
      this.dataSource = new MatTableDataSource(tableData.data); //tableData.data;

      this.modelVM.whList = this.dataSource as Array<whSearchItem>;

      this.pageLength = tableData.totalCount;
      this.pageSize = tableData.pageSize;
      this.cdr.detectChanges();
    })
  }

  search(){
   // this.searchKey =  this.searchControl.value;
    this.getList();
  }
  
  openWizard(isAdd: boolean = false, data?: any){
   // dont let edit here , edit happens in select component
    if(isAdd===false)
      return;

    const dialogRef = this.dialog.open(WhAddDialogComponent, {
        data: {
          isAdd: isAdd,
          userId: this.userId,
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
        this.isOpenFlag=null;
        if(result){
          this.getList()
        }
      });
  }

 
//#region ------------Selection 
selectedRowIndex: number;
selectRow(event, row) {
  this.selectedRowIndex = row.id;
  //load details here...
  let wh = row as whSearchItem;
  this.managementService.selectWareHouse(wh,false);
}

//#endregion

getTotalProvince(element:any):number
{

  let thisE = element as whSearchItem;

  if(!thisE.deliveryAreas)
     return 0;

  let provinces = new Set<string>();
  thisE.deliveryAreas.forEach(area => provinces.add(area.province));
  //console.log(provinces.size);

   return provinces.size;
}
getTotalCity(element):number
{
  let thisE = element as whSearchItem;
  
  if(!thisE.deliveryAreas)
     return 0;
 
   return thisE.deliveryAreas.length;
}


}
