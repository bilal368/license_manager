import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginService } from '../../service/login/login.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, PopupComponent, LoadingSpinnerComponent, MatIconModule, CommonModule],
  providers: [LoginService],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})
export class LoginpageComponent {
  LoginForm!: FormGroup
  username: any;

  constructor(private formBuilder: FormBuilder, private auth: LoginService, private popUp: MatDialog, private router: Router, private snackbar: MatSnackBar) {
    this.LoginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  signIn() {
    this.popUp.open(LoadingSpinnerComponent);
    if (this.LoginForm.valid) {
      const email = this.LoginForm.value.username
      const password = this.LoginForm.value.password
      this.auth.login(this.LoginForm.value).subscribe((res: any) => {
        this.popUp.closeAll();
        if (res.status == true) {
          localStorage.setItem('Token', res.Token)
          // this.popUp.open(PopupComponent, {
          //   width: '250px',
          //   height: '250px',
          //   data: { message: res.message, buttonvalue: "OK" }
          // })
          this.loginStatus(res.message);
          this.router.navigateByUrl('/home');
        }
      }, error => {
        this.popUp.closeAll();
        console.log(error);
        this.loginStatus(error.error.message);
        // this.popUp.open(PopupComponent, {
        //   width: '250px',
        //   height: '250px',
        //   data: { message: error.error.message, buttonvalue: "Cancel" }
        // })
      })
    }
  }

  loginStatus(result: string) {
    this.snackbar.open(result, 'Dismiss', { duration: 2000,
      verticalPosition: 'top', 
      horizontalPosition: 'center' });
  }

}
