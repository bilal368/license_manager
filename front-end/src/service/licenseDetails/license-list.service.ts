import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LicenseListService {
  http = inject(HttpClient)
  constructor() { }

  recorderValue: any
  private recorderSubject = new BehaviorSubject<{ recorderValue: string }>({ recorderValue: '' });

  getSetValue(data: any) {
    this.recorderSubject.next(data)
  }

  setSetValue() {
    return this.recorderSubject.asObservable()
  }

  accountValue: any
  private accountSubject = new BehaviorSubject<{ accountValue: string }>({ accountValue: '' });
  accountgetSetValue(data: any) {
    this.accountSubject.next(data)
  }
  accountSetValue() {
    return this.accountSubject.asObservable()
  }

  fetchlicenselist(token: any, dateRange: string, dates: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const params = { dateRange: dateRange, dates: dates };

    return this.http.get('/license/licenselist', { headers: headers, params: params })
  }

  // Dealers details
  fetchdealerlist(token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('/license/dealerlist', { headers: headers })
  }
  //fetch product Feature Details
  fetchproductDetails(token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('/license/projectFeature', { headers: headers })
  }
  // Resellerlist
  resellerlist(token: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('/license/resellerslist', { headers: headers })
  }
  //customer details
  fetchcustomerlist(token: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('/license/customerlist', { headers: headers })
  }
  //versions details
  fetchversionslist(token: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('/license/version', { headers: headers })
  }

  //region details
  fetchregionlist(token: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('/license/region', { headers: headers })
  }
  // Flag Regions
  flagregion(token: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('/license/flagregion', { headers: headers })
  }
  // Add Region
  AddRegion(token: any,selectedFlagRegion:any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const body = {regionName:selectedFlagRegion}
    return this.http.post('/api/regionupdate',body, { headers: headers })
  }
  // Delete Region
  deleteregion(token: any,regionId:any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const body = { regionId: regionId };

    return this.http.delete('/license/deleteregion', { headers: headers, body: body })
  }

  //add license
  addlicense(token: any,payload: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post('/api/generateLicense', payload,{ headers: headers })
  }
  //Update license
  updatelicense(token: any,payload: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post('/api/updateLicense', payload,{ headers: headers })
  }
  //Fetch license
  fetchlicense(token: any,searchValue: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const body = { token : searchValue}
    return this.http.post('/license/SearchLicense', body,{ headers: headers })
  }
// Validate licence key
newTokenDecryption(token: any,searchValueToken: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const body = { token : searchValueToken}
    return this.http.post('/license/newTokenDecryption', body,{ headers: headers })
  }

}
