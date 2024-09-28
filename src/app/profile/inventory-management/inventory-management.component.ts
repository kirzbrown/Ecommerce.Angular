import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoryDialogComponent } from '../category-management/category-dialog/category-dialog.component';
import { ProductManagementService } from '../product-management/services/product-management-service.component';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog.component';
import { InventoryManagementService } from './services/inventory-management-service';
import { HostListener } from "@angular/core";
import { WarehouseService } from '../warehouse-management/services/warehouse.service';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.scss']
})
export class InventoryManagementComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  searchColumn = "Name";
  searchKey: string = "";
  displayedColumns: string[] = this.isAdmin ? [
    'imageUrl', 'name', 'price', 'stock'
  ] : [
    'imageUrl', 'name', 'price', 'stock', 'action'
  ];
  dataSource = new MatTableDataSource<any>();
  warehouses;
  selectedWarehouse;
  warehouse

  //paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize: number = 10;
  pageLength: number = 0;

  // Declare height and width variables
  scrHeight:any;
  scrWidth:any;
  isMobileView: boolean = false;

  constructor(private cdr: ChangeDetectorRef, 
              private dialog: MatDialog,
              private router: Router,
              private authService: AuthorizeService,
              private managementService: InventoryManagementService,
              private warehouseManagementService : WarehouseService,
              private productManagementService: ProductManagementService,
              ) { 
                this.getScreenSize();
              }

  ngOnInit(): void {
    this.setInventoryData();
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

  get userId(){
    return this.authService.getClaims().sub;
  }

  get isAdmin(){
    return this.authService.isAdmin();
  }

  get isWarehouseAdmin(){
    return this.authService.isWarehouseAdmin();
  }

  saveDialog(id) {

  }

  changeWarehouse(event? :any) {
    this.getList();
  }

  getStock(element: any) {
    let warehouseCatalog = this.getWarehouseCatalog(element);

    return warehouseCatalog ? warehouseCatalog.stock : 0;
  }

  getWarehouseCatalog(element) {
    return this.isAdmin ? element?.warehouseCatalogs?.filter(x => x.warehouseId ==  this.selectedWarehouse?.id)[0] : element?.warehouseCatalogs?.filter(x => x.warehouseId ==  this.warehouse?.id)[0];
  }

  setInventoryData() {
    if(this.isAdmin) {
      this.warehouseManagementService.getAllWarehouses().subscribe(result => {
        let data = result as any;
        this.warehouses = data;
        this.selectedWarehouse = this.warehouses[0];
        // this.cdr.detectChanges();
        this.getList();
      });
    }

    if(this.isWarehouseAdmin) {
      this.warehouseManagementService.getWarehouseByAdminUserId(this.userId).subscribe(result => {
        if(!result.hasError) {
  
          this.warehouse = result.data;
          // this.cdr.detectChanges();
  
          this.getList();
        }
  
      });
    }
  }

  getList(pageEvent?: any){
    this.productManagementService.getPaginatedCatalog(pageEvent ? pageEvent.pageSize : this.pageSize, pageEvent ? pageEvent.pageIndex : 0, this.searchKey && this.searchKey != "" ? this.searchKey : null, this.searchColumn).subscribe( data => {
      let tableData = data as any;
      this.dataSource = new MatTableDataSource(tableData.data);
      this.pageLength = tableData.totalCount;
      this.pageSize = tableData.pageSize;
      this.cdr.detectChanges();
    })
  }
  
  openWizard(data?: any){
    const dialogRef = this.dialog.open(InventoryDialogComponent, {
        data: {
          stock: this.getStock(data),
          isActive: true,
          warehouseId: this.warehouse.id,
          catalogId: data.id
        },
        width: this.isMobileView ? '80vw' : '50vw',
        minWidth: this.isMobileView ? '80vw' : '50vw',
        disableClose: true,
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.getList()
        }
      });
  }
}
