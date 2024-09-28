import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { environment } from '../../environments/environment';
import { MainHeaderService } from './main-header.service';
import { HostListener } from "@angular/core";
import { CartService } from '../cart/cart.service';
import { AnonymousUserService } from '../services/anonymous-user.service';
import { CartCountService } from '../services/cart-count.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss']
})

export class MainHeaderComponent implements OnInit, OnDestroy, AfterContentChecked {
    @Input() headerColor: string;
    @Input() headerLogo: string;
    identityServerUrl: string;
    // Declare height and width variables
    scrHeight: any;
    scrWidth: any;
    isMenu: boolean = false;
    cartItemCount: number;
    subscription: Subscription;

    constructor(private router: Router,
        private authService: AuthorizeService,
        private guestCheckout: MainHeaderService,
        private anonymousUserService: AnonymousUserService,
        private cartService: CartService,
        private cdr: ChangeDetectorRef,
        private cartCountService: CartCountService,
    ) {
        this.identityServerUrl = environment.identityServerUrl;
        this.getScreenSize();
        this.subscription = this.cartCountService.getMessage().subscribe(x => {
            this.setCartItemCount();
        });
    }
    ngAfterContentChecked(): void {
        if(!this.cartItemCount && this.cartItemCount != 0) {
            this.setCartItemCount();
        }
    }

    get userId(){
        return this.authService.getClaims()?.sub ?? '';
    }

    setCartItemCount() {
        this.anonymousUserService.getAnonymousUserId().then(anonyUserId => {
            this.cartService.getCartItemCount(anonyUserId, this.userId).subscribe(res => {
                if (!res.hasError) {
                    this.cartItemCount = res.data;
                    this.cdr.detectChanges();
                }
            })
        });
    }

    ngOnInit(): void {
        this.isMenu = this.scrWidth < 515 ? true : false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    
    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
    }

    createAccount() {
        localStorage.setItem('isGuestCheckOutSuccess', JSON.stringify(false));
        window.location.href = this.identityServerUrl + 'Account/Register';
    }

    login() {
         localStorage.setItem('isGuestCheckOutSuccess', JSON.stringify(true));
        // this.guestCheckout.getIsGuestCheckout(true).subscribe(res => {

        // });
        localStorage.setItem('returnUrl', JSON.stringify(''));
        this.authService.startAuthentication();
    }

    myCart() {
        this.router.navigate(['/cart']);
    }

    trackMyOrder() {
        this.router.navigate(['/trackOrder']);
    }

    myProfile() {
        this.router.navigate(['/profile']);
    }

    mySettings() {
        window.location.href = this.identityServerUrl + 'Manage';
    }

    browse() {
        this.router.navigate(['/catalog']);
    }

    isLoggedIn(): boolean {
        // localStorage.setItem('isGuestCheckOutSuccess', JSON.stringify(true));
        return this.authService.isLoggedIn();
    }

    isGuest(): boolean {
        return this.authService.isGuest();
    }

    createStore() {
        this.router.navigate(['/store']);
    }

    homepage() {
        if (this.router.url === '/catalog') {
            window.location.reload();
        } else {
            this.router.navigate(['/catalog']);
        }

    }

    logout() {
        this.authService.logout();
    }
}
