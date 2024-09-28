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

export class CreateStoreService{
    constructor(private http: HttpClient) {}

    private getAPIEndpoint(baseURL: string, queryParameter?: any) {
        switch (baseURL) {
            case `${CATALYST}POST-Store`: return `${CATALYST_API_URL}StoreAsync/CreateStore`
            case `${CATALYST}GET-GetStoreByUserId`: return `${CATALYST_API_URL}StoreAsync/GetStoreByUserId/${queryParameter.userId}`
            default: return "";
        }
    }

    createStore(data){
        let url = this.getAPIEndpoint(`${CATALYST}POST-Store`);
        let body = data;

        return this.http.post(url, body);
    }

    getStoreByUserId(userId:string){
        let queryParameter = { userId };
        let url = this.getAPIEndpoint(`${CATALYST}GET-GetStoreByUserId`, queryParameter);

        return this.http.get(url);
    }
}
