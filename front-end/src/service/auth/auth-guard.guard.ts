import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private authGuard : AuthService, private route : Router){}

  canActivate(): any
  {
    if(!this.authGuard.getToken()){
      this.route.navigateByUrl("")
    }  
    return this.authGuard.getToken();
  }
}
 