import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetpasswordService } from '../../service/forgotPassword/forgetpassword.service';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { PatternValidatorService } from '../../service/patternValidators/pattern-validator.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, PopupComponent, HttpClientModule, MatProgressSpinnerModule, LoadingSpinnerComponent],
  providers: [ForgetpasswordService, PatternValidatorService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  passwordResetForm: FormGroup;
  data: any;
  alert = false;
  success = false;
  isTyping = false;
  allConditionsset = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: ForgetpasswordService, private popUp: MatDialog, private Router: Router) {
    this.passwordResetForm = this.fb.group({
      newPassword: ['', [Validators.required,
      Validators.minLength(8),
      PatternValidatorService.patternValidator(/\d/, { hasNumber: true}),
      PatternValidatorService.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      PatternValidatorService.patternValidator(/[a-z]/, { hasSmallCase: true }),
      PatternValidatorService.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpeacialCharacters: true }
      ),
      ]
      ],
      confirmPassword: ['', [Validators.required]],
    });
    
  }
  handleInput() {
    this.isTyping = true;
    this.allConditionsset = this.allConditionsMet();
  }
  back(){
    this.Router.navigateByUrl('/forgotPassword')
  }
  allConditionsMet(): boolean {
    const errors = this.passwordResetForm.get('newPassword')?.errors;
    const required = errors?.['required'];
    const hasMinLengthError = errors?.['minlength'];
    const hasSpecialCharactersError = errors?.['hasSpeacialCharacters'];
    const hasSmallCaseError = errors?.['hasSmallCase'];
    const hasNumberError = errors?.['hasNumber'];
    const hasCapitalCaseError = errors?.['hasCapitalCase'];
  
    if ( hasMinLengthError || hasSpecialCharactersError || 
        hasSmallCaseError || hasNumberError || hasCapitalCaseError || required) {          
      return false; // At least one condition is not met
    }else{
      return true;
    }    
  }
  passwordsDoNotMatch(): boolean {
    const newPassword = this.passwordResetForm.value.newPassword;
    const confirmPassword = this.passwordResetForm.value.confirmPassword;
  
    return newPassword !== confirmPassword;
  }
  resetPassword() {
    this.popUp.open(LoadingSpinnerComponent);
    const newPassword = this.passwordResetForm.value.newPassword
    const confirmPassword = this.passwordResetForm.value.confirmPassword
    let Token
    if (newPassword == confirmPassword) {
      this.route.paramMap.subscribe(params => {
        Token = params.get('token');
      });
      this.data = { password: this.passwordResetForm.value.newPassword, token: Token }
      this.authService.resetpassword(this.data).subscribe((res: any) => {
        this.popUp.closeAll();
        if (res.status == true) {
          this.popUp.open(PopupComponent, {
            width: '250px',
            height: '250px',
            data: { message: res.message, buttonvalue: "OK" }
          })
          this.Router.navigateByUrl('')
        }
      }, error => {
        this.popUp.closeAll();
        console.log(error);
        this.popUp.open(PopupComponent, {
          width: '250px',
          height: '250px',
          data: { message: error.error.message, buttonvalue: "Cancel" }
        })
      })
    }
  }
}
