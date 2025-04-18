import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export class AuthService {
  
  token: any;
  isLoggedIn: boolean = false; 

  constructor() { }

  getToken() {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem("Token");
    } else {
      console.log("localStorage is not defined.");
      return false; 
    }
  }

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(() => this.isLoggedIn = true)
    );
  }

  logout(): void { 
    this.isLoggedIn = false;
  }
}
