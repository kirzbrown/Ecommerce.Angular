import { WarehouseManagementModule } from '../warehouse-management/warehouse-management.module';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MainHeaderModule } from 'src/app/main-header/main-header.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatTableModule } from '@angular/material/table';


import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RouterModule, Routes } from '@angular/router';
import { ServiceAreaComponent } from './service-area/service-area.component';
import { WarehouseManagementComponent } from '../warehouse-management/warehouse-management.component';
import { MaintainanceRoutesModule } from './maintainance.routing';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SaDialogComponent } from './service-area/sa-dialog/sa-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollTopComponent } from 'src/app/shared/scroll-top/scroll-top.component';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
  imports: [
    CommonModule,
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
    MatSlideToggleModule,
    CdkAccordionModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDialogModule,

    LayoutModule,
  
    HttpClientModule,
    FlexLayoutModule,    
    
    AngularEditorModule,
    NgbModule,
    //RouterModule.forChild(routes),
    WarehouseManagementModule,
    MaintainanceRoutesModule,
    MatBadgeModule
    
  ],
  declarations: [ServiceAreaComponent,SaDialogComponent,ScrollTopComponent],
  //exports:[MaintenanceComponent]
  
})
export class MaintenanceModule { }

