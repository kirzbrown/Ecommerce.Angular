import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { OrderUpdateStatusDialogComponent } from './order-update-status-dialog/order-update-status-dialog.component';
import { OrderManagementService } from './services/order-management-service.component';
import { HostListener } from "@angular/core";
import { WarehouseService } from '../warehouse-management/services/warehouse.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  searchKey: string;
  searchColumn = "OrderNumber";
  displayedColumns: string[] = this.isAdmin ? [
    'warehouse', 'orderNumber', 'orderDate', 'orderStatus', 'action'
  ] : (this.isWarehouseAdmin ? [
    'area' , 'orderNumber', 'orderDate', 'orderStatus', 'action'
  ] : [
    'orderNumber', 'orderDate', 'orderStatus', 'action'
  ]);
  orderStatus = [
    { id: 4, name: 'Order Placed' },
    { id: 5, name: 'For Packing' },
    { id: 6, name: 'For Dispatch' },
    { id: 7, name: 'Out For Delivery' },
    { id: 8, name: 'Successfully Delivered' },
  ];
  dataSource = new MatTableDataSource<any>();

  //paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize: number = 10;
  pageLength: number = 0;

  // Declare height and width variables
  scrHeight:any;
  scrWidth:any;
  isMobileView: boolean = false;
  sortValues = this.isAdmin ? ["Date", "Warehouse", "Status"] : ["Date", "Area", "Status"];
  filterValues = {
    warehouse: '',
    area: '',
    orderStatus: ''
  };
  areas;
  warehouses;

  constructor(
              private authService: AuthorizeService,
              private cdr: ChangeDetectorRef, 
              private dialog: MatDialog,
              private managementService: OrderManagementService,
              private warehouseService: WarehouseService,
              ) { 
                this.getScreenSize();
              }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  get isWarehouseAdmin() {
    return this.authService.isWarehouseAdmin();
  }

  get userId(){
    return this.authService.getClaims().sub;
  }

  ngOnInit(): void {
    if(this.isAdmin) {
      this.getWarehouses();
    }

    if(this.isWarehouseAdmin) {

    }

    this.getList()
    this.isMobileView = this.scrWidth < 515 ? true : false;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
      // console.log(this.scrHeight, this.scrWidth);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openUpdateWizard(data?: any){
    const dialogRef = this.dialog.open(OrderUpdateStatusDialogComponent, {
        data: {
          orderId: data.id,
          orderStatus: data.status
        },
        width: '50vw',
        height: 'auto',
        minWidth: '50vw',
        disableClose: true,
        autoFocus: false,
        panelClass: 'order-dialog-container',
      });

      // console.log(dialogRef)

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.getList()
        }
      });
  }

  openViewWizard(data?: any){
    const dialogRef = this.dialog.open(OrderDialogComponent, {
        data: {
          userId: this.userId,
          selectedOrder: data
        },
        width: this.isMobileView ? '80vw' : '50vw',
        height: 'auto',
        minWidth: this.isMobileView ? '80vw' : '50vw',
        disableClose: true,
        autoFocus: false,
        panelClass: 'order-dialog-container',
      });
      
      // console.log(dialogRef)

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.getList()
        }
      });
  }

  clearSearch(event) {
    if(this.searchKey != "") return;

    this.getList();
  }

  search(event? :any) {
    this.getList();
  }

  getOrderStatus(statusNumber) {
    return this.orderStatus.filter(x => x.id == statusNumber)[0]?.name;
  }

  filterBy(event, filterType, filterValue) {
    if(event.isUserInput)
    {
      this.filterValues[filterType] = filterValue
      this.dataSource.filter = JSON.stringify(this.filterValues);
    }
  }

  sortBy(event, sortValue) {}

  getWarehouses(){
    this.warehouseService.getAllWarehouses().subscribe(res => {
      if(res) {
        this.warehouses = res;
      }
    })
  }

  getList(pageEvent?: any){
    if (this.isAdmin) {
      this.managementService.getPaginatedOrder(pageEvent ? pageEvent.pageSize : this.pageSize, pageEvent ? pageEvent.pageIndex : 0, this.searchKey && this.searchKey != "" ? this.searchKey : null, this.searchKey && this.searchKey != "" ? this.searchColumn : null).subscribe( data => {
          let tableData = data as any;
          this.dataSource = new MatTableDataSource(tableData.data);
          this.dataSource.filterPredicate = this.createFilter();
          this.pageLength = tableData.totalCount;
          this.pageSize = tableData.pageSize;
          this.cdr.detectChanges();
      })
    }
    else if (this.isWarehouseAdmin) {
      this.managementService.getPaginatedOrdersByAdminUserId(this.userId, pageEvent ? pageEvent.pageSize : this.pageSize, pageEvent ? pageEvent.pageIndex : 0, this.searchKey && this.searchKey != "" ? this.searchKey : null, this.searchKey && this.searchKey != "" ? this.searchColumn : null).subscribe( data => {
          let tableData = data as any;
          this.dataSource = new MatTableDataSource(tableData.data);
          this.dataSource.filterPredicate = this.createFilter();
          this.pageLength = tableData.totalCount;
          this.pageSize = tableData.pageSize;
          this.areas = tableData.data.map(x => x.address.province + ", " +x.address.city);
          this.cdr.detectChanges();
      })
    }
    else {
      this.managementService.getPaginatedOrdersByUserId(this.userId, pageEvent ? pageEvent.pageSize : this.pageSize, pageEvent ? pageEvent.pageIndex : 0, this.searchKey && this.searchKey != "" ? this.searchKey : null, this.searchKey && this.searchKey != "" ? this.searchColumn : null).subscribe( data => {
          let tableData = data as any;
          this.dataSource = new MatTableDataSource(tableData.data);
          this.pageLength = tableData.totalCount;
          this.pageSize = tableData.pageSize;
          this.cdr.detectChanges();
      })
    }
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);

      return data.warehouse?.name.toLowerCase().indexOf(searchTerms.warehouse.toLowerCase()) !== -1
        && data.address.province.concat(", " + data.address.city).toLowerCase().indexOf(searchTerms.area.toLowerCase()) !== -1
        && data.status.toString().indexOf(searchTerms.orderStatus) !== -1
    }
    return filterFunction;
  }
}
