
export class whSearchItem{  
    name: string;
    address: string;
    contactNumber: string
    email: string
    adminUserId: string    
    deliveryAreas: Array<whDeliveryArea>;   
    id: 1;   
    //index:number;
  }
export class whDeliveryArea{  
  province: string;
  city: string;
  isActive: true;
  shippingFee:number 
  warehouseId: number;
  warehouse: null;
  id: number;
  rowVersion: string;
  position:number;
  private _pesoFee : string; 
  _fee:number

  get Fee(){
    if(!this.shippingFee)
    {           
          this._fee = 0;
    }
    else
       this._fee = this.shippingFee;

    return this._fee;
  }
 

}

export class whRespond{
  data:Array<whSearchItem>;
  totalCount: number;
  pageSize: number;
  errorMessage: string;
  hasError: boolean
}

