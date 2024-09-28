import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from '../api-authorization/authorize-guard';
import { AuthCallbackComponent } from '../auth-callback/auth-callback.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateStoreComponent } from './create-store/create-store.component'; 
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ContactUsPageComponent } from './supplementary-pages/contact-us-page/contact-us-page.component';
import { FaqPageComponent } from './supplementary-pages/faq-page/faq-page.component';
import { PrivacyPolicyPageComponent } from './supplementary-pages/privacy-policy-page/privacy-policy-page.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { PaymentLandingPageComponent } from './product-checkout/payment-integration/payment-landing-page/payment-landing-page.component';
import { PromoMechanicsComponent } from './supplementary-pages/promo-mechanics/promo-mechanics.component';

import { MaintainanceRoutesModule } from './profile/maintenance/maintainance.routing';



export const routes: Routes = [
  { path: 'privacy-policy', component: PrivacyPolicyPageComponent }, 
  { path: 'faq', component: FaqPageComponent }, 
  { path: 'contact-us', component: ContactUsPageComponent }, 
  { path: 'promo-mechanics', component: PromoMechanicsComponent }, 
  { path: 'store', canActivate: [AuthorizeGuard], component: CreateStoreComponent }, 
  { 
    path: 'trackOrder', 
    children: [
      { path: '', component: TrackOrderComponent },      
      { path: ':routeOrderNumber', component: TrackOrderComponent },
    ]
  },
   { path: 'profile', component: ProfileComponent, canActivate: [AuthorizeGuard], 
        children: MaintainanceRoutesModule.routes},

  // { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
  // {
  //   path: 'profile',
  //   canActivate: [AuthorizeGuard],    
  //   component: ProfileComponent,    
  // },
  {
    path: 'payment',
    children: [
      {
        path: 'cancelled', 
        component: PaymentLandingPageComponent, 
        data: { action : 'cancelled'} 
      },
      {
        path: 'success', 
        component: PaymentLandingPageComponent, 
        data: { action : 'success'} 
      },
      {
        path: 'cancelled/:merchantRefNo/:paynamicsRefNo/:amount', 
        component: PaymentLandingPageComponent, 
        data: { action : 'cancelled'} 
      },
    ],
  },
  {
    path: 'checkout',
    component: ProductCheckoutComponent,
    // children: [
    //   { 
    //     path: 'success/:id', 
    //     // canActivate: [AuthorizeGuard], 
    //     component: ProductCheckoutComponent
    //   },
    // ],
  },
  {
    path: 'checkout/success/:placedOrderId',
    component: ProductCheckoutComponent,
    // children: [
    //   { 
    //     path: 'success/:id', 
    //     // canActivate: [AuthorizeGuard], 
    //     component: ProductCheckoutComponent
    //   },
    // ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'auth-callback',
    component: AuthCallbackComponent
  },
  {
    path: 'cart',
    // canActivate: [AuthorizeGuard],
    loadChildren: () =>
    import('./cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: '',
    // canActivate: [AuthorizeGuard],
    loadChildren: () =>
    import('./product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'error',
    loadChildren: () =>
    import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  { path: '**', redirectTo: 'error/404' },
];


// imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
