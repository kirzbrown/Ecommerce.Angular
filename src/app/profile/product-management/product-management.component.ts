import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoryDialogComponent } from '../category-management/category-dialog/category-dialog.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductManagementService } from './services/product-management-service.component';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  searchColumn = "Title";
  searchKey: string = "";
  displayedColumns: string[] = ['imageUrl', 'name', 'description', 'price', 'action'];
  dataSource = new MatTableDataSource<any>();

  //paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize: number = 10;
  pageLength: number = 0;
  userId: any;

 
  // Declare height and width variables
  scrHeight:any;
  scrWidth:any;
  isMobileView: boolean = false;
  
  constructor(private cdr: ChangeDetectorRef, 
              private dialog: MatDialog,
              private managementService: ProductManagementService
              ) { 
                this.getScreenSize();
              }

  ngOnInit(): void {
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

  deleteDialog(categoryId){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.managementService.deleteCatalog(categoryId).subscribe( result => {
          this.getList()
          Swal.fire('Deleted!','Your product has been deleted.','success')
        }, (err) => {
          Swal.fire('Unable to Delete','Your product is not deleted. Please try again..','success')
        })
      }
    })
  }

  clearSearch(event) {
    if(this.searchKey != "") return;

    this.getList();
  }

  search(event? :any) {
    this.getList();
  }

  getList(pageEvent?: any){
    this.managementService.getPaginatedCatalog(pageEvent ? pageEvent.pageSize : this.pageSize, pageEvent ? pageEvent.pageIndex : 0, this.searchKey && this.searchKey != "" ? this.searchKey : null, this.searchColumn).subscribe( data => {
      let tableData = data as any;
      this.dataSource = new MatTableDataSource(tableData.data);
      this.pageLength = tableData.totalCount;
      this.pageSize = tableData.pageSize;
      this.cdr.detectChanges();
    })
  }
  
  openWizard(isAdd: boolean = false, data?: any){
    const dialogRef = this.dialog.open(ProductDialogComponent, {
        data: {
          isAdd: isAdd,
          userId: this.userId,
          selectedProduct: data
        },
        width: this.isMobileView ? '80vw' : '55vw',
        height: 'auto',
        minWidth: this.isMobileView ? '80vw' : '55vw',
        disableClose: true,
        autoFocus: false,
        panelClass: 'product-dialog-container',
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.getList()
        }
      });
  }
}
