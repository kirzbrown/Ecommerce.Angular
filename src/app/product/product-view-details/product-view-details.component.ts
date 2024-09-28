import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CartService } from 'src/app/cart/cart.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AddedToCartSnackbarComponent } from 'src/app/snackbar/added-to-cart-snackbar.component';
import { CartAddItemRequest } from 'src/app/models/cart-item-add-request.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ErrorSnackbarComponent } from 'src/app/snackbar/error-snackbar.component';
import { AnonymousUserService } from 'src/app/services/anonymous-user.service';
import { AppComponent } from 'src/app/app.component';
import { CartCountService } from 'src/app/services/cart-count.service';
import { MatDialog } from '@angular/material/dialog';
import { AreaSelectorComponent } from 'src/app/area-selector/area-selector.component';


@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrls: ['./product-view-details.component.scss']
})
export class ProductViewDetailsComponent implements OnInit {
  @ViewChild('scroll', {static: false}) public scroll: ElementRef<any>;
  @ViewChild('mainContainer', {static: false}) mainContainer: ElementRef;
  @Output() productOnChanges : EventEmitter<any> = new EventEmitter();
  @Input() viewType: any;
  @Input() item: any;
  itemBought: any;
  identityServerUrl: string;
  quantity: number = 1;
  itemCount: number;
  productTypeViews = ["techs", "feats", "specs"]
  productTypeView: string = 'techs'
  productTechnologies: any[];
  adding = false;

  get isStreamer() {
    let streamer = this.item?.productTechnologies?.find(x => x.technology.name == "Streamer");
    
    if(streamer) return true

    return false;
  }

  get technologies() {
    if(this.item?.productTechnologies)
    {
      return this.item?.productTechnologies.map(x => x.technology)
    }

    return [];
  }

  get isLoggedIn(){
    return this.authorizeService.isLoggedIn();
  }

  get userId(){
    return this.authorizeService.getClaims()?.sub ?? null;
  }



  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private anonymousUserService: AnonymousUserService,
    private authorizeService: AuthorizeService, 
    private router: Router, 
    private cartService: CartService, 
    private cdr: ChangeDetectorRef,
    private cartCountService: CartCountService,
    public myapp: AppComponent,
    private sanitizer: DomSanitizer) {
    this.identityServerUrl = environment.identityServerUrl;
  }

  ngOnInit(): void {
    // this.item.productImages?.shift();
  }

  ngOnChanges() {
    if(this.item){
      this.productTechnologies = this.item.productTechnologies;
    }
  }

  ngAfterViewInit() {
    this.initScroll();
  }

  initScroll(){
    this.mainContainer.nativeElement.focus()
    this.scroll.nativeElement.scrollTop = 0;
    this.myapp.scrollToTop();
  }
  
  sanatizeHtml(htmlString) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  goBackToCatalog(){
    this.productOnChanges.emit({ viewType: "list" });
  }

  buyItem(item: any){
    this.showAreaSelector(item)
  }

  addToCart(item: any) {
    if(this.adding) {
      return;
    }

    this.adding = true;


    this.anonymousUserService.getAnonymousUserId().then(anonyUserId => {
      let addCartItem = new CartAddItemRequest(this.userId, anonyUserId, item.id, this.quantity);

      this.cartService.addToCart(addCartItem).subscribe(res => {
        if(!res.hasError) {
          this.showAddToCartSnackbarFromComponent();
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

  addItemQuantity(isAdd){
    if(!isAdd && this.quantity == 1) return;

    if(isAdd){
      this.quantity += 1
    } else {
      if (this.quantity > 0)
        this.quantity -= 1
    }

    this.cdr.detectChanges()
  }

  scrollToTop() {
    this.scroll.nativeElement.scrollTop = 0;
    window.scrollTo(0, 0);
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    document.getElementById('mainContainer').scrollTop = 0

  }

  filterByProductTypeView(event: any){
    this.productTypeView = this.productTypeViews[event.index];
    let element = document.getElementById(this.productTypeView);
    if(element){this.scrollToElement(element);}
  }

  scrollToElement(element): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  showAddToCartSnackbarFromComponent(){
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

  showAreaSelector(item) {
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
          id : item.id,
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
