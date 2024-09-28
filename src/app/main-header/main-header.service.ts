import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subscription } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { Router } from '@angular/router';

const IDENTITY_API_URL = `${environment.identityServerUrl}`;
const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': ''});

@Injectable({
  providedIn: 'root'
})

export class MainHeaderService {

  constructor(private http: HttpClient,
    private router: Router) {}

  private getAPIEndpoint(baseURL: string, queryParameter?: any) {
    switch (baseURL) {
      case `$GET-CheckOutGuest`: return `${IDENTITY_API_URL}Account/Checkout?isLogin=${queryParameter.isLogin}`
      case `$GET-GuestLogin`: return `${IDENTITY_API_URL}Account/GuestLogin?returnUrl=${queryParameter.returnUrl}`
        default: return "";
    }
  }

  getIsGuestCheckout(isLogin:boolean): any { 
    let checkoutLink = environment.ecommercespa + this.router.url;
    let queryParameter = {isLogin: isLogin, URL: checkoutLink};
    let url = this.getAPIEndpoint(`$GET-CheckOutGuest`,queryParameter);
    return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
  }

  getGuestLogin(returnURL:string): any { 
    let queryParameter = {returnURL};
    let url = this.getAPIEndpoint(`$GET-GuestLogin`, queryParameter);
    return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
  }
} 

