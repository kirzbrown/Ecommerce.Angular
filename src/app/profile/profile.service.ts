import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";

const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";

@Injectable({
    providedIn: 'root'
})

export class ProfileService {
    constructor(private http: HttpClient) { }

    private getAPIEndpoint(baseURL: string, queryParameter?: any) {
        switch (baseURL) {
            case `${CATALYST}GET-CatalogItems`: return `${CATALYST_API_URL}CatalogAsync`
            case `${CATALYST}GET-CatalogItemsBySeller`: return `${CATALYST_API_URL}CatalogAsync/GetBySeller/${queryParameter.seller}`
            case `${CATALYST}GET-CatalogItemsByUser`: return `${CATALYST_API_URL}CatalogAsync/GetByUser/${queryParameter.userId}`
            case `${CATALYST}GET-StoresByUser`: return `${CATALYST_API_URL}StoreAsync/GetStoreByUserId/${queryParameter.userId}`
            case `${CATALYST}GET-OrdersByUser`: return `${CATALYST_API_URL}OrderAsync/GetOrderByUserId/${queryParameter.userId}`

            default: return "";
        }
    }

    getCatalogItems():any {
        let url = this.getAPIEndpoint(`${CATALYST}GET-CatalogItems`);

        return this.http.get(url);
    }

    getCatalogItemsBySeller(seller) {
      let queryParameter = { seller: seller}
        let url = this.getAPIEndpoint(`${CATALYST}GET-CatalogItemsBySeller`, queryParameter);

        return this.http.get(url);
    }
    
    getCatalogItemsByUser(userId) {
      let queryParameter = { userId: userId}
        let url = this.getAPIEndpoint(`${CATALYST}GET-CatalogItemsByUser`, queryParameter);

        return this.http.get(url);
    }

    getStoresByUser(userId) {
      let queryParameter = { userId: userId}
        let url = this.getAPIEndpoint(`${CATALYST}GET-StoresByUser`, queryParameter);

        return this.http.get(url);
    }

    getOrdersByUser(userId) {
      let queryParameter = { userId: userId }
      let url = this.getAPIEndpoint(`${CATALYST}GET-OrdersByUser`, queryParameter);

      return this.http.get(url);
    }
}
