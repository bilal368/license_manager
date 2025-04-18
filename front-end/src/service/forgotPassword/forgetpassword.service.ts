import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForgetpasswordService {

  http = inject(HttpClient)

  sendPasswordResetEmail(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'qwerd5a4b977c40e093d009b034988f6978ed0d60e04b5628c'
    });
    const body={email : data}
        
    return this.http.post('/api/forgotpassword', body, { headers: headers });
  }

  resetpassword(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'qwerd5a4b977c40e093d009b034988f6978ed0d60e04b5628c'
    });
        
    return this.http.post('/api/generatepassword', data, { headers: headers });
  }
}
