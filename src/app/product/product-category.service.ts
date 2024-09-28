import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { BehaviorSubject, Subscription } from "rxjs";

const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";

const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': ''});


@Injectable({
    providedIn: 'root'
})

export class ProductCategoryService{
  private unsubscribe: Subscription[] = [];
  private _filters = new BehaviorSubject<any>(null);
  get filters(){
    return this._filters.asObservable();
  }

  constructor(private http: HttpClient) { 
    this.unsubscribe.push();
  }

  private getAPIEndpoint(baseURL: string, queryParameter?: any) {
    switch (baseURL) {
      case `${CATALYST}GET-CategoriesTab`: return `${CATALYST_API_URL}CategoryAsync/Public`
      case `${CATALYST}GET-CategoriesNav`: return `${CATALYST_API_URL}CategoryNavigationAsync/Public`
      default: return "";
    }
  }

  getCategoriesTab(){
    let url = this.getAPIEndpoint(`${CATALYST}GET-CategoriesTab`);

    return this.http.get(url, {headers : INTERCEPTOR_SKIP_HEADER});
  }

  getCategoriesNav(){
    let url = this.getAPIEndpoint(`${CATALYST}GET-CategoriesNav`);

    return this.http.get(url, {headers : INTERCEPTOR_SKIP_HEADER});
  }

  updateFilters(filter: any){
    this._filters.next(filter);
  }
}
