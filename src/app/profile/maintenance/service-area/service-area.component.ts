import { DeliveryAreaListItem } from './../_model/maintenance-model';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';

import { HostListener } from "@angular/core";
import { ServiceAreaService } from '../_services/service-area.service';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { SaDialogComponent } from './sa-dialog/sa-dialog.component';




@Component({
  selector: 'app-service-area',
  templateUrl: './service-area.component.html',
  styleUrls: ['./service-area.component.scss']
})
export class ServiceAreaComponent implements OnInit {

  //table
  sortColumn = "province";
  sortOrder = "ASC";
  searchKey: string = "";
  searchColumn = "province";
  displayedColumns: string[] = ['name', 'entry', 'status', 'action'];
  dataSource = new MatTableDataSource<DeliveryAreaListItem>();

  //paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize: number = 10;
  pageLength: number = 0;
  userId: any;

  // Declare height and width variables
  scrHeight: any;
  scrWidth: any;
  isMobileView: boolean = false;


  constructor(private authService: AuthorizeService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private _service: ServiceAreaService
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

  }

  getList(pageEvent?: any,pageSize?:any) {
    //nagementService.getPaginatedOrder(pageEvent ? pageEvent.pageSize : this.pageSize, pageEvent ? pageEvent.pageIndex : 0, this.searchKey && this.searchKey != "" ? this.searchKey : null, this.searchKey && this.searchKey != "" ? this.searchColumn : null)
    this._service.getPaginatedProvinces(
      pageEvent ? pageEvent.pageSize : this.pageSize,
      pageEvent ? pageEvent.pageIndex : 0,
      this.sortColumn, 
      this.sortOrder,
      this.searchColumn,
      this.searchKey && this.searchKey != "" ? this.searchKey : null)
      .subscribe(data => {
        let tableData = data as any;
        this.dataSource = new MatTableDataSource<DeliveryAreaListItem>(tableData.data);

        if(pageSize)
        {
          this.paginator._changePageSize(this.paginator.pageSize);
        }else
        {
          this.pageLength = tableData.totalCount;
          this.pageSize = tableData.pageSize;  
        }      
        
        this.cdr.detectChanges();
      })
  }


  clearSearch(event) {
    if (this.searchKey != "") return;

    this.getList();
  }

  search(event?: any) {
    this.getList();
  }

  openWizard(isAdd: boolean = false, data?: any) {
    const dialogRef = this.dialog.open(SaDialogComponent, {
      data: {
        isAdd: isAdd,
        userId: this.userId,
        selected: data

      },
      width: this.isMobileView ? '80vw' : '50vw',
      height: '600px',
      minWidth: this.isMobileView ? '80vw' : '50vw',
      disableClose: true,
      autoFocus: true,
      panelClass: 'sa-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getList(null,this.paginator.pageSize)
      }
    });
  }

  save() {

  }
  closeDialog() {

  }

  toBoolean(status) {
    return Boolean(status);
  }

  deleteDialog(province,rowIndex:number) {
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
        this._service.deleteDeliveryArea(province).subscribe(result => {
          //this.getList()

          this.dataSource.data.splice(rowIndex, 1);
          this.dataSource._updateChangeSubscription();
                  
          Swal.fire('Deleted!', 'Service Area has been deleted.', 'success')
        }, (err) => {
          Swal.fire('Unable to Delete', 'Service Area is not deleted. Please try again..', 'success')
        })
      }
    })
  }

}
