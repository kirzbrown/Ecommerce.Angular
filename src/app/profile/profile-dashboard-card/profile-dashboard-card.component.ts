import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-dashboard-card',
  templateUrl: './profile-dashboard-card.component.html',
  styleUrls: ['./profile-dashboard-card.component.css']
})
export class ProfileDashboardCardComponent implements OnInit {
  @Input() viewType;
  @Input() columns: any = [];
  productList: any = [];
  reqs: Observable<any>[] = [];
  
  
  constructor(
    private cdr: ChangeDetectorRef,
    private profileDashboardService: ProfileService, 
    private authorizeService: AuthorizeService,) { }


  ngOnChanges(changes: SimpleChanges) {
    if(changes.viewType.currentValue == "Catalog") {
      this.setCatalogData();
    }
    else {
      this.productList = [];
    }      
  }

  ngOnInit(): void {
    this.setCatalogData();
  }

  setCatalogData() {
    this.profileDashboardService.getCatalogItems().subscribe(result => {
      if (result.length > 0) {
        this.productList = result;
        this.cdr.detectChanges();
      }
    });
  }

}
