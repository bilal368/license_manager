import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndUserLisitingService {
  http = inject(HttpClient)
  constructor() { }

  // fetch endUsers
  fetchcustomerList(token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    // const params = { dateRange: dateRange };

    return this.http.get('api/fetchcustomers', { headers: headers })
  }
  // Add endUsers
  createEnduser(token: any,dealerdetails:any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { dealerdetails };

    return this.http.post('api/customercreation', body, { headers: headers })
  }
  // update endUser
  updateendUser(token: any,dealerdetails:any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { dealerdetails };

    return this.http.post('api/customerupdate', body, { headers: headers })
  }
  //Deletecustomer
  Deletecustomer(token: any, customerCode: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { customerCode: customerCode };

    return this.http.delete('api/customerdelete', { headers: headers, body: body })
  }
}
