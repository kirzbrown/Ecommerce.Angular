import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";
const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': ''});

@Injectable({
    providedIn: 'root'
})

export class AreaSelectorService {
    constructor(private http: HttpClient) { }


    private getAPIEndpoint(baseURL: string, queryParameter?: any) {
        switch (baseURL) {
            case `${CATALYST}GET-Provinces`: return `${CATALYST_API_URL}CustomDeliveryAreaAsync/Provinces`
            case `${CATALYST}GET-Cities`: return `${CATALYST_API_URL}CustomDeliveryAreaAsync/Cities?province=${queryParameter.province}`
            default: return "";
        }
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
