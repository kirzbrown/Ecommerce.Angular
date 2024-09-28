import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductCheckoutService } from 'src/app/product-checkout/product-checkout.service';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MyFlatNode, Navs } from 'src/app/models/infra';

//imports {MyFlatNode} form '.src\app\models\infra.ts'


@Component({
  selector: 'app-profile-dashboard-side-nav',
  templateUrl: './profile-dashboard-side-nav.component.html',
  styleUrls: ['./profile-dashboard-side-nav.component.scss']
})
export class ProfileDashboardSideNavComponent implements OnInit {
  @Output() changeSelectedNav = new EventEmitter();
  @Input() navlist;
  @Input() username;

 //#region ---JSON NAVIGATION
  selectedNavigation: string;
  
  TREE_DATA: Navs[] =
    this.isAdmin ? [
      { name: 'Warehouse', icon: 'home', hasChild: false, childs: [], iconSize: null, routerLink: null },
      { name: 'Product', icon: 'inventory_2', hasChild: false, childs: [], iconSize: null, routerLink: null },
      { name: 'Category', icon: 'category', hasChild: false, childs: [], iconSize: null, routerLink: null },
      { name: 'Inventory', icon: 'inventory_2', hasChild: false, childs: [], iconSize: null, routerLink: null },
      { name: 'Users', icon: 'account_circle', hasChild: false, childs: [], iconSize: 19, routerLink: null },
      { name: 'Orders', icon: 'list_alt', hasChild: false, childs: [], iconSize: 19, routerLink: null },

      {
        name: 'Content', icon: 'brush', hasChild: true, childs: [
          { name: 'Carousel Banner', icon: '-', hasChild: false, childs: [], iconSize: 19, routerLink: null },
          { name: 'Content Management', icon: '-', hasChild: false, childs: [], iconSize: 19, routerLink: null }
        ], iconSize: 19, routerLink: null
      },

      {
        name: 'Maintenance', icon: 'settings', hasChild: true, childs: [
          { name: 'Service Area', icon: '-', hasChild: false, childs: [], iconSize: 19, routerLink: 'profile/service' }
          //,{ name: 'Warehouse', icon: '-', hasChild: false, childs: [], iconSize: 19, routerLink: null }
        ], iconSize: 19, routerLink: null
      },
    ] : (this.isWarehouseAdmin ? [
      { name: 'Orders', icon: 'list_alt', hasChild: false, childs: [], iconSize: 19, routerLink: null },
      { name: 'Inventory', icon: 'inventory_2', hasChild: false, childs: [], iconSize: null, routerLink: null },
    ] : [
      { name: 'Orders', icon: 'list_alt', hasChild: false, childs: [], iconSize: 19, routerLink: null }
    ]);

   

 
  private _transformer = (node: Navs, level: number) => {
    return {
      expandable: !!node.childs && node.childs.length > 0,
      name: node.name,
      level: level,
      icon: node.icon,
      hasChild: node.hasChild,
      iconSize: node.iconSize,
      routerLink:node.routerLink
    };
  }

  treeControl = new FlatTreeControl<MyFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.childs);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: MyFlatNode) => node.expandable;
  //#endregion

  constructor(
    private router: Router,
    private authorizeServce: AuthorizeService,
    private productCheckoutService: ProductCheckoutService,
    private cryptoJSService: CryptoJSService,
    private splitPayService: SplitPayService
  ) {
    this.dataSource.data = this.TREE_DATA;
  }

  get isAdmin() {
    return this.authorizeServce.isAdmin();
  }

  get isWarehouseAdmin() {
    return this.authorizeServce.isWarehouseAdmin();
  }

  ngOnInit(): void {
    this.selectedNavigation = this.navlist[0]?.name
  }


  setSize(size) {

    if (size == null) {
      return '24px';
    } else {
      return size + 'px';
    }
  }

  createItem() {
    this.router.navigate(["/item/add"]);
  }

  createStore() {
    this.router.navigate(['/store']);
  }

  changeNavigation(nav: any) {
    this.selectedNavigation = nav.name
   

    if(nav.routerLink)
    {      
      this.router.navigate([nav.routerLink]);
    }
    
    this.changeSelectedNav.emit({
      nav: this.selectedNavigation,
      node:nav
    });
  
    

  }
}
