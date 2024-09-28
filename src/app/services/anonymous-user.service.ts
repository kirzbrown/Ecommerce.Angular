import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, pipe } from "rxjs";
import { switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";

const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";
const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': ''});

@Injectable({
    providedIn: 'root'
})

export class AnonymousUserService {
    constructor(private http: HttpClient) { }

    private getAPIEndpoint(baseURL: string, queryParameter?: any) {
        switch (baseURL) {
            case `${CATALYST}GET-Id`: return `${CATALYST_API_URL}AnonymousUser/Id`
            default: return "";
        }
    }

    async getAnonymousUserId() : Promise<string>  {
        return new Promise((resolve, reject) => {
            let _anonymousUserId = JSON.parse(localStorage.getItem('anonymousUserId'));
            if(_anonymousUserId) { 
                resolve(_anonymousUserId);
            }
            else {
                this.getAnonymousUserIdReponse().subscribe(res => {
                    localStorage.setItem('anonymousUserId', JSON.stringify(res));
                    resolve(res);
                });
            }           
        })
    }

    private getAnonymousUserIdReponse() : any {
        let url = this.getAPIEndpoint(`${CATALYST}GET-Id`);
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }
}