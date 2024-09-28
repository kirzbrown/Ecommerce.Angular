import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const INTERCEPTOR_SKIP_HEADER = new HttpHeaders({ 'X-Skip-Interceptor': '' });
const CATALYST_API_URL = `${environment.apiUrl}`;
const CATALYST = "Catalyst-API-";

@Injectable({
  providedIn: 'root'
})

export class CarouselService {

  constructor(private http: HttpClient) { }

  getAPIEndpoint(baseURL: string, queryParameter?: any) {
    switch (baseURL) {
      //BannerAsync
      case `${CATALYST}GET-PaginatedBanner`: return `${CATALYST_API_URL}CustomBannerAsync/GetByPage?pageIndex=${queryParameter.pageIndex}&pageSize=${queryParameter.pageSize}&filterColumn=${queryParameter.filterColumn}&filterQuery=${queryParameter.filterQuery}`
      case `${CATALYST}POST-BannerAsync`: return `${CATALYST_API_URL}BannerAsync`
      case `${CATALYST}DELETE-BannerAsync`: return `${CATALYST_API_URL}BannerAsync/${queryParameter.id}`
      //
      default: return "";
    }
  }

  getDataByPage(pageIndex: number, pageSize: number, sortColumn: string | null, sortOrder: string | null, filterColumn: string | null, filterQuery: string | null) {
    let queryParameter = {
      pageIndex: pageIndex ?? 0,
      pageSize: pageSize,
      sortColumn: sortColumn,
      sortOrder: sortOrder,
      filterColumn: filterColumn,
      filterQuery: filterQuery
    }

    let url = this.getAPIEndpoint(`${CATALYST}GET-PaginatedBanner`, queryParameter);
    return this.http.get(url, { headers : INTERCEPTOR_SKIP_HEADER});
  }

  createCarouselItem(data): any {
    let url = this.getAPIEndpoint(`${CATALYST}POST-BannerAsync`);
    let body = data;
    return this.http.post(url, body);
  }

  deleteCarousel(id) {
    let queryParameter = { id: id }
    let url = this.getAPIEndpoint(`${CATALYST}DELETE-BannerAsync`, queryParameter);
    return this.http.delete(url);
  }
}
