import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'
import { ProfileComponent } from './profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MainHeaderModule } from '../main-header/main-header.module';
import { ProfileDashboardSideNavComponent } from './profile-dashboard-side-nav/profile-dashboard-side-nav.component';
import { ProfileDashboardCardComponent } from './profile-dashboard-card/profile-dashboard-card.component';

import { PipesModule } from '../pipes/pipes.module';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { CategoryDialogComponent } from './category-management/category-dialog/category-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OrderManagementComponent } from './order-management/order-management.component';
import { OrderDialogComponent } from './order-management/order-dialog/order-dialog.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { ProductDialogComponent } from './product-management/product-dialog/product-dialog.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { InventoryDialogComponent } from './inventory-management/inventory-dialog/inventory-dialog.component';
import { OrderUpdateStatusDialogComponent } from './order-management/order-update-status-dialog/order-update-status-dialog.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { LogoManagementComponent } from './content-management/logo-management/logo-management.component';
import { LandingPageManagementComponent } from './content-management/landing-page-management/landing-page-management.component';
import { InsidePageManagementComponent } from './content-management/inside-page-management/inside-page-management.component';
import { CarouselManagementComponent } from './carousel-management/carousel-management.component';
import {NgxImageCompressService} from 'ngx-image-compress';
import { WarehouseManagementModule } from './warehouse-management/warehouse-management.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { CarouselDialogComponent } from './carousel-management/carousel-dialog/carousel-dialog.component';
import { CarouselDetailsComponent } from './carousel-management/carousel-details/carousel-details.component';
import { MatTreeModule } from '@angular/material/tree';
import { MaintenanceModule } from './maintenance/maintenance.module'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { JoditAngularModule } from 'jodit-angular';

import { RouterModule, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { RouterModule, Routes } from '@angular/router';
// import {ProfileRRoutes} from './profile-r.routing';
// import { MaintenanceComponent } from './maintenance/maintenance.component';



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileDashboardSideNavComponent,
    ProfileDashboardCardComponent,
    CategoryManagementComponent,
    CategoryDialogComponent,
    OrderManagementComponent,
    OrderDialogComponent,
    OrderUpdateStatusDialogComponent,
    ProductManagementComponent,
    ProductDialogComponent,
    InventoryManagementComponent,
    InventoryDialogComponent,
    ContentManagementComponent,
    LogoManagementComponent,
    LandingPageManagementComponent,
    InsidePageManagementComponent,
    CarouselManagementComponent,
    CarouselDialogComponent,
    CarouselDetailsComponent,
  ],
  imports: [
    //BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MainHeaderModule,
    PipesModule,
    MatTableModule,
    MatPaginatorModule,
    WarehouseManagementModule,
    MatTreeModule,
    MaintenanceModule, 
    RouterModule,  
    MatSlideToggleModule,
   
    ColorPickerModule,
    JoditAngularModule,
    MatFormFieldModule,
    ColorPickerModule
    
  ],
  providers: [NgxImageCompressService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports:[RouterLink]
})
export class ProfileModule { }
