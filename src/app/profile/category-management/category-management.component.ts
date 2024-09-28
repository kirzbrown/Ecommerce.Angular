import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { ManagementService } from '../../profile/category-management/services/management-service.component';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
//table
  @ViewChild(MatSort) sort: MatSort;
  searchKey: string = "";
  displayedColumns: string[] = ['name', 'description', 'action'];
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

  constructor(private authService: AuthorizeService,
              private cdr: ChangeDetectorRef, 
              private dialog: MatDialog,
              private managementService: ManagementService
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

  getList(pageEvent?: any){
    this.managementService.getPaginatedCategory(pageEvent ? pageEvent.pageSize : this.pageSize, pageEvent ? pageEvent.pageIndex : 0, this.searchKey && this.searchKey != "" ? this.searchKey : null).subscribe( data => {
      let tableData = data as any;
      this.dataSource = new MatTableDataSource(tableData.data);
      this.pageLength = tableData.totalCount;
      this.pageSize = tableData.pageSize;
      this.cdr.detectChanges();
    })
  }

  search(){
    this.getList();
  }
  
  openWizard(isAdd: boolean = false, data?: any){
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
        data: {
          isAdd: isAdd,
          userId: this.userId,
          selectedCategory: data
        },
        width: this.isMobileView ? '80vw' : '50vw',
        height: 'auto',
        minWidth: this.isMobileView ? '80vw' : '50vw',
        disableClose: true,
        autoFocus: false,
        panelClass: 'category-dialog-container',
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.getList()
        }
      });
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
        this.managementService.deleteCategory(categoryId).subscribe( result => {
          this.getList()
          Swal.fire('Deleted!','Your category has been deleted.','success')
        }, (err) => {
          Swal.fire('Unable to Delete','Your category is not deleted. Please try again..','success')
        })
      }
    })
  }
  

}

