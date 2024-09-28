import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { AreaSelectorComponent } from 'src/app/area-selector/area-selector.component';
import { CartService } from 'src/app/cart/cart.service';
import { MainHeaderService } from 'src/app/main-header/main-header.service';
import { CartAddItemRequest } from 'src/app/models/cart-item-add-request.model';
import { AnonymousUserService } from 'src/app/services/anonymous-user.service';
import { CartCountService } from 'src/app/services/cart-count.service';
import { AddedToCartSnackbarComponent } from 'src/app/snackbar/added-to-cart-snackbar.component';
import { ErrorSnackbarComponent } from 'src/app/snackbar/error-snackbar.component';

@Component({
  selector: 'app-product-item-details',
  templateUrl: './product-item-details.component.html',
  styleUrls: ['./product-item-details.component.scss']
})
export class ProductItemDetailsComponent implements OnInit {
  @Input() product;
  @Input() viewType: any;
  
  $addToCart;
  adding = false;
  quantity = 1;

  constructor(    
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private anonymousUserService: AnonymousUserService,
    private authorizeService: AuthorizeService, 
    private cartService: CartService, 
    private snackBar: MatSnackBar,
    private router: Router,
    private guestCheckout: MainHeaderService,
    private cartCountService: CartCountService ) { }

  get isStreamer() {
    let streamer = this.product?.productTechnologies?.find(x => x.technology.name == "Streamer");
    
    if(streamer) return true

    return false;
  }

  get technologies() {
    if(this.product?.productTechnologies)
    {
      return this.product?.productTechnologies.map(x => x.technology)
    }

    return [];
  }

  get storeData() {
    return JSON.parse(localStorage.getItem('storeData')) ?? null;
  }

  get storeId() {
    return this.storeData?.id ?? 0
  }

  get stock() {
    if(this.product?.storeCatalogs)
    {
      let storeId = this.storeData?.id ?? 0;
      let storeCatalog = this.product?.storeCatalogs.filter(x => x.storeId == storeId)[0];

      if(storeCatalog) {
        return storeCatalog.stock;
      }
    }

    return 0;
  }

  get isLoggedIn(){
    return this.authorizeService.isLoggedIn();
  }

  get userId(){
    return this.authorizeService.getClaims()?.sub ?? null;
  }

  ngOnInit(): void {
  }

  buyNow(event:any) {
    event.stopPropagation();
    if (!this.quantity){ 
      this.showErrorSnackbarFromComponent("Quantity cannot be empty.")
      return;
    }

    this.showAreaSelector()
  }

  addToCart(event:any) {
    event.stopPropagation();
    if(this.adding) {
      return;
    }

    this.adding = true;

    if (!this.quantity){ 
      this.showErrorSnackbarFromComponent("Quantity cannot be empty.")
      return;
    }

    this.anonymousUserService.getAnonymousUserId().then(anonyUserId => {
      let addCartItem = new CartAddItemRequest(this.userId, anonyUserId, this.product.id, this.quantity);

    this.cartService.addToCart(addCartItem).subscribe(res => {
      if(!res.hasError) {
        this.showSnackbarFromComponent();
        this.cartCountService.setMessage();
      } else {
        this.showErrorSnackbarFromComponent(res.errorMessage);
      }

      this.adding = false;
      this.cdr.detectChanges();
    }, 
    (error => console.log(error)));
    });
  }



  showSnackbarFromComponent()
  {
    this.snackBar.openFromComponent(AddedToCartSnackbarComponent, {
      duration: 1500,
      panelClass: ["added-to-cart-snackbar"]
    });
  }

  showErrorSnackbarFromComponent(message)
  {
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: { message: message},
      duration: 1500,
      panelClass: ["error-snackbar"]
    });
  }

  showAreaSelector() {
    const dialogRef = this.dialog.open(AreaSelectorComponent, {
      width: '45vw',
      height: 'auto',
      minWidth: '45vw',
      position: {top:'63px'},
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        var checkoutData = { 
          id : this.product.id,
          quantity : this.quantity,
          action : 'buy',
          province : result.province,
          city: result.city
        }

        localStorage.setItem('CheckoutData', JSON.stringify(checkoutData));

        this.router.navigate([`checkout`])
        // this.cdr.detectChanges();
      }
    });
  }
}
