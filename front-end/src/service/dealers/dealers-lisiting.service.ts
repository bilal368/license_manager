import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DealersLisitingService {
  http = inject(HttpClient)
  constructor() { }

  // Create Dealers
  createDealer(token: any, dealer_details: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { dealer_details };

    return this.http.post('api/dealercreation', body, { headers: headers })
  }
  // update Dealers
  updateDealer(token: any, dealer_details: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { dealer_details };

    return this.http.post('api/dealerupdate', body, { headers: headers })
  }
  // Delete Dealers
  Deletedealer(token: any, dealerCode: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { dealerCode: dealerCode };

    return this.http.delete('api/dealerdelete', { headers: headers, body: body })
  }

  // fetch Dealers
  fetchdealerList(token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    // const params = { dateRange: dateRange };

    return this.http.get('api/fetchdealers', { headers: headers })
  }


}
