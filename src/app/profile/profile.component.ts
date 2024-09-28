import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { combineLatest, Observable } from 'rxjs';
import { ProductCatalogService } from '../product/product-catalog.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AnonymousUserService } from '../services/anonymous-user.service';
import { MyFlatNode, Navs } from '../models/infra';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  navlist = this.isAdmin ? [
    { name: 'Warehouse', icon: 'home', hasChild: false, childs: [], iconSize: null},
    { name: 'Product', icon: 'inventory_2', hasChild: false, childs: [], iconSize: null},
    { name: 'Category', icon: 'category', hasChild: false, childs: [], iconSize: null},
    { name: 'Inventory', icon: 'inventory_2', hasChild: false, childs: [], iconSize: null},
    { name: 'Users', icon: 'account_circle', hasChild: false, childs: [], iconSize: 19},
    { name: 'Orders', icon: 'list_alt', hasChild: false, childs: [], iconSize: 19},
    { name: 'Carousel Banner', icon: 'list_alt', hasChild: false, childs: [], iconSize: 19},
    { name: 'Content Management', icon: 'list_alt', hasChild: false, childs: [], iconSize: 19},
  ] : (this.isWarehouseAdmin ? [
    { name: 'Orders', icon: 'list_alt', hasChild: false, childs: [], iconSize: 19},
    { name: 'Inventory', icon: 'inventory_2', hasChild: false, childs: [], iconSize: null},
  ] : [
    { name: 'Orders', icon: 'list_alt', hasChild: false, childs: [], iconSize: 19}
  ]);

  username: any;
  navType = this.navlist[0]?.name;
  identityServerAdminUrl: any;

  currentNode:any = this.navlist[0]; 

  constructor(
    private authService: AuthorizeService,
    private router: Router,
    private anonymousUserService: AnonymousUserService,
    private deviceDetectorService: DeviceDetectorService) {
    this.identityServerAdminUrl = environment.identityServerAdminUrl;
  }

    get userId(){
      return this.authService.getClaims()?.sub ?? '';
  }

  ngOnInit(): void {
    this.username = this.authService.getClaims().preferred_username;
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  get isWarehouseAdmin() {
    return this.authService.isWarehouseAdmin();
  }

  setSize(size) {
    if (size == null) {
      return '24px';
    } else {
      return size + 'px';
    }
  }

  changeSelectedNav(event) {
    this.currentNode = event.node;
    this.navType = event.nav

    if (event.nav == 'Users') {
      window.location.href = this.identityServerAdminUrl + 'Identity/Users';
    }
  }
}
