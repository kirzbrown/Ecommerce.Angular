import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";

//const CATALYST_API_URL = `${environment.apiUrl}`;

const CATALYST_API_URL = `${environment.apiUrl}`;

const CATALYST = "Catalyst-API-";

@Injectable({
  providedIn: 'root'
})
export class ServiceAreaService {

  constructor(private http: HttpClient) { }

  getAPIendpoint(baseURL: string, queryParameter? : any){
      switch(baseURL){
      //DeliveryArea
      case `${CATALYST}GET-PaginatedProvinces`: return `${CATALYST_API_URL}CustomDeliveryAreaAsync/PaginatedProvinces?pageSize=${queryParameter.pageSize}&pageIndex=${queryParameter.pageIndex}${queryParameter.sortOrder ? `&sortColumn=${queryParameter.sortColumn}&sortOrder=` + queryParameter.sortOrder : ''}${queryParameter.filterQuery ? `&filterColumn=${queryParameter.filterColumn}&filterQuery=` + queryParameter.filterQuery : ''}`
      case `${CATALYST}GET-DeliveryAreaById`: return `${CATALYST_API_URL}DeliveryArea/${queryParameter.id}`  

      //https://localhost:44341/api/CustomDeliveryAreaAsync/k
      case `${CATALYST}DELETE-DeliveryArea`: return `${CATALYST_API_URL}CustomDeliveryAreaAsync/${queryParameter.id}`

      
       case `${CATALYST}PUT-DeliveryArea`: return `${CATALYST_API_URL}DeliveryAreaAsync/${queryParameter.id}`

       ///api/CustomDeliveryAreaAsync
       case `${CATALYST}POST-DeliveryArea`: return `${CATALYST_API_URL}CustomDeliveryAreaAsync`

       
      default: return "";
      }
  }

  

  //https://localhost:44341/api/CustomDeliveryAreaAsync/Cities?province=cebu
  getCityByProvince(id){
    //let queryParameter = {province: id}
    //let url = this.getAPIendpoint(`${CATALYST}GET-getCityByProvince`,queryParameter);
    let url = `${CATALYST_API_URL}CustomDeliveryAreaAsync/Cities?province=${id}`
    return this.http.get(url);
  }

  ///api/CustomDeliveryAreaAsync/{prevProvince}
  updateDeliveryArea(id, body){
    //let queryParameter = {id: id}
    //let url = this.getAPIendpoint(`${CATALYST}PUT-DeliveryArea`, queryParameter);
    let url = `${CATALYST_API_URL}CustomDeliveryAreaAsync/${id}`

    return this.http.put(url, body);
  }


  getPaginatedProvinces(pageSize: number, pageIndex: number, sortColumn: string, sortOrder: string, filterColumn: string, filterQuery: string){
    let queryParameter = {pageSize: pageSize, pageIndex: pageIndex, sortColumn: sortColumn, sortOrder: sortOrder, filterColumn: filterColumn, filterQuery: filterQuery}
    let url = this.getAPIendpoint(`${CATALYST}GET-PaginatedProvinces`,queryParameter);
    return this.http.get(url);
  }

  getDeliveryAreaById(id){
    let queryParameter = {id: id}
    let url = this.getAPIendpoint(`${CATALYST}GET-DeliveryAreaById`,queryParameter);
    return this.http.get(url);
  }

  deleteDeliveryArea(id){
    let queryParameter = {id: id}
    let url = this.getAPIendpoint(`${CATALYST}DELETE-DeliveryArea`, queryParameter);
    return this.http.delete(url);
  }

  createDeliveryArea(body){
    let url = this.getAPIendpoint(`${CATALYST}POST-DeliveryArea`);
    return this.http.post(url, body);
  }
  
  

}
