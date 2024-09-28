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


export class ManagementService {


  constructor(private http: HttpClient) { }

    getAPIendpoint(baseURL: string, queryParameter? : any){
        switch(baseURL){
        //category
        case `${CATALYST}GET-PaginatedCategory`: return `${CATALYST_API_URL}Category/GetByPage?pageSize=${queryParameter.pageSize}&pageIndex=${queryParameter.pageIndex}${queryParameter.filterQuery ? '&filterColumn=name&filterQuery=' + queryParameter.filterQuery : ''}`
        case `${CATALYST}GET-CategoryById`: return `${CATALYST_API_URL}Category/${queryParameter.id}`  
        case `${CATALYST}DELETE-Category`: return `${CATALYST_API_URL}Category/${queryParameter.id}`
        case `${CATALYST}PUT-Category`: return `${CATALYST_API_URL}CustomCategoryAsync/${queryParameter.id}`
        case `${CATALYST}POST-Category`: return `${CATALYST_API_URL}CustomCategoryAsync`
        case `${CATALYST}POST-ConvertFiletoBase64` : return `${CATALYST_API_URL}File/ConversiontoBase64`

        
        //
        default: return "";
        }
    }

    getPaginatedCategory(pageSize: number, pageIndex: number, filterQuery: string){
      let queryParameter = {pageSize: pageSize, pageIndex: pageIndex, filterQuery: filterQuery}
      let url = this.getAPIendpoint(`${CATALYST}GET-PaginatedCategory`,queryParameter);
      return this.http.get(url);
    }

    getCategoryById(id){
      let queryParameter = {id: id}
      let url = this.getAPIendpoint(`${CATALYST}GET-CategoryById`,queryParameter);
      return this.http.get(url);
    }

    deleteCategory(id){
      let queryParameter = {id: id}
      let url = this.getAPIendpoint(`${CATALYST}DELETE-Category`, queryParameter);
      return this.http.delete(url);
    }

    createCategory(body){
      let url = this.getAPIendpoint(`${CATALYST}POST-Category`);
      return this.http.post(url, body);
    }
    
    updateCategory(id, body){
      let queryParameter = {id: id}
      let url = this.getAPIendpoint(`${CATALYST}PUT-Category`, queryParameter);
      return this.http.put(url, body);
    }

    getBased64File(fileToUpload: File): Observable<any>{
      let url = this.getAPIendpoint(`${CATALYST}POST-ConvertFiletoBase64`)
      const formData: FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name)
      return this.http.post(url, formData, {
          responseType: "text" //fix  the issue about "200" response but treated as errro
      });
    }
}
