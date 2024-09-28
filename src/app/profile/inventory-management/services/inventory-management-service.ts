import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";

const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";


@Injectable({
  providedIn: 'root'
})


export class InventoryManagementService {


  constructor(private http: HttpClient) { }

    getAPIEndpoint(baseURL: string, queryParameter? : any){
        switch(baseURL){
        case `${CATALYST}POST-CreateUpdate`: return `${CATALYST_API_URL}CustomWarehouseCatalogAsync`
        default: return "";
        }
    }

    createUpdateWarehouseCatalog(data): any {
        let url = this.getAPIEndpoint(`${CATALYST}POST-CreateUpdate`);
        let body = data;

        return this.http.post(url, body);
    }


}
