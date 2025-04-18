import { Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from '../service/auth/auth-guard.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

export const routes: Routes = [
    {path:'',component:LoginpageComponent},
    {path:'login',component:LoginpageComponent},
    {path:'resetPassword/:token',component:ResetPasswordComponent},
    {path:'forgotPassword',component:ForgetPasswordComponent},
    {path:'home',component:HomePageComponent,canActivate:[AuthGuard]}
];
