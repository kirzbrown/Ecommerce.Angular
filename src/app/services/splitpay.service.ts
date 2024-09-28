import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })

  
export class SplitPayService {
  
    constructor() { }
    

  

    splitPayment(paymentMethod: any, orderTotalPrice: number, settlement_informations: Array<any>): Array<any>{
       if(settlement_informations.length == 2){
        let splitPercent: number = 0;
        if(paymentMethod == "wallet" || paymentMethod == "onlinebanktransfer")
          splitPercent = 2.5/100;
        if(paymentMethod == "creditcard"){
           splitPercent = 4/100;
        }
          
        for(let i = 0; i <= settlement_informations.length - 1; i++){
            let onlineProcessingFee = splitPercent * orderTotalPrice;
            let onlineFulfiller = orderTotalPrice - onlineProcessingFee;

           if(settlement_informations[i].username.includes("ecommerceph"))
              settlement_informations[i].settlement_amount = onlineProcessingFee.toString();
           else 
              settlement_informations[i].settlement_amount = onlineFulfiller.toString();
        }
      }
         return settlement_informations;
    }

    
}