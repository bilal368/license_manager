import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserslisitingService {
  http = inject(HttpClient)
  constructor() { }

  // Create users
  createuser(token: any, userdetails: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { userdetails };

    return this.http.post('api/generate_user', body, { headers: headers })
  }
  // updateuser
  updateuser(token: any, userdetails: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { userdetails };

    return this.http.post('api/userupdate', body, { headers: headers })
  }
  // change Password
  changePassword(token: any, userdetails: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { userdetails };

    return this.http.post('api/passwordChange', body, { headers: headers })
  }
  // Delete user
  Deleteuser(token: any, emailId: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const body = { email: emailId };

    return this.http.delete('api/deleteuser', { headers: headers, body: body })
  }
  // fetch endUsers
  fetchusersList(token: any,UserId:any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const params = { UserId: UserId };

    return this.http.get('api/fetchusers',{ headers: headers, params: params })
  }
}
