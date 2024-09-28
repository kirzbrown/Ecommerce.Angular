import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { CartItemUpdateRequest } from '../models/cart-item-update-request.model';
import { Cart, CartItem } from '../models/cart.model';
import { CheckoutFrom } from '../models/checkout-from.model';
import { Location } from '@angular/common';
import { ProductCheckoutService } from '../product-checkout/product-checkout.service';
import { ProductCatalogService } from '../product/product-catalog.service';
import { ErrorSnackbarComponent } from '../snackbar/error-snackbar.component';
import { CartService } from './cart.service';
import { AnonymousUserService } from '../services/anonymous-user.service';
import { MainHeaderService } from '../main-header/main-header.service';
import { HostListener } from "@angular/core";
import { CartCountService } from '../services/cart-count.service';
import { MatDialog } from '@angular/material/dialog';
import { AreaSelectorComponent } from '../area-selector/area-selector.component';
import { formatCurrency, getCurrencySymbol } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  checkoutItemId = 1;
  isChangeItem:boolean = false;

  cart: Cart;
  isDisabled = true;
  // cartItemsUpdateRequest: CartItemUpdateRequest[];
  isApplyVoucher:boolean = false;
  applyVoucherInput = new FormControl('', [Validators.required]);
  receiverContactInfo = new FormControl('', [Validators.required]);
  receiverEmail = new FormControl('', [Validators.required]);
  deliveryAddress = new FormControl('', [Validators.required]);
  receiverName = new FormControl('', [Validators.required]);

  checkoutItems:any = []
  checkoutItemsCopy:any =[];

  standardEstimatedDate;
  expressEstimatedDate;
  salesTax:number = 0;
  subTotal:number = 0;
  shippingFeeQuote:any = { standard: 100, express: 200};
  itemCount:any = 0;

  // Declare height and width variables
  scrHeight:any;
  scrWidth:any;
  isMobileView: boolean = false;


  constructor(
    private dialog: MatDialog,
    private anonymousUserService: AnonymousUserService,
    private location: Location,
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private authorizeService: AuthorizeService,
    private cdr: ChangeDetectorRef,
    private guestCheckout: MainHeaderService,
    private cartCountService: CartCountService) { 
      this.getRouteParams()
      this.getScreenSize();
  }

  ngOnInit(): void {
    this.isMobileView = this.scrWidth < 515 ? true : false;
    this.setData();    
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
  }

  getRouteParams(){
    this.route.params.subscribe(params => {
      this.checkoutItemId = params.id ? Number(params.id) : null

    });
  }
  get isLoggedIn() {
    return this.authorizeService.isLoggedIn();
  }
  get userId(){
    return this.authorizeService.getClaims()?.sub ?? '';
  }

  setData(){
    this.anonymousUserService.getAnonymousUserId().then(anonyUserId => {
      this.cartService.getCart(anonyUserId, this.userId).subscribe(res => {
        if(!res.hasError && res.data)
        {
          this.cart = res.data as Cart;
          let orderItems = this.cart.orderItems as CartItem[];
          
          if(orderItems.length > 0) 
            this.isDisabled = false;  

          this.checkoutItems = orderItems;
          this.checkoutItemsCopy = this.checkoutItems.map(x => Object.assign({}, x));
          this.setItemCount();
          this.cdr.detectChanges();
        }
      })
    });
  }

  setItemCount(){
    this.itemCount = 0;
    this.subTotal = 0;
    this.checkoutItems.forEach( d => {
      if(d.catalog.price && d.quantity){
        this.itemCount += d.quantity;
        this.subTotal += (d.catalog.price * d.quantity)
      }
    })
  }

  addItemQuantity(isAdd, index){
    if(isAdd){
      this.checkoutItems[index].quantity += 1
    } else {
      if (this.checkoutItems[index].quantity > 0)
        this.checkoutItems[index].quantity -= 1
    }

    this.setItemCount();
    this.cdr.detectChanges()
  }

  removeAll() {
    if(!this.cart || !this.cart.id)
      return;

    this.checkoutItems = [];
    this.isDisabled = true;
    this.cartService.clearCart(this.cart.id).subscribe(res => {
      if(!res.hasError) {
        this.cart = null;
        this.itemCount = 0;
        this.subTotal = 0;
        this.cdr.detectChanges()
        this.cartCountService.setMessage();
      } else {
        // show error dialog
        this.setData();
      }
    });
  }

  removeItem(item:any) {
    let checkoutItem = this.checkoutItems.find(x => x.id == item.id)
    checkoutItem.quantity = 0;
    this.setItemCount();
  }

  continueShopping() {
    this.location.back();
  }


  placeOrder() {
    if (!this.isLoggedIn){
      localStorage.setItem('isGuestCheckOutSuccess', JSON.stringify(false));
    }

    this.showBranchSelector()
  }

  setTotal(){
    return this.subTotal + this.salesTax;
  }

  saveItems(){
    this.isChangeItem = false;
    this.cdr.detectChanges();
    let cartItems: CartItemUpdateRequest[] = this.checkoutItems.map(x => new CartItemUpdateRequest(x.id, x.quantity));

    if(cartItems.length > 0) {
      this.cartService.updateCart(this.cart.id, cartItems).subscribe(res => {
        if(!res.hasError && res.data)
        {
          this.cart = res.data as Cart;
          let orderItems = this.cart.orderItems as CartItem[];
          
          if(orderItems.length == 0) 
            this.isDisabled = true;  

          this.checkoutItems = this.checkoutItems.filter(x => x.quantity > 0);
          
          this.cartCountService.setMessage();
        } else {
          this.showSnackbarFromComponent(res.errorMessage);
          this.setData();
        }
        
        this.cdr.detectChanges();
      });
    }
  }

  showSnackbarFromComponent(message)
  {
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: { message: message},
      duration: 1500,
      panelClass: ["error-snackbar"]
    });
  }

  showBranchSelector() {
    const dialogRef = this.dialog.open(AreaSelectorComponent, {
      width: this.isMobileView ? '80vw' : '45vw',
      height: 'auto',
      minWidth: this.isMobileView ? '80vw' :'45vw',
      position: {top:'63px'},
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        var checkoutData = { 
          id : this.cart.id,
          action : 'addToCart',
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
