import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";

const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";

const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': ''});


@Injectable({
  providedIn: 'root'
})


export class OrderManagementService {


  constructor(private http: HttpClient) { }

    getAPIendpoint(baseURL: string, queryParameter? : any){
        switch(baseURL){
        case `${CATALYST}GET-PaginatedOrder`: return `${CATALYST_API_URL}CustomOrderAsync/GetByPage?pageSize=${queryParameter.pageSize}&pageIndex=${queryParameter.pageIndex}${queryParameter.searchKey ? '&filterQuery='+ queryParameter.searchKey : ''}&filterColumn=${queryParameter.searchColumn}`
        case `${CATALYST}GET-PaginatedOrdersByUser`: return `${CATALYST_API_URL}CustomOrderAsync/PaginatedOrdersByUser?userId=${queryParameter.userId}&pageIndex=${queryParameter.pageIndex}&pageSize=${queryParameter.pageSize}${queryParameter.searchKey ? '&filterQuery='+ queryParameter.searchKey : ''}&filterColumn=${queryParameter.searchColumn}`
        case `${CATALYST}GET-PaginatedOrdersByAdminUser`: return `${CATALYST_API_URL}CustomOrderAsync/PaginatedOrdersByAdminUser?adminUserId=${queryParameter.adminUserId}&pageIndex=${queryParameter.pageIndex}&pageSize=${queryParameter.pageSize}${queryParameter.searchKey ? '&filterQuery='+ queryParameter.searchKey : ''}&filterColumn=${queryParameter.searchColumn}`
        case `${CATALYST}GET-OrderById`: return `${CATALYST_API_URL}OrderAsync/${queryParameter.id}`  
        case `${CATALYST}GET-OrderByOrderNumber`: return `${CATALYST_API_URL}CustomOrderAsync?orderNumber=${queryParameter.orderNumber}`
        case `${CATALYST}PUT-OrderStatus`: return `${CATALYST_API_URL}CustomOrderAsync/StatusOrder/${queryParameter.id}`
        //
        default: return "";
        }
    }

    getPaginatedOrder(pageSize: number, pageIndex: number, searchKey: string, searchColumn: string){
      let queryParameter = {pageSize: pageSize, pageIndex: pageIndex, searchKey: searchKey, searchColumn: searchColumn}
      let url = this.getAPIendpoint(`${CATALYST}GET-PaginatedOrder`,queryParameter);
      return this.http.get(url);
    }

    getPaginatedOrdersByUserId(userId: number, pageSize: number, pageIndex: number, searchKey: string, searchColumn: string){
      let queryParameter = {userId: userId, pageSize: pageSize, pageIndex: pageIndex, searchKey: searchKey, searchColumn: searchColumn}
      let url = this.getAPIendpoint(`${CATALYST}GET-PaginatedOrdersByUser`,queryParameter);
      return this.http.get(url);
    }

    getPaginatedOrdersByAdminUserId(adminUserId: string, pageSize: number, pageIndex: number, searchKey: string, searchColumn: string){
      let queryParameter = {adminUserId: adminUserId, pageSize: pageSize, pageIndex: pageIndex, searchKey: searchKey, searchColumn: searchColumn}
      let url = this.getAPIendpoint(`${CATALYST}GET-PaginatedOrdersByAdminUser`,queryParameter);
      return this.http.get(url);
    }

    getOrderById(id){
      let queryParameter = {id: id}
      let url = this.getAPIendpoint(`${CATALYST}GET-OrderById`,queryParameter);
      return this.http.get(url);
    }

    getOrderByOrderNumber(orderNumber): any{
      let queryParameter = {orderNumber: orderNumber}
      let url = this.getAPIendpoint(`${CATALYST}GET-OrderByOrderNumber`,queryParameter);
      return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
    }

    updateOrderStatus(id, body){
      let queryParameter = {id: id}
      let url = this.getAPIendpoint(`${CATALYST}PUT-OrderStatus`, queryParameter);
      return this.http.put(url, body);
    }
}
