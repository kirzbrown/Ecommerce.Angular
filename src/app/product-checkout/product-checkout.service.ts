import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";

const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";
const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': ''});

@Injectable({
    providedIn: 'root'
})

export class ProductCheckoutService {
    constructor(private http: HttpClient) { }

    private getAPIEndpoint(baseURL: string, queryParameter?: any) {
        switch (baseURL) {
            case `${CATALYST}POST-CartOrder`: return `${CATALYST_API_URL}CheckoutAsync/CartOrder`
            case `${CATALYST}POST-BuyNowOrder`: return `${CATALYST_API_URL}CheckoutAsync/BuyNowOrder`
            case `${CATALYST}GET-Order`: return `${CATALYST_API_URL}CheckoutAsync/Order?&orderId=${queryParameter.orderId}&userId=${queryParameter.userId}&userDeviceId=${queryParameter.userDeviceId}`
            case `${CATALYST}GET-Cart`: return `${CATALYST_API_URL}CheckoutAsync/Cart?&orderId=${queryParameter.orderId}&userId=${queryParameter.userId}&userDeviceId=${queryParameter.userDeviceId}`
            case `${CATALYST}GET-Catalog`: return `${CATALYST_API_URL}CheckoutAsync/Catalog?&catalogId=${queryParameter.catalogId}`
            case `${CATALYST}GET-OrderRelease`: return `${CATALYST_API_URL}CheckoutAsync/Order/Release/${queryParameter.id}`
            case `${CATALYST}GET-ShippingFee`: return `${CATALYST_API_URL}CheckoutAsync/Order/ShippingFee?&province=${queryParameter.province}&city=${queryParameter.city}`
            case `${CATALYST}POST-Payment`: return `${CATALYST_API_URL}PaynamicsAsync/PaymentRequest?paymentType=${queryParameter.paymentType}`
            case `${CATALYST}POST-QueryTransaction`: return `${CATALYST_API_URL}PaynamicsAsync/QueryTransaction`
            case `${CATALYST}GET-PaymentChannelAsync`: return `${CATALYST_API_URL}PaynamicsAsync/PaymentChannels`
            case `${CATALYST}GET-NewRequestID`: return `${CATALYST_API_URL}PaynamicsAsync/NewRequestID`
            case `${CATALYST}GET-PaybizzAccount`: return `${CATALYST_API_URL}PaynamicsAsync/PaybizzAccount`
            case `${CATALYST}GET-StorePaybizzAccount`: return `${CATALYST_API_URL}CustomWarehouseAsync/WarehousePaybizzAccount/${queryParameter.id}`
            case `${CATALYST}POST-OrderPayment`: return `${CATALYST_API_URL}CustomOrderAsync/OrderPayment`
            case `${CATALYST}POST-OrderTransaction`: return `${CATALYST_API_URL}CustomOrderAsync/OrderTransaction`
            case `${CATALYST}GET-PaymentStatus`: return `${CATALYST_API_URL}PaynamicsAsync/PaymentStatus`
            case `${CATALYST}GET-Provinces`: return `${CATALYST_API_URL}CustomDeliveryAreaAsync/Provinces`
            case `${CATALYST}GET-Cities`: return `${CATALYST_API_URL}CustomDeliveryAreaAsync/Cities?province=${queryParameter.province}`
            default: return "";
        }
    }

    getPaymentTransaction(data): any{
        let url = this.getAPIEndpoint(`${CATALYST}POST-QueryTransaction`);
        let body = data;

        return this.http.post(url, body);
    }

    getPaymentStatus(){
        let url = this.getAPIEndpoint(`${CATALYST}GET-PaymentStatus`);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    getPaymentChannel(){
        let url = this.getAPIEndpoint(`${CATALYST}GET-PaymentChannelAsync`);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    getNewRequestID(){
        let url = this.getAPIEndpoint(`${CATALYST}GET-NewRequestID`);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER, responseType: "text"}, );
    }

    getPaybizzAccount(){
        let url = this.getAPIEndpoint(`${CATALYST}GET-PaybizzAccount`);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    getStorePaybizzAccount(id){
        let queryParameter = { id: id}
        let url = this.getAPIEndpoint(`${CATALYST}GET-StorePaybizzAccount`, queryParameter);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    getShippingFee(province, city): any{
        let queryParameter = { province: province, city: city}
        let url = this.getAPIEndpoint(`${CATALYST}GET-ShippingFee`, queryParameter);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    createOrderTransaction(data): any{
        let url = this.getAPIEndpoint(`${CATALYST}POST-OrderTransaction`);
        let body = data;
        return this.http.post(url, body, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    createOrderPayment(data): any{
        let url = this.getAPIEndpoint(`${CATALYST}POST-OrderPayment`);
        let body = data;
        return this.http.post(url, body, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    createPayment(paymentType,data): any{
        let queryParameter = { paymentType: paymentType}
        let url = this.getAPIEndpoint(`${CATALYST}POST-Payment`, queryParameter);
        let body = data;

        return this.http.post(url, body, { headers : INTERCEPTOR_SKIP_HEADER});
    }


    placeCartOrder(data): any{
        let url = this.getAPIEndpoint(`${CATALYST}POST-CartOrder`);
        let body = data;

        return this.http.post(url, body, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    placeBuyNowOrder(data): any{
        let url = this.getAPIEndpoint(`${CATALYST}POST-BuyNowOrder`);
        let body = data;

        return this.http.post(url, body, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    getCatalog(catalogId: number) : any{
        let queryParameter = { catalogId: catalogId }
        let url = this.getAPIEndpoint(`${CATALYST}GET-Catalog`, queryParameter);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    getCart(orderId: number, userId: string, userDeviceId: string): any{
        let queryParameter = { orderId: orderId, userId: userId, userDeviceId: userDeviceId }

        let url = this.getAPIEndpoint(`${CATALYST}GET-Cart`, queryParameter);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    getOrder(orderId: number, userId: string, userDeviceId: string): any{
        let queryParameter = { orderId: orderId, userId: userId, userDeviceId: userDeviceId }
        let url = this.getAPIEndpoint(`${CATALYST}GET-Order`, queryParameter);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    releaseOrder(id): any{
        let queryParameter = { id }
        let url = this.getAPIEndpoint(`${CATALYST}GET-OrderRelease`, queryParameter);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    getProvinces() : any{
        let url = this.getAPIEndpoint(`${CATALYST}GET-Provinces`);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    getCities(province) : any{
        let queryParameter = { province }
        let url = this.getAPIEndpoint(`${CATALYST}GET-Cities`, queryParameter);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

}
