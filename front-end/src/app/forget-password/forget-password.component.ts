import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgetpasswordService } from '../../service/forgotPassword/forgetpassword.service';
import { HttpClientModule } from '@angular/common/http';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, PopupComponent,
    LoadingSpinnerComponent, MatProgressSpinnerModule, MatIconModule,CommonModule],
  providers: [ForgetpasswordService],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {
  passwordResetForm: FormGroup;
  isSubmitButtonDisabled: boolean = true;

  constructor(private fb: FormBuilder, private authService: ForgetpasswordService, private popUp: MatDialog, private Router: Router) {
    this.passwordResetForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void {
     this.passwordResetForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]]
    });

    // Subscribe to the username input value changes
    this.passwordResetForm.get('username')!.valueChanges.subscribe(value => {
      this.isSubmitButtonDisabled = !value;
    });
  }
  back(){
    this.Router.navigateByUrl('\login')
  }
  sendmail() {
    const username = this.passwordResetForm.value.username;
    this.popUp.open(LoadingSpinnerComponent);
    this.authService.sendPasswordResetEmail(username).subscribe((res: any) => {
      if (res.status == true) {
        this.popUp.closeAll();
        this.popUp.open(PopupComponent, {
          width: '250px',
          height: '250px',
          data: { message: res.message, buttonvalue: "OK" }
        })
        this.Router.navigateByUrl('')
      }
    }, error => {
      this.popUp.closeAll();
      console.log(error.HttpErrorResponse);
      this.popUp.open(PopupComponent, {
        width: '250px',
        height: '250px',
        data: { message: error.error.message, buttonvalue: "Cancel" }
      })
    })
  }
}


