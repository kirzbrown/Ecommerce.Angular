import { WhAddDialogComponent } from './wh-add-dialog/wh-add-dialog.component';
import { WhCardComponent } from './wh-card/wh-card.component';
import { WhSearchComponent } from './wh-search/wh-search.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { WarehouseManagementComponent } from './warehouse-management.component';
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
import { WhSelectComponent } from './wh-select/wh-select.component';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatBadgeModule} from '@angular/material/badge';


import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    decimal: ".",
    precision: 2,
    prefix: "₱ ",
    suffix: "",
    thousands: ","
};


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
    MatProgressSpinnerModule,

    LayoutModule,
  
    HttpClientModule,
    FlexLayoutModule,
    
    //NgxGalleryModule,
    //NgMagnizoomModule,
    AngularEditorModule,
    MatDialogModule,
    MatFormFieldModule,
    NgbModule,
    CurrencyMaskModule,
    MatSortModule,
    MatBadgeModule

  ],
  exports:[
    WarehouseManagementComponent,CurrencyMaskModule
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
],
  declarations: [WarehouseManagementComponent
    ,WhCardComponent,WhSelectComponent,WhAddDialogComponent
    ,WhSearchComponent]
})
export class WarehouseManagementModule { }
