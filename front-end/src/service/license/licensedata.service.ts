import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LicensedataService {
  http = inject(HttpClient)
  constructor() { }

  fetchlicense(token: any,dateRange: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }); 

    const params = { dateRange: dateRange };

    return this.http.get('/license/fetchlicense', { headers: headers, params:params })
  }
  fetchlicensetype(token: any,dateRange: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }); 

    const params = { dateRange: dateRange };

    return this.http.get('/license/licensetype', { headers: headers, params:params })
  }
  custometype(token: any,dateRange: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }); 

    const params = { dateRange: dateRange };

    return this.http.get('/license/custometype', { headers: headers, params:params })
  }
  modulecount(token: any, dateRange: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }); 
    const params = { dateRange: dateRange };

    return this.http.get('/license/modulecount', { headers: headers,params:params })
  }
}
