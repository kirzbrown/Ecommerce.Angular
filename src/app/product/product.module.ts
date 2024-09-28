import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProductComponent } from './product.component';
import { ProductCategoryNavComponent } from './product-category-nav/product-category-nav.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { ProductItemThumbnailComponent } from './product-item-thumbnail/product-item-thumbnail.component';
import { ProductItemDetailsComponent } from './product-item-details/product-item-details.component';
import { ProductSearchBarComponent } from './product-search-bar/product-search-bar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ProductViewDetailsComponent } from './product-view-details/product-view-details.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductSuccessDialogComponent } from './product-view-details/product-success-dialog/product-success-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { ProductCheckoutComponent } from '../product-checkout/product-checkout.component';
import { SplitPipe } from '../pipes/split-string/split-string.pipe';

import { NgxGalleryModule } from 'ngx-gallery-9';
import { NgMagnizoomModule } from 'ng-magnizoom';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ProductGalleryComponent } from './product-view-details/product-gallery/product-gallery.component';
import { ProductCategoryTabComponent } from './product-category-tab/product-category-tab.component';
import { ProductDetailsConfigComponent } from './product-view-details/product-details-config/product-details-config.component';
import { GalleryViewerComponent } from './product-view-details/product-gallery/gallery-viewer/gallery-viewer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: ProductComponent },
  { path: 'details-config', component: ProductDetailsConfigComponent },
];

@NgModule({
  declarations: [
    ProductComponent,
    ProductCategoryTabComponent,
    ProductCategoryNavComponent,
    ProductListComponent,
    ProductGridComponent,
    ProductItemThumbnailComponent,
    ProductItemDetailsComponent,
    ProductViewDetailsComponent,
    ProductSearchBarComponent,
    ProductSuccessDialogComponent,
    ProductCheckoutComponent,
    SplitPipe,
    ProductGalleryComponent,
    ProductDetailsConfigComponent,
    GalleryViewerComponent
  ],
  imports: [
    LayoutModule,
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTabsModule,
    NgxGalleryModule,
    NgMagnizoomModule,
    AngularEditorModule,
    NgbModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    ProductComponent,
    ProductCategoryNavComponent,
    ProductListComponent,
    ProductGridComponent,
    ProductItemThumbnailComponent,
    ProductItemDetailsComponent,
    ProductViewDetailsComponent,
    ProductSearchBarComponent,
    ProductSuccessDialogComponent,
    ProductCheckoutComponent,
    RouterModule
  ]
})

export class ProductModule { }
