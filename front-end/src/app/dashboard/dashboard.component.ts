import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { LicensedataService } from '../../service/license/licensedata.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, CommonModule, MatSelectModule, MatMenuModule, HttpClientModule],
  providers: [LicensedataService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  token: string | null | undefined;
  decodedToken: any;
  isMobileView: boolean = false;
  selectedTab: any;
  buildDiv: any = 'license';
  selectedateRange: string = 'This Month';
  totalLicense: any = 0;
  full_count: any = 0;
  reissue_count: any = 0;
  upgrade_count: any = 0;
  endUser: any = 0;
  channelPartner: any = 0;
  reseller: any = 0;
  speechBill: any = 0;
  both_count: any = 0;
  Windows: any = 0;
  Linux: any = 0;
  dgVox: any = 0;

  constructor(private Router: Router, private auth: LicensedataService, private popUp:MatDialog) {
    this.token = localStorage.getItem('Token');
    if (this.token) {
      const tokenParts = this.token.split('.')
      const tokenPayload = tokenParts[1];
      this.decodedToken = this.decodeToken(tokenPayload);
    }
  }

  private decodeToken(tokenPayload: string): any {
    const decodedPayload = atob(tokenPayload);
    return JSON.parse(decodedPayload);
  }

  ngOnInit() {
    this.licenseCount(this.selectedateRange);
    this.licenseType(this.selectedateRange);
    this.customerType(this.selectedateRange);
    this.moduleCount(this.selectedateRange);
  }

  licenseCount(dateRange: string) {
    const token = this.token
    this.auth.fetchlicense(token,dateRange).subscribe((res: any) => {
      this.totalLicense = res.licensecount[0].total_count

    },error=>{
      this.popUp.closeAll();
      console.log(error);
      this.popUp.open(PopupComponent,{ width: '250px',
        height: '250px',
        data: { message: error.error.message,buttonvalue:"Cancel" }
        })
        localStorage.clear()
        this.Router.navigateByUrl('/login')
    })
  }
  licenseType(dateRange: string){
    const token = this.token
    this.auth.fetchlicensetype(token,dateRange).subscribe((res: any) => {
      this.full_count = res.licensecount[0].full_count
      this.reissue_count = res.licensecount[0].reissue_count
      this.upgrade_count = res.licensecount[0].upgrade_count

    },error=>{
      this.popUp.closeAll();
      console.log(error);
      this.popUp.open(PopupComponent,{ width: '250px',
        height: '250px',
        data: { message: error.error.message,buttonvalue:"Cancel" }
        })
        localStorage.clear()
        this.Router.navigateByUrl('/login')
    })
  }
  customerType(dateRange: string){
    const token = this.token
    this.auth.custometype(token,dateRange).subscribe((res: any) => { 
      this.endUser = res.customerType[0].endUser
      this.channelPartner = res.customerType[0].channelPartner
      this.reseller = res.customerType[0].reseller

    },error=>{
      this.popUp.closeAll();
      console.log(error);
      this.popUp.open(PopupComponent,{ width: '250px',
        height: '250px',
        data: { message: error.error.message,buttonvalue:"Cancel" }
        })
        localStorage.clear()
        this.Router.navigateByUrl('/login')
    })
  }
  moduleCount(dateRange: string){
    const token = this.token
    this.auth.modulecount(token,dateRange).subscribe((res: any) => {
      this.dgVox = res.modulecount[0].dgVox_count
      this.speechBill = res.modulecount[0].speechBill_count
      this.both_count = res.modulecount[0].both_count
      this.Windows = res.modulecount[0].Windows_count
      this.Linux = res.modulecount[0].Linux_count
    },error=>{
      this.popUp.closeAll();
      console.log(error);
      this.popUp.open(PopupComponent,{ width: '250px',
        height: '250px',
        data: { message: error.error.message,buttonvalue:"Cancel" }
        })
        localStorage.clear()
        this.Router.navigateByUrl('/login')
    })
  }


  selectDateRange(dateRange: string) {    
    this.selectedateRange = dateRange;
    this.customerType(this.selectedateRange);
    this.moduleCount(this.selectedateRange);
    this.licenseCount(this.selectedateRange);
    this.licenseType(this.selectedateRange);
  }

  divFunction(name: string) {
    this.buildDiv = name
  }

}
