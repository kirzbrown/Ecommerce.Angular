import { Inject, Injectable } from '@angular/core';

import { UserManager, UserManagerSettings, User, WebStorageStateStore } from 'oidc-client';
import { Observable, of } from 'rxjs';

import { Router } from '@angular/router';
import { environment } from '../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  private manager = new UserManager(getClientSettings());
  private user: User = null;

    constructor(private router: Router) {
    this.manager.getUser().then(user => {
      this.user = user;
       if(this.user != undefined && this.user != null){
         let userDetail = this.user;
       }
    });
  }

  logout() {
    localStorage.setItem('isGuestCheckOutSuccess', JSON.stringify(false));
		return this.manager.signoutRedirect({ 'id_token_hint': this.user.id_token });
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getUser() {
    return this.user;
  }

  isAdmin() {
    return this.user.profile.role != null && this.user.profile.role.includes("Administrator");
  }
  
  isWarehouseAdmin() {
    return this.user.profile.role != null && this.user.profile.role.includes("WarehouseAdmin");
  }

  isGuest() {
    return this.user?.profile?.role != null && this.user?.profile?.role.includes("Guest");
  }

  getClaims(): any {
    return this.user?.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;
      localStorage.setItem('isGuestCheckOutSuccess', JSON.stringify(true));
  
      let checkoutlink = JSON.parse(localStorage.getItem('checkoutLink')) ?? null;
      if(checkoutlink != null) return;
      
      window.history.replaceState({},
            window.document.title,
            window.location.origin + window.location.pathname);
    });
    }

  getAccessToken(): Observable<string> {
    return of(this.user.access_token);
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: `${environment.identityServerUrl}`,
    client_id: `${environment.clientId}`,
    redirect_uri: `${environment.redirectUri}`,
    post_logout_redirect_uri: `${environment.postLogoutRedirectUri}`,
    response_type: "code",
    scope: "openid profile roles EcommerceCatalyst_api",
    filterProtocolClaims: true,
    loadUserInfo: true,
    userStore: new WebStorageStateStore({
      store: localStorage
    }),
    automaticSilentRenew: true
  };
}
