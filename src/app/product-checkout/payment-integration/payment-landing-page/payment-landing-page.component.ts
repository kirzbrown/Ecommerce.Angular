import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { ProductCheckoutService } from '../../product-checkout.service';

@Component({
  selector: 'app-payment-landing-page',
  templateUrl: './payment-landing-page.component.html',
  styleUrls: ['./payment-landing-page.component.scss']
})
export class PaymentLandingPageComponent implements OnInit {

  action: string = '';
  merchantRefNo: string = '';
  paynamicsRefNo: string = '';
  amount;

  constructor(private productCheckoutService: ProductCheckoutService, 
    private authService: AuthorizeService,
    private router: Router, 
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef) {
    this.getRouteParams()
   }

  ngOnInit(): void {
  }

  getRouteParams(){
    this.route.data.subscribe(data => {
      this.action = data.action;
      this.cdr.detectChanges()
    });

    this.route.params.subscribe(params => {
      this.merchantRefNo = params.merchantRefNo;
      this.paynamicsRefNo = params.paynamicsRefNo;
      this.amount = params.amount;
      this.cdr.detectChanges()
     });
  }


}
