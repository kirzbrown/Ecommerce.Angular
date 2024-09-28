import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': ''});
const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";

@Injectable({
  providedIn: 'root'
})

export class CustomSpaSettingsService {
  triggerHeaderSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  getAPIendpoint(baseURL: string, queryParameter?: any) {
    switch (baseURL) {
      //CustomSPASettingAsync
      case `${CATALYST}GET-CustomSPASettingAsync`: return `${CATALYST_API_URL}CustomSPASettingAsync`
      case `${CATALYST}PUT-CustomSPASettingAsyncHomePageLogo`: return `${CATALYST_API_URL}CustomSPASettingAsync/HomePageLogo?URL=${queryParameter.url}`
      case `${CATALYST}PUT-CustomSPASettingAsyncCheckoutPageLogo`: return `${CATALYST_API_URL}CustomSPASettingAsync/CheckoutPageLogo?URL=${queryParameter.url}`
      case `${CATALYST}PUT-CustomSPASettingAsyncLandingPageColor`: return `${CATALYST_API_URL}CustomSPASettingAsync/LandingPageColor?headerColor=${queryParameter.headerColor}&footerColor=${queryParameter.footerColor}`
      case `${CATALYST}PUT-CustomSPASettingAsyncAdminPageColor`: return `${CATALYST_API_URL}CustomSPASettingAsync/AdminPageColor?headerColor=${queryParameter.headerColor}&footerColor=${queryParameter.footerColor}`
      //
      default: return "";
    }
  }

  getCustomSPASettingAsync() {
    let url = this.getAPIendpoint(`${CATALYST}GET-CustomSPASettingAsync`);
    return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
  }

  updateHomePageLogo(fileUrl: string) {
    let queryParameter = { url: fileUrl }
    let url = this.getAPIendpoint(`${CATALYST}PUT-CustomSPASettingAsyncHomePageLogo`, queryParameter);
    return this.http.put(url, null);
  }

  updateCheckoutPageLogo(fileUrl: string) {
    let queryParameter = { url: fileUrl }
    let url = this.getAPIendpoint(`${CATALYST}PUT-CustomSPASettingAsyncCheckoutPageLogo`, queryParameter);
    return this.http.put(url, null);
  }

  updateLandingHeaderAndFooterColor(headerColor: string, footerColor: string) {
    let queryParameter = { headerColor: headerColor.replace('#','%23'), footerColor: footerColor.replace('#','%23') }
    let url = this.getAPIendpoint(`${CATALYST}PUT-CustomSPASettingAsyncLandingPageColor`, queryParameter);
    return this.http.put(url, null);
  }

  updateAdminHeaderAndFooterColor(headerColor: string, footerColor: string) {
    let queryParameter = { headerColor: headerColor.replace('#','%23'), footerColor: footerColor.replace('#','%23') }
    let url = this.getAPIendpoint(`${CATALYST}PUT-CustomSPASettingAsyncAdminPageColor`, queryParameter);
    return this.http.put(url, null);
  }
}
