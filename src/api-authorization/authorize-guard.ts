import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { AuthorizeService } from './authorize.service'

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {

    constructor(private authService: AuthorizeService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
      }
     
    localStorage.setItem('returnUrl', JSON.stringify(state.url));
    this.authService.startAuthentication();
    return false;
  }
}