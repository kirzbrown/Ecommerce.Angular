import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subscription } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";

const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";

const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': ''});

@Injectable({
    providedIn: 'root'
})

export class ProductCatalogService {
   
    private _productsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    products$ = this._productsSubject.asObservable();
    private _searchKey = new BehaviorSubject<any>(null);

    get searchKey(){
        return this._searchKey.asObservable();
    }
    constructor(private http: HttpClient) {}


    private getAPIEndpoint(baseURL: string, queryParameter?: any) {
        switch (baseURL) {
            case `${CATALYST}GET-CatalogByPageMultiSelect`: return `${CATALYST_API_URL}CustomCatalogAsync/GetByPageMultiSelect?pageIndex=${queryParameter.pageIndex}&pageSize=${queryParameter.pageSize}&sortColumn=${queryParameter.sortColumn}&sortOrder=${queryParameter.sortOrder}&filterColumn=${queryParameter.filterColumn}&filterQuery=${queryParameter.filterQuery}&searchKey=${queryParameter.searchKey}&searchColumn=${queryParameter.searchColumn}`
            case `${CATALYST}PUT-Catalog`: return `${CATALYST_API_URL}CatalogAsync/UpdateItem/${queryParameter.id}`
            default: return "";
        }
    }

    getDataByPage(pageSize: number, pageIndex: number, sortColumn: string | null, sortOrder: string | null, filterColumn: string | null, filterQuery: string | null, searchKey: string | null,  searchColumn: string | null ) {
        let queryParameter = {
            pageIndex: pageIndex ?? 0,
            pageSize: pageSize,
            sortColumn: sortColumn,
            sortOrder: sortOrder,
            filterColumn: filterColumn,
            filterQuery: filterQuery,
            searchKey: searchKey,
            searchColumn: searchColumn
        }

        let url = this.getAPIEndpoint(`${CATALYST}GET-CatalogByPageMultiSelect`, queryParameter);
        
        return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER}).pipe(
            switchMap(res => {
                this._productsSubject.next(res);
                return this.products$;
            })
        );
    }

    updateCatalog(data: any){
        let queryParameter = { id: data.id };
        let url = this.getAPIEndpoint(`${CATALYST}PUT-Catalog`, queryParameter);
        let body = data;
        
        return this.http.put(url, body);
    }

    updateSearchKey(searchKey: any) {
      this._searchKey.next(searchKey);
    }
}
