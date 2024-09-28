
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { whDialogData } from "../models/wh-search";
import { whSearchItem } from "../models/_wh-common";

const CATALYST_API_URL = `${environment.apiUrl}`;
//const CATALYST_API_URL = `${environment.apiUrl2}`;

const CATALYST = "Catalyst-API-";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }

  
  getAPIendpoint(baseURL: string, queryParameter? : any){
    switch(baseURL){
    //Warehouse
    case `${CATALYST}GET-AllWarehouses`: return `${CATALYST_API_URL}CustomWarehouseAsync`;
    case `${CATALYST}GET-PaginatedWarehouse`: return `${CATALYST_API_URL}CustomWarehouseAsync/GetByPage?pageSize=${queryParameter.pageSize}&pageIndex=${queryParameter.pageIndex}${queryParameter.filterQuery ? '&filterColumn=name&filterQuery=' + queryParameter.filterQuery : ''}`
    
    //GetUnassignedDeliveryAreas /api/CustomWarehouseAsync/nassignedDeliveryAreas (GET)
    case `${CATALYST}GET-GetUnassignedDeliveryAreas`: return `${CATALYST_API_URL}CustomWarehouseAsync/unassignedDeliveryAreas`
    case `${CATALYST}GET-GetAssignedAndUnassignedDeliveryAreas`: return `${CATALYST_API_URL}CustomWarehouseAsync/AssignedandUnassignedDeliveryAreas?warehouseId=${queryParameter.id}`  
    case `${CATALYST}GET-WarehouseByAdminUserId`: return `${CATALYST_API_URL}CustomWarehouseAsync/WarehouseByAdminUserId?adminUserId=${queryParameter.id}`  
    
    
    case `${CATALYST}GET-WarehouseById`: return `${CATALYST_API_URL}Warehouse/${queryParameter.id}`  
    case `${CATALYST}DELETE-Warehouse`: return `${CATALYST_API_URL}CustomWarehouseAsync/${queryParameter.id}`

    case `${CATALYST}PUT-Warehouse`: return `${CATALYST_API_URL}CustomWarehouseAsync/${queryParameter.id}`
    //case `${CATALYST}POST-Warehouse`: return `${CATALYST_API_URL}CustomWarehouseAsync `

    default: return "";
    }
}


  getAllWarehouses() {
    let url = this.getAPIendpoint(`${CATALYST}GET-AllWarehouses`);
    return this.http.get(url);
  }
getUnsignedOnly(){
  //https://localhost:44341/api/CustomWarehouseAsync/UnassignedDeliveryAreas 
  let url = `${CATALYST_API_URL}CustomWarehouseAsync/UnassignedDeliveryAreas`
  return this.http.get(url);
}

getAssignedAndUnsigned(id){
  let queryParameter = {id: id}
  let url = this.getAPIendpoint(`${CATALYST}GET-GetAssignedAndUnassignedDeliveryAreas`, queryParameter);
  return this.http.get(url);
}

getAdminUsers(id:string){
  //https://localhost:44341/api/CustomWarehouseAsync/WarehouseAdmins?adminUserId=123
  let url = `${CATALYST_API_URL}CustomWarehouseAsync/WarehouseAdmins?adminUserId=${id}`;
  return this.http.get(url);
}


  getPaginatedWarehouse(pageSize: number, pageIndex: number, filterQuery: string){
    let queryParameter = {pageSize: pageSize, pageIndex: pageIndex, filterQuery: filterQuery}
    //let url = this.getAPIendpoint(`${CATALYST}GET-PaginatedWarehouse`,queryParameter);
    let url = `${CATALYST_API_URL}CustomWarehouseAsync/GetByPage?pageSize=${queryParameter.pageSize}&pageIndex=${queryParameter.pageIndex}${queryParameter.filterQuery ? '&filterColumn=name&filterQuery=' + queryParameter.filterQuery : ''}`
    return this.http.get(url);
  }

 getWarehouseByName(filterQuery: string){    
    //https://localhost:44341/api/CustomWarehouseAsync/GetByPage?pageSize=10&filterColumn=name&filterQuery=ilo%20warehouse
    let url = `${CATALYST_API_URL}CustomWarehouseAsync/GetByPage?pageSize=10&filterColumn=name&filterQuery=${filterQuery}`
    return this.http.get(url);
  }

  getWarehouseById(id){
    let queryParameter = {id: id}
    let url = this.getAPIendpoint(`${CATALYST}GET-WarehouseById`,queryParameter);
    return this.http.get(url);
  }

  getWarehouseByAdminUserId(id) : any{
    let queryParameter = {id: id}
    let url = this.getAPIendpoint(`${CATALYST}GET-WarehouseByAdminUserId`,queryParameter);
    return this.http.get(url);
  }

  saveShippingFees(body){
    //let url = this.getAPIendpoint(`${CATALYST}POST-Warehouse`);
    let url = `${CATALYST_API_URL}CustomWarehouseAsync/SetShippingFee`
    //console.log(body);
    let result = this.http.put(url, body);
    return result;
  }
  saveGlobalFees(param){
    //let url = this.getAPIendpoint(`${CATALYST}POST-Warehouse`);
    let url = `${CATALYST_API_URL}CustomWarehouseAsync/GlobalShippingFee?shippingFee=${param}`   
    let result = this.http.put(url,param);
    return result;
  }


  deleteWarehouse(id){
    let queryParameter = {id: id}
    let url = this.getAPIendpoint(`${CATALYST}DELETE-Warehouse`, queryParameter);
    return this.http.delete(url);
  }

  createWarehouse(body){
    //let url = this.getAPIendpoint(`${CATALYST}POST-Warehouse`);
    let url = `${CATALYST_API_URL}CustomWarehouseAsync`
    return this.http.post(url, body);
  }
  
  updateWarehouse(id, body){
    //let queryParameter = {id: id}
    //let url = this.getAPIendpoint(`${CATALYST}PUT-Warehouse`, queryParameter);
    let url = `${CATALYST_API_URL}CustomWarehouseAsync/${id}`;
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

  //TIP service monitor
  private _searchSource = new BehaviorSubject<whDialogData>(new whDialogData());
  currentWareHouse$ = this._searchSource.asObservable(); 
  lastWarhouse: whSearchItem;
  

  selectWareHouse(warehouse: whSearchItem,isEdit:boolean) {
    this.lastWarhouse = warehouse;
    this._searchSource.next(
       { 
        data:warehouse,
        isEdit:isEdit
       });
      }//end select

   reloadWarhouse()
   {
    if(this.lastWarhouse)
     this.selectWareHouse(this.lastWarhouse,false);
   }

}
