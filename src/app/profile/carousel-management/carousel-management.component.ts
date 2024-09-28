import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CarouselDialogComponent } from './carousel-dialog/carousel-dialog.component';
import { CarouselService } from './services/carousel.service';

@Component({
  selector: 'app-carousel-management',
  templateUrl: './carousel-management.component.html',
  styleUrls: ['./carousel-management.component.scss']
})
export class CarouselManagementComponent implements OnInit {
  isAdd: boolean = true;
  isMobileView: boolean = false;
  scrWidth: any;

  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [10, 30, 50];
  dataCount: number = 0;
  dataSource: any;
  sortColumn: string = "";
  sortOrder: string = "";
  filterColumn: string = "";
  filterQuery: string = "";
  carouselList: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private carouselService: CarouselService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    Swal.showLoading();
    this.getDataByPage(true);
    this.isMobileView = this.scrWidth < 515 ? true : false;
  }

  openWizard(isAdd: boolean = true, data?: any) {
    const dialogRef = this.dialog.open(CarouselDialogComponent, {
      data: {
        isAdd: isAdd,
        selectedCategory: data
      },
      width: this.isMobileView ? '67vw' : '37vw',
      minWidth: this.isMobileView ? '67vw' : '37vw',
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Swal.showLoading();
        this.getDataByPage(false)
      }
    });

  }

  getDataByPage(swalClose = true, filterColumn?, filterQuery?) {
    this.carouselService.getDataByPage(this.pageIndex, this.pageSize, this.sortColumn, this.sortOrder, encodeURIComponent(filterColumn ? filterColumn : this.filterColumn), encodeURIComponent(filterQuery ? filterQuery : this.filterQuery)).subscribe(result => {
      this.carouselList = result["data"];
      this.pageSize = result["pageSize"];
      this.pageIndex = result["pageIndex"];
      this.sortColumn = result["sortColumn"] == null ? "" : result["sortColumn"];
      this.sortOrder = result["sortOrder"] == null ? "" : result["sortOrder"];
      this.filterColumn = result["filterColumn"] == null ? this.filterColumn : result["filterColumn"];
      this.filterQuery = result["filterQuery"] == null ? this.filterQuery : result["filterQuery"];
      this.dataCount = result["totalCount"];

      if (swalClose)
        Swal.close();
      else
        Swal.hideLoading();

      this.cdr.detectChanges();
    })
  }

  onPaginatorClicked(event) {
    Swal.showLoading();
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getDataByPage(true);
  }
}
