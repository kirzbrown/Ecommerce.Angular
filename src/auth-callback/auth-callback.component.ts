import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthorizeService } from '../api-authorization/authorize.service'

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styles: []
})
export class AuthCallbackComponent implements OnInit {

  error: boolean;
  constructor(private authService: AuthorizeService, private router: Router,
               private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.router.navigate(['']);

      this.authService.completeAuthentication().then(() => {
          const returnUrl = JSON.parse(localStorage.getItem('returnUrl'));

          if(returnUrl != null){
            this.router.navigate([returnUrl]);
          }
          
          let checkoutlink = JSON.parse(localStorage.getItem('checkoutLink')) ?? null;
          if(checkoutlink != null){
            this.router.navigate([checkoutlink]);
          }
     });
  }
}
