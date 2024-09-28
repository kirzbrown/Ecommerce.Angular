import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/_services/auth.service';
import { environment } from 'src/environments/environment';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
import { FakeAPIService } from './_fake/fake-api.service';
import { AuthorizeInterceptor } from '../api-authorization/authorize.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileModule } from './profile/profile.module'; 
import { MainHeaderModule } from './main-header/main-header.module';
import { MatTabsModule } from '@angular/material/tabs';
import { CartModule } from './cart/cart.module';
import { CreateStoreModule } from './create-store/create-store.module'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddedToCartSnackbarComponent } from './snackbar/added-to-cart-snackbar.component';
import { ErrorSnackbarComponent } from './snackbar/error-snackbar.component';
import { AuthCallbackComponent } from 'src/auth-callback/auth-callback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { MainFooterModule } from './main-footer/main-footer.module'; 
import {MatRadioModule} from '@angular/material/radio';
import { FaqPageComponent } from './supplementary-pages/faq-page/faq-page.component';
import { ContactUsPageComponent } from './supplementary-pages/contact-us-page/contact-us-page.component';
import { PrivacyPolicyPageComponent } from './supplementary-pages/privacy-policy-page/privacy-policy-page.component'; 
import { TrackOrderComponent } from './track-order/track-order.component';
import { AreaSelectorComponent } from './area-selector/area-selector.component';
import { PaymentIntegrationModule } from './product-checkout/payment-integration/payment-integration.module';
import { PromoMechanicsComponent } from './supplementary-pages/promo-mechanics/promo-mechanics.component';
import { ProductModule } from './product/product.module';

import {MatTreeModule} from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import { RouterModule, RouterLink } from '@angular/router';
import {MatBadgeModule} from '@angular/material/badge';

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}


@NgModule({
  declarations: [
    AppComponent, 
    AddedToCartSnackbarComponent, 
    ErrorSnackbarComponent, 
    AuthCallbackComponent, 
    FaqPageComponent, 
    ContactUsPageComponent, 
    PrivacyPolicyPageComponent, 
    TrackOrderComponent,     
    AreaSelectorComponent, PromoMechanicsComponent],    
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    HighlightModule,
    ClipboardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTreeModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule, 
    ProductModule, 
    ProfileModule, 
    MainHeaderModule , 
    CartModule, 
    CreateStoreModule, MainFooterModule ,
    PaymentIntegrationModule,
    CdkTreeModule,
    MatBadgeModule
],
  providers: [
    DatePipe,
    // AppComponent,
//    {
//      provide: APP_INITIALIZER,
//      useFactory: appInitializer,
//      multi: true,
//     deps: [AuthService],
//    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          json: () => import('highlight.js/lib/languages/json')
        },
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule, RouterLink]
})
export class AppModule { }
