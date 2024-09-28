import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subscription } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { CartAddItemRequest } from '../models/cart-item-add-request.model';
import { CartItemUpdateRequest } from '../models/cart-item-update-request.model';

const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";

const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': ''});

@Injectable({
  providedIn: 'root'
})

export class CartService {
  constructor(private http: HttpClient) {}

  private getAPIEndpoint(baseURL: string, queryParameter?: any) {
    switch (baseURL) {
        case `${CATALYST}GET-Cart`: return `${CATALYST_API_URL}CartAsync?userDeviceId=${queryParameter.userDeviceId}&userId=${queryParameter.userId}`
        case `${CATALYST}GET-CartItemCount`: return `${CATALYST_API_URL}CartAsync/ItemCount?userDeviceId=${queryParameter.userDeviceId}&userId=${queryParameter.userId}`
        case `${CATALYST}POST-Cart`: return `${CATALYST_API_URL}CartAsync`
        case `${CATALYST}PUT-Cart`: return `${CATALYST_API_URL}CartAsync/${queryParameter.cartId}`
        case `${CATALYST}DELETE-Cart`: return `${CATALYST_API_URL}CartAsync/${queryParameter.cartId}`
        default: return "";
    }
  }

  

  getCart(userDeviceId:string, userId: string): any {
    let queryParameter = { userDeviceId: userDeviceId, userId: userId}
    let url = this.getAPIEndpoint(`${CATALYST}GET-Cart`, queryParameter);

    return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
  }

  getCartItemCount(userDeviceId:string, userId: string): any {
    let queryParameter = { userDeviceId: userDeviceId, userId: userId}
    let url = this.getAPIEndpoint(`${CATALYST}GET-CartItemCount`, queryParameter);

    return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
  }

  addToCart(cartItem: CartAddItemRequest): any {
    let body = cartItem;
    let url = this.getAPIEndpoint(`${CATALYST}POST-Cart`);

    return this.http.post(url, body, { headers : INTERCEPTOR_SKIP_HEADER});
  }

  updateCart(cartId: number, cartItems: CartItemUpdateRequest[]): any {
    let queryParameter = { cartId: cartId}
    let body = cartItems;
    let url = this.getAPIEndpoint(`${CATALYST}PUT-Cart`, queryParameter);

    return this.http.put(url, body, { headers : INTERCEPTOR_SKIP_HEADER});
  }

  clearCart(cartId: number): any {
    let queryParameter = { cartId: cartId}
    let url = this.getAPIEndpoint(`${CATALYST}DELETE-Cart`, queryParameter);

    return this.http.delete(url, { headers : INTERCEPTOR_SKIP_HEADER});
  }
}
