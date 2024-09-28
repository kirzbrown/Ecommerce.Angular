import { ChangeDetectorRef, Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { ProductCatalogService } from '../product/product-catalog.service';
import { ProductCheckoutService } from './product-checkout.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductSuccessDialogComponent } from '../product/product-view-details/product-success-dialog/product-success-dialog.component';
import { CartService } from '../cart/cart.service';
import { Cart, CartItem } from '../models/cart.model';
import { Location } from '@angular/common';
import { CheckoutFrom } from '../models/checkout-from.model';
import { BuyCheckoutRequest } from '../models/buy-checkout-request.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '../snackbar/error-snackbar.component';
import { CheckOutState } from '../models/checkout-state.model';
import { OrderStatus } from '../models/order-status-model';
import { X } from '@angular/cdk/keycodes';
import { CartCheckoutRequest } from '../models/cart-checkout-request.model';
import { AnonymousUserService } from '../services/anonymous-user.service';
import { CryptoJSService } from '../services/cryptojs.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SplitPayService } from '../services/splitpay.service'; 
import { HostListener } from "@angular/core";
import { MainHeaderService } from '../main-header/main-header.service';
import { CustomSpaSettingsService } from '../profile/content-management/services/custom-spa-settings.service';


@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  checkoutLogo: string;

  addresses = [];
  deliveryAddressFormGroup : FormGroup;
  selectedAddress;
  isDisabled = true;
  placedOrderId;
  confirmedOrder;
  confirmedOrderItems;
  confirmedAddress;
  regions = [];
  provinces = [];
  cities = [];
  selectedProvince;
  selectedCity;
 
  id;
  quantity;
  notes;
  cart: Cart = null;
  action;
  checkoutState: CheckOutState = CheckOutState.PlaceOrder;

  shippingFee:number = 0;
  subTotal:number = 0;
  itemCount:any = 0;

  checkoutItems:any = []

  //payment method
  paymentRequestId;
  settlementIdEcommerce;
  settlementIdDealer;
  selectedPaymentMethod;
  paymentChannelList = [];
  paymentStatusList = [];

  // Declare height and width variables
  scrHeight:any;
  scrWidth:any;
  isMobileView: boolean = false;
  isGuestLogin: boolean = false;
  isGuestCheckOutSuccess: boolean = false;
  identityServerUrl: string;
  constructor(private productCheckoutService: ProductCheckoutService, 
              private anonymousUserService: AnonymousUserService,
              private authService: AuthorizeService,
              private router: Router, 
              private route: ActivatedRoute,
              private location: Location,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private cryptoJSService: CryptoJSService,
              private splitPayService: SplitPayService,
              private cdr: ChangeDetectorRef,
              private guestCheckout: MainHeaderService,
              private customSpaSettingsService: CustomSpaSettingsService,) { 
                this.getParamsData()
                this.getScreenSize();
                this.identityServerUrl = environment.identityServerUrl;
                this.anonymousUserService.getAnonymousUserId().then(anonyUserId => this.userDeviceId = anonyUserId);
              }

  ngOnInit(): void {
    this.isMobileView = this.scrWidth < 515 ? true : false;
    this.handleGuestUserCache();
    this.loadFormControl();
    Swal.showLoading();
    this.setData();
    this.getPaymentChannel()
    this.getCurrentCheckoutLogo();
    this.setProvincesData();
  }

  setProvincesData() {
    if(this.checkoutState == CheckOutState.Confirmation) return;

    this.getProvinces();
  }


  getProvinces() {
    this.productCheckoutService.getProvinces().subscribe(res => {
      if(res) {
        this.provinces = res;
        this.cities = [];

        if(this.checkOutData?.province) {
          // this.selectedProvince = this.provinces.filter(x => x.name == this.checkOutData?.province)?.[0].name;
              this.deliveryAddressFormGroup.controls.province.setValue(this.checkOutData?.province);
    
          this.productCheckoutService.getCities(this.checkOutData?.province).subscribe(res => {
            if(res) {
              this.cities = res;
                             
              if(this.checkOutData?.city) {
                // this.selectedCity = this.cities.filter(x => x == this.checkOutData?.city)[0];
                this.deliveryAddressFormGroup.controls.city.setValue(this.checkOutData?.city);

                this.productCheckoutService.getShippingFee(this.checkOutData?.province, this.checkOutData?.city).subscribe(res => {
                  if(!res.hasError) {
                    this.shippingFee = res.data;
                    this.cdr.detectChanges();
                  }
                });

                this.cdr.detectChanges();
              }
            }
            Swal.close();
          })
        }
      }
    });
  }  

  getCities($event, province) {
    if($event.isUserInput) {
    this.productCheckoutService.getCities(province).subscribe(res => {
      if(res) {
        this.cities = res;
        this.deliveryAddressFormGroup.controls.city.setValue(null);
      }
    });
    }
  }

  updateShipping($event, city) {
    if($event.isUserInput) {
      var province = this.deliveryAddressFormGroup.get("province").value;

      this.productCheckoutService.getShippingFee(province, city).subscribe(res => {
        if(!res.hasError) {
          this.shippingFee = res.data;
        }
      });
    }
  }

  ngOnDestroy(): void {
    if(!this.router.routerState.snapshot.url.includes("checkout")) {
      if(this.authService.isGuest()) {
        this.authService.logout();
      }
    }
  }

  handleGuestUserCache(){
    this.isGuestCheckOutSuccess  = JSON.parse(localStorage.getItem('isGuestCheckOutSuccess')) ?? null;
    if(this.isGuestCheckOutSuccess != null && this.isGuestCheckOutSuccess){
      localStorage.removeItem('checkoutLink');
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
  }

  userDeviceId;
  
  get userId() {
    return this.authService?.getClaims()?.sub ?? ''
  }
  
  get storeData() {
    return JSON.parse(localStorage.getItem('storeData')) ?? null;
  }

  get storeId() {
    return this.storeData.id ?? 0
  }

  get deliveryAddress() {
    return JSON.parse(localStorage.getItem('deliveryAddress')) ?? null;
  }

  get checkOutData() {
    return JSON.parse(localStorage.getItem('CheckoutData'));
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
}
  continueAsGuest() {
    this.isGuestLogin = false;
    this.isGuestCheckOutSuccess = true;
    // this.guestCheckout.getIsGuestCheckout(this.isGuestLogin).subscribe(res => { });
    // localStorage.setItem('checkoutLink', JSON.stringify(this.router.url));
    // localStorage.setItem('isGuestCheckOutSuccess', JSON.stringify(true));
    // console.log(JSON.stringify(true))
    // this.authService.startAuthentication();
  }

  register(){
    localStorage.setItem('isGuestCheckOutSuccess', JSON.stringify(false));
    window.location.href = this.identityServerUrl + 'Account/Register';
  }

  signIn(){
     this.isGuestLogin = true;
     localStorage.setItem('checkoutLink', JSON.stringify(this.router.url));
    // this.guestCheckout.getIsGuestCheckout(this.isGuestLogin).subscribe(res => { });
    
    localStorage.setItem('isGuestCheckOutSuccess', JSON.stringify(true));
    this.authService.startAuthentication();
  }

  getParamsData(){
    this.route.params.subscribe(params => {
      this.placedOrderId = params.placedOrderId ? Number(params.placedOrderId) : null;
    });
  }

  loadFormControl(){
    this.deliveryAddressFormGroup = new FormGroup({
      streetName: new FormControl(null, [Validators.required]),
      province: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      barangay: new FormControl(null, [Validators.required]),
      zipCode: new FormControl(null, [Validators.required]),
      receiverName: new FormControl(null, [Validators.required]),
      receiverEmail: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]),
      receiverContactInfo: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(11), Validators.maxLength(11)]),
    })
  }

  order(){
    if(!this.isLoggedIn){
      return;
    }
    if (!this.deliveryAddressFormGroup.valid) {
      this.showValidationMsg(this.deliveryAddressFormGroup);
      return;
    }
    
    if (this.checkOutData.action == "buy") {
      this.anonymousUserService.getAnonymousUserId().then(anonyUserId => {
        let buyCheckoutRequest = new BuyCheckoutRequest(this.userId, anonyUserId, this.checkOutData.id, this.checkOutData.quantity, this.deliveryAddressFormGroup.getRawValue(), this.notes);

        this.productCheckoutService.placeBuyNowOrder(buyCheckoutRequest).subscribe(res => {
          if(!res.hasError) {
            this.placedOrderId = res.data;
            this.checkoutState = CheckOutState.Payment;
            this.cdr.detectChanges();
          }
          else {
            this.showSnackbarFromComponent(res.errorMessage);
          }
        });
      });
    }
    if (this.checkOutData.action == "addToCart") {
      let cartCheckoutRequest = new CartCheckoutRequest(this.checkOutData.id, this.deliveryAddressFormGroup.getRawValue(), this.notes);

      this.productCheckoutService.placeCartOrder(cartCheckoutRequest).subscribe(res => {
        if(!res.hasError) {
          this.placedOrderId = res.data;
          this.checkoutState = CheckOutState.Payment;
          this.cdr.detectChanges();
        }
        else {
          this.showSnackbarFromComponent(res.errorMessage);
        }
      });
    }
  }

  pay(){
    let trimmedName = this.deliveryAddressFormGroup.value.receiverName.split(',');//trim based on comma
    let link = {
      successLink: `${environment.postLogoutRedirectUri}checkout/success/${this.placedOrderId}`, //CHANGE TO Ecommerce SITE
      cancelledLink: `${environment.postLogoutRedirectUri}payment/cancelled/${this.paymentRequestId}/${this.paymentRequestId}/${this.setTotal().toFixed(2)}` //CHANGE TO Ecommerce SITE
    }

    // console.log(link.successLink)
    
    //create order
    this.createOrderPaymentService(link, trimmedName)
  }

  createOrderPaymentService(link, trimmedName){
    let pendingStatus = this.paymentStatusList.find(d => d.name.toLowerCase() == 'pending')
    let orderPaymentPayload = {
      orderId: this.placedOrderId,
      payment: { discountAmount: 0, shippingPrice: this.shippingFee, paymentChannelId: this.selectedPaymentMethod.id, paymentStatusId: pendingStatus.id}
    }

    
    Swal.fire({title: 'Please wait', showConfirmButton: false,allowOutsideClick: false,allowEscapeKey: false}); Swal.showLoading();
    this.productCheckoutService.createOrderPayment(orderPaymentPayload).subscribe(x => {
      Swal.close()
      //payment integ
      this.paymentIntegration(link, trimmedName);
    }, error => {console.log(error); Swal.close()})
  }

  initQueryTransaction(){
    let jsonData = {
      "request_id":"j2Y-2mfOvkK7rwXBDRUOFAW", //GenerateRequestId()
      "org_trxid2":"j2Y-2mfOvkK7rwXBDRUOFA", //Transaction Request Id
      "signature":"{{signatureTrx}}"
    }
    jsonData.signature = this.cryptoJSService.getQueryTransactionSignature(jsonData);
    this.productCheckoutService.getPaymentTransaction(jsonData).subscribe(x => {
      // console.log(x);
     }, error => {
       console.log(error)
     })
  }

  paymentIntegration(link, trimmedName){
   
    let jsonData = {
      "transaction": {
        "request_id": this.paymentRequestId, //GenerateRequestId()
        "notification_url": "https://releaseorder.azurewebsites.net/api/order/payment",
        "response_url": link.successLink, //Success Page Route
        "cancel_url": link.cancelledLink, //Cancel Page Route
        "pmethod": this.selectedPaymentMethod.paymentMethod, //PaymentChannel() => payment method
        "payment_action": this.selectedPaymentMethod.paymentAction, //PaymentChannel() => paymentAction
        "pchannel": this.selectedPaymentMethod.code, //PaymentChannel() => code
        "collection_method": "single_pay", //Hardcode
        "payment_notification_status": "1", //Hardcode
        "payment_notification_channel": "1", //Hardcode
        "amount": `${this.setTotal().toFixed(2)}`, //Total Amount
        "currency": "PHP", //Harcode
        "trx_type": this.selectedPaymentMethod.description == 'CREDITDEBITCARD' ? "sale" : null, //For credit only; null if not
        "signature": "{{signatureTrx}}" //Do not fill up. Already in the code below
      },
      "customer_info": {
        "fname": trimmedName[0],
        "lname": trimmedName[1] ? trimmedName[1] : trimmedName[0],
        "mname": trimmedName[2] ? trimmedName[2] : '',
        "email": this.deliveryAddressFormGroup.value.receiverEmail,
        "dob": "",
        "mobile": this.deliveryAddressFormGroup.value.receiverContactInfo,
        "signature": "{{signature}}" //Do not fill up. Already in the code below
      },
      "shipping_info": {
        "shipping_address1": this.deliveryAddressFormGroup.value.streetName + ", " + this.deliveryAddressFormGroup.value.barangay,
        "shipping_address2": this.deliveryAddressFormGroup.value.streetName + ", " + this.deliveryAddressFormGroup.value.barangay,
        "shipping_city": this.deliveryAddressFormGroup.value.city,
        "shipping_state": this.deliveryAddressFormGroup.value.province,
        "shipping_country": "Philippines",
        "shipping_zip": this.deliveryAddressFormGroup.value.zipCode
      },
      "billing_info": {
        "billing_address1": this.deliveryAddressFormGroup.value.streetName + ", " + this.deliveryAddressFormGroup.value.barangay,
        "billing_address2": this.deliveryAddressFormGroup.value.streetName + ", " + this.deliveryAddressFormGroup.value.barangay,
        "billing_city": this.deliveryAddressFormGroup.value.city,
        "billing_state": this.deliveryAddressFormGroup.value.province,
        "billing_country": "Philippines",
        "billing_zip": this.deliveryAddressFormGroup.value.zipCode
      },
      "order_details": {
        "orders": [ ],
        "subtotalprice": `${this.selectedPaymentMethod.paymentMethod.toLowerCase() == 'creditcard' ? this.subTotal : this.subTotal}`, // Orders => SubTotalPrice
        "shippingprice": `${this.shippingFee + (this.selectedPaymentMethod.paymentMethod.toLowerCase() == 'creditcard' ? 20 : 0)}`, //Hardcode
        "discountamount": "0.00", //Get Discount Amount
        "totalorderamount": `${this.setTotal().toFixed(2)}` //Total Amount
      }
    }
  
    //order details mapping
    this.checkoutItems.forEach(cItem => {
    jsonData.order_details.orders.push(  {
      "itemname": cItem.title,
      "quantity": cItem.itemQuantity,
      "unitprice": `${cItem.price.toFixed(2)}`,
      "totalprice": `${cItem.price.toFixed(2) * cItem.itemQuantity}` //If Bancnet => unit price value; If not = Total Amount 
      //this.selectedPaymentMethod.description == 'BANCNET' ? `${cItem.price.toFixed(2)}` :  
    })
    });
 
    //code snippet => signature mapping
    jsonData.transaction.signature = this.cryptoJSService.getTransactionSignature(jsonData);
    jsonData.customer_info.signature = this.cryptoJSService.getCustomerSignature(jsonData);

    //if bancnet - additional property for transaction fields
    if(this.selectedPaymentMethod.description == 'BANCNET'){
      jsonData.transaction['secure3d'] = "try3d"; //Hard code
      jsonData.transaction['trxtype'] = "sale"; //Hard code
    }


    let data = {
      userId: this.userId ?? this.userDeviceId,
      event: this.selectedPaymentMethod.description,
      price: jsonData.transaction.amount,
      from: new Date().toLocaleString(),
      to: new Date().toLocaleString(),
      transactionDate: new Date(),
      orderId:  this.placedOrderId,
      requestId: jsonData.transaction.request_id
    }
 
    Swal.fire({title: 'Please wait', showConfirmButton: false,allowOutsideClick: false,allowEscapeKey: false}); Swal.showLoading();
    this.createTransaction(data);
    //proceed to payment gateway- flow
    // console.log(jsonData)
    this.createPayment(jsonData)

    //proceed to split payment - flow
    // this.initPaybizzId(jsonData) 
    // ***ATTENTION*** this.initPaybizzId(jsonData) is commented for now. Ecommerce stops the split payment in phase 2
  }

  initPaybizzId(mainJsonData){
    Swal.fire({title: 'Please wait', showConfirmButton: false,allowOutsideClick: false,allowEscapeKey: false}); Swal.showLoading();
    let storeData = localStorage.getItem('storeData') ? JSON.parse(localStorage.getItem('storeData')) : { id: 1 };
    this.productCheckoutService.getStorePaybizzAccount(storeData.id).subscribe( r => {
      let dealer = r as any;
    }, (err) => {
      Swal.close()
    })
  }

  createTransaction(jsonData){
   this.productCheckoutService.createOrderTransaction(jsonData).subscribe(result => {
      
   }, error => {
     console.log(error);
   })
  }

  createPayment(jsonData){
     //api call
     this.productCheckoutService.createPayment(this.selectedPaymentMethod.description, jsonData).subscribe(result => {
       Swal.close()
       let paynamicResult = result as any;
      //  console.log("paynamicResult", paynamicResult);
       if(paynamicResult){
         window.location.href= this.setPaymentUrl(paynamicResult);
       } 
     }, error => {
       Swal.close()
      //  console.log("createPayment - error", error)
       this.generateRequestId()
       this.showSnackbarFromComponent(`Error occured on create payment ${error}`);
     })
  }

  setPaymentUrl(paynamicResult){
    return this.selectedPaymentMethod.paymentMethod.toLowerCase() == 'creditcard' ? paynamicResult.cc_info : paynamicResult.payment_action_info
  }

  triggerReleaseOrder(){
    if(this.placedOrderId) {
      
      Swal.fire({title: 'Please wait', showConfirmButton: false,allowOutsideClick: false,allowEscapeKey: false}); Swal.showLoading();
      this.productCheckoutService.releaseOrder(this.placedOrderId).subscribe(res => {

        // console.log("---release order", res)
        

        if(!res.hasError) {
          this.anonymousUserService.getAnonymousUserId().then(anonyId => {
            this.productCheckoutService.getOrder(res.data, this.userId, anonyId).subscribe(result => {
              if(!result.hasError) {
                this.confirmedOrder = result.data;
                this.confirmedOrderItems = result.data.orderItems;
                this.confirmedAddress = result.data.address;

                //transition to confirmation
                this.checkoutState = CheckOutState.Confirmation;
                Swal.close()
                this.cdr.detectChanges();
              }
            });
          })
        }
        else {
          this.showSnackbarFromComponent(res.errorMessage);
        }
      }, (err) => {
        console.log("release error", err)
        Swal.close()
      });
    }
  }

  paymentConfirmation(){
    
  }

  close(){
    this.router.navigate(['/catalog']);
  }

  setProvinceCity() {
    if(!this.checkOutData?.province || !this.checkOutData?.city) {
      this.showSnackbarFromComponent("province or city must be set")
      this.router.navigate(['/catalog']);
    }
  }

  
  getPaymentChannel(){
    this.generateRequestId()
    this.productCheckoutService.getPaymentChannel().subscribe(data => {
      this.paymentChannelList = data as any;
      this.paymentChannelList = this.paymentChannelList.map( pc => {
        pc['imageUrl'] = this.setPaymentChannelImage(pc.description)
        return pc;
      })
    })

    //get payment status
    this.getPaymentStatus()
  }

  getPaymentStatus(){
    this.productCheckoutService.getPaymentStatus().subscribe(data => {
      let paymentStatus = data as any;
      this.paymentStatusList = paymentStatus;
     }, error => {console.log(error)})
  }

  generateRequestId(){
    this.productCheckoutService.getNewRequestID().subscribe(data => {
      this.paymentRequestId = data;
    })

    this.productCheckoutService.getNewRequestID().subscribe(data => {
      this.settlementIdEcommerce = data;
    })

    this.productCheckoutService.getNewRequestID().subscribe(data => {
      this.settlementIdDealer = data;
    })
  }

  setPaymentChannelImage(type){
    switch(type){
      case 'UBP':
        return 'https://www.unionbankph.com/sites/default/files/inline-images/UBonline-logo.png';
      case 'RCBC':
        return 'https://1cms-img.imgix.net/RCBC_THUMB.png';
      case 'PNB':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw56JAkixCI6wUuC6pc04tGbX9CWhzi3hZ9-psjX0pmJ-yea4mXuxSEj3-XHH5ocbXvBY&usqp=CAU';
      case 'BPI':
        return 'https://res.cloudinary.com/bfhcf/image/upload/others/bpi.jpg';
      case 'BDO':
        return 'https://play-lh.googleusercontent.com/MRr83-RWopRLVUb7AkEECCk66AClADo988PMZ0Fe6I1QPNawMoYWNrHge2HusKLwtDQU';
      case 'BANCNET':
        return 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0014/0022/brand.gif?itok=UfHz7hHU';
      case 'WECHAT':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuuEtouDxK7xWyXDlBN5qStzB9IuFxMTYE-6ghU8TwEiuXn-2PWu9fOyqh5Q8ybIARaXU&usqp=CAU';
      case 'PAYMAYA':
        return 'https://iforum-sg.c.huawei.com/dddd/ph/images/2020/4/7/c8ac7792-5a2d-4958-b6bb-d1a223a1727b.png';
      case 'GRABPAY':
        return 'https://seeklogo.com/images/G/grab-pay-logo-A0CA65B6C4-seeklogo.com.png';
      case 'COINS':
        return 'https://synapseint.com/wp-content/uploads/2018/02/coinph.png';
      case 'ALIPAY':
        return 'https://www.kindpng.com/picc/m/548-5483145_blockchain-remittance-service-launched-by-alibaba-payment-alipay.png';
      case 'GCASH':
        return 'https://mb.com.ph/wp-content/uploads/2022/03/71023.png';
      default:
        return null;
    }
  }
 
  setData(){
    //for paynamic => should trigger release order once payment is successful
    if(this.placedOrderId){
      this.checkoutState = 3;
      this.triggerReleaseOrder()
      return;
    }

    if(this.checkOutData.action == "buy") {
      if(!this.checkOutData.id || !this.checkOutData.quantity) this.router.navigate(['error']);

      this.productCheckoutService.getCatalog(this.checkOutData.id).subscribe( res => {
        if(!res.hasError) {
          let checkoutItems = []
          let itemToPush = res.data;
          itemToPush.price = itemToPush.discountedPrice ? itemToPush.discountedPrice : itemToPush.price;
          itemToPush.itemQuantity = this.checkOutData.quantity;
          itemToPush.imageUrl = itemToPush.productImages[0]?.imageUrl;
          checkoutItems.push(itemToPush)
    
          this.checkoutItems = checkoutItems;
    
          this.setItemCount()
          this.cdr.detectChanges();
        } else {
          this.router.navigate(['error/404']);
        }
      })
    } 
    if(this.checkOutData.action == "addToCart") {
      this.anonymousUserService.getAnonymousUserId().then(anonyId => {
        this.productCheckoutService.getCart(this.checkOutData.id, this.userId, anonyId).subscribe(res => {
          if(res.data)
          {
            this.cart = res.data as Cart;
            let orderItems = this.cart.orderItems as CartItem[];

            console.log(orderItems)
  
            // if(this.cart.status == OrderStatus.PendingPayment) this.checkoutState = CheckOutState.Payment
  
            if (orderItems || orderItems.length > 0) {
              this.checkoutItems = orderItems.map(o => {
                return { 
                  imageUrl: o.imageUrl,
                  title: o.name,
                  model: o.model,
                  capacity: o.capacity,
                  itemQuantity: o.quantity,
                  price: o.discountedPrice > 0 ? o.discountedPrice : o.price,
                }
              });
              this.setItemCount();
              this.cdr.detectChanges();
            }
          }
          else {
            // this.router.navigate(['error/404']);
          }
        })
      });
    }
  }

  displayAddress(address) {
    if(!address) {
      return;
    }

    return `${address.streetBldgHouseNo} ${address.city}, ${address.province}, ${address.zipCode}`;
  }

  setItemCount(){
    this.itemCount = 0;
    this.checkoutItems.forEach( d => {
      if(d.price && d.itemQuantity){
        this.itemCount += d.itemQuantity;
        this.subTotal += (d.price * d.itemQuantity)
      }
    })
  }

  addItemQuantity(isAdd, index){
    if(isAdd){
      this.checkoutItems[index].itemQuantity += 1
    } else {
      this.checkoutItems[index].itemQuantity -= 1
    }

    this.cdr.detectChanges()
  }

  setTotal(){
    if(this.checkoutState == 2 && 
       this.selectedPaymentMethod && 
       this.selectedPaymentMethod.paymentMethod.toLowerCase() == 'creditcard'){
        return this.subTotal + this.shippingFee + 20;
       }

    return this.subTotal + this.shippingFee;
  }


  navigate(){
    if(this.authService.isGuest()) {
      this.authService.logout();
    }
    this.close()
  }

  showSnackbarFromComponent(message)
  {
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: { message: message},
      duration: 1500,
      panelClass: ["error-snackbar"]
    });
  }
  
  continueShopping() {
    this.close();
  }

  showValidationMsg(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];

        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup>formGroup.controls[key];
          this.showValidationMsg(formGroupChild);
        }

        control.markAsTouched();
      }
    }
  }

  
  getCurrentCheckoutLogo() {
    this.customSpaSettingsService.getCustomSPASettingAsync().subscribe(result => {
      let data = result as any;
      this.checkoutLogo = data.data.checkoutLogoImageUrl;
      this.cdr.detectChanges();
    }, (err) => {
      console.error(err);
    })
  }
}

