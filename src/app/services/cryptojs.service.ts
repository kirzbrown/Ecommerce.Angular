import { Injectable } from "@angular/core";
import CryptoJS from 'crypto-js';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })

export class CryptoJSService {
  
    constructor() { }

    
getTransactionSignature(jsonData): string {

var merchantid = environment.merchantid;
var request_id = jsonData.transaction.request_id ? jsonData.transaction.request_id : '';
var notification_url = jsonData.transaction.notification_url ? jsonData.transaction.notification_url : '';
var response_url = jsonData.transaction.response_url ? jsonData.transaction.response_url : '';
var cancel_url = jsonData.transaction.cancel_url ? jsonData.transaction.cancel_url : '';
var pmethod = jsonData.transaction.pmethod ? jsonData.transaction.pmethod : '';
var payment_action = jsonData.transaction.payment_action ? jsonData.transaction.payment_action : '';
var schedule = jsonData.transaction.schedule ? jsonData.transaction.schedule : '';
var collection_method = jsonData.transaction.collection_method ? jsonData.transaction.collection_method : '';
var deferred_period = jsonData.transaction.deferred_period ? jsonData.transaction.deferred_period : '';
var deferred_time = jsonData.transaction.deferred_time ? jsonData.transaction.deferred_time : '';
var dp_balance_info = jsonData.transaction.dp_balance_info ? jsonData.transaction.dp_balance_info : '';
var amount = jsonData.transaction.amount ? jsonData.transaction.amount : '';
var currency = jsonData.transaction.currency ? jsonData.transaction.currency : '';
var descriptor_note = jsonData.transaction.descriptor_note ? jsonData.transaction.descriptor_note : '';
var payment_notification_status = jsonData.transaction.payment_notification_status ? jsonData.transaction.payment_notification_status : '';
var payment_notification_channel = jsonData.transaction.payment_notification_channel ? jsonData.transaction.payment_notification_channel : '';
var mkey = environment.mkey;

var rawTrx = merchantid + request_id + notification_url + response_url + cancel_url + pmethod + payment_action + schedule 
+ collection_method + deferred_period + deferred_time + dp_balance_info + amount + currency 
+ descriptor_note + payment_notification_status + payment_notification_channel + mkey
// console.log("Transaction Raw: " + rawTrx);

        var signatureTrx = CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(rawTrx));
        console.log("Transaction signatureTrx: " + signatureTrx);

       return signatureTrx;
    }

    getCustomerSignature(jsonData): string{
      var mkey = environment.mkey;
      var fname = jsonData.customer_info.fname ? jsonData.customer_info.fname : '';
      var lname = jsonData.customer_info.lname ? jsonData.customer_info.lname : '';
      var mname = jsonData.customer_info.mname ? jsonData.customer_info.mname : '';
      var email = jsonData.customer_info.email ? jsonData.customer_info.email : '';
      var phone = jsonData.customer_info.phone ? jsonData.customer_info.phone : '';
      var mobile = jsonData.customer_info.mobile ? jsonData.customer_info.mobile : '';
      var dob = jsonData.customer_info.dob ? jsonData.customer_info.dob : '';
      
      var raw = fname + lname + mname + email + phone + mobile + dob + mkey;
      // console.log("Customer Raw: " + raw);
      var signature = CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(raw));
      // console.log("Customer signature: " + signature);
      return signature;
    }

    getQueryTransactionSignature(jsonData): string{
      var mkey = environment.mkey;
      var merchantid = environment.merchantid;
      var request_id = jsonData.request_id ? jsonData.request_id : '';
      var org_trxid2 = jsonData.org_trxid2 ? jsonData.org_trxid2 : '';
      var rawTrx = merchantid + request_id + org_trxid2  + mkey;
      var signatureTrx = CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(rawTrx));
      return signatureTrx;
    }

    getSettlementInformationSignature(jsonData,i): string{
      var mkey = environment.mkey;
      var settlementInformation = jsonData.settlement_information;
var biz_wallet_id1 = settlementInformation[i].biz_wallet_id ? settlementInformation[i].biz_wallet_id : '';
var settlement_amount1 = settlementInformation[i].settlement_amount ? settlementInformation[i].settlement_amount : '';
var settlement_currency1 = settlementInformation[i].settlement_currency ? settlementInformation[i].settlement_currency : '';
var reason1 = settlementInformation[i].reason ? settlementInformation[i].reason : '';
var settlement_id1 = settlementInformation[i].settlement_id ? settlementInformation[i].settlement_id : '';

var raw = biz_wallet_id1 + settlement_amount1 + settlement_currency1 + reason1 + settlement_id1 + mkey;
var signatureStlmnt1 = CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(raw));
return signatureStlmnt1;
    }
    
}