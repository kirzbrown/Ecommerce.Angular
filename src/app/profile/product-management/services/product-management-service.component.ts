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


export class ProductManagementService {


  constructor(private http: HttpClient) { }

    getAPIEndpoint(baseURL: string, queryParameter? : any){
        switch(baseURL){
        //catalog
        case `${CATALYST}GET-PaginatedCatalog`: return `${CATALYST_API_URL}CustomCatalogAsync/GetByPage?pageSize=${queryParameter.pageSize}&pageIndex=${queryParameter.pageIndex}${queryParameter.searchKey ? '&filterQuery='+ queryParameter.searchKey : ''}&filterColumn=${queryParameter.searchColumn}`
        case `${CATALYST}POST-Catalog`: return `${CATALYST_API_URL}CustomCatalogAsync`
        case `${CATALYST}PUT-Catalog`: return `${CATALYST_API_URL}CustomCatalogAsync/${queryParameter.id}`
        case `${CATALYST}DELETE-CatalogAsync`: return `${CATALYST_API_URL}CustomCatalogAsync/${queryParameter.id}`
        case `${CATALYST}GET-Technologies`: return `${CATALYST_API_URL}CustomCatalogAsync/Technologies`
        case `${CATALYST}GET-GetCategories`: return `${CATALYST_API_URL}CategoryAsync`
        case `${CATALYST}POST-ConvertFiletoBase64` : return `${CATALYST_API_URL}File/ConversiontoBase64`
        case `${CATALYST}POST-Transfer` : return `${CATALYST_API_URL}File/Transfer`
        default: return "";
        }
    }

    getPaginatedCatalog(pageSize: number, pageIndex: number, searchKey: string, searchColumn: string){
        let queryParameter = {pageSize: pageSize, pageIndex: pageIndex, searchKey: searchKey, searchColumn: searchColumn}
        let url = this.getAPIEndpoint(`${CATALYST}GET-PaginatedCatalog`,queryParameter);
        return this.http.get(url);
    }

    deleteCatalog(id){
        let queryParameter = {id: id}
        let url = this.getAPIEndpoint(`${CATALYST}DELETE-CatalogAsync`, queryParameter);
        return this.http.delete(url);
    }

    transferFileToTempStorage(data): any {
        let url = this.getAPIEndpoint(`${CATALYST}POST-Transfer`);
        let body = data;

        return this.http.post(url, body, {
            responseType: "text" //fix  the issue about "200" response but treated as errro
      });
    }

    createCatalogItem(data): any {
        let url = this.getAPIEndpoint(`${CATALYST}POST-Catalog`);
        let body = data;

        return this.http.post(url, body);
    }

    updateCatalogItem(id, data): any {
        let queryParameter = { id: id}
        let body = data;

        let url = this.getAPIEndpoint(`${CATALYST}PUT-Catalog`, queryParameter);

        return this.http.put(url, body);
    }

    getBased64File(fileToUpload: File): Observable<any>{
      let url = this.getAPIEndpoint(`${CATALYST}POST-ConvertFiletoBase64`)
      const formData: FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name)
      return this.http.post(url, formData, {
          responseType: "text" //fix  the issue about "200" response but treated as errro
      });
    }

    getCategories() {
        let url = this.getAPIEndpoint(`${CATALYST}GET-GetCategories`);

        return this.http.get(url);
    }

    getTechnologies() {
        let url = this.getAPIEndpoint(`${CATALYST}GET-Technologies`);

        return this.http.get(url);
    }
}
