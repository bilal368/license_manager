import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  http = inject(HttpClient)

  login(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'qwerd5a4b977c40e093d009b034988f6978ed0d60e04b5628c'
    });

    data.email = data.username;
    return this.http.post('/api/userLogin', data, { headers: headers })
  }

}
