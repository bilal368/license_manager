import { Component, ViewChild } from '@angular/core';
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
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LicenseListComponent } from "../license-list/license-list.component";
import { SettingsComponent } from '../settings/settings.component';


@Component({
  selector: 'app-home-page',
  standalone: true,
  providers: [LicensedataService],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  imports: [MatIconModule, MatButtonModule, MatToolbarModule,
    CommonModule, MatSelectModule, MatMenuModule, HttpClientModule, DashboardComponent, LicenseListComponent, SettingsComponent]
})
export class HomePageComponent {
  token: string | null;
  decodedToken: any;
  isMobileView: boolean = false;
  selectedTab: any;
  buildDiv: any = 'dashboard';
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
  showLogoutButton: boolean = false;
  logoutstatus: boolean = false;
  role:any;
  LicenseStatus: boolean = false;
  ReportStatus: boolean = true;
  SettingStatus: boolean = true;

  @ViewChild(DashboardComponent) dashboardComponent?: DashboardComponent;
  userName: any;

  constructor(private Router: Router, private auth: LicensedataService, private popUp: MatDialog) {
    this.token = localStorage.getItem('Token');
    if (this.token) {
      const tokenParts = this.token.split('.')
      const tokenPayload = tokenParts[1];
      this.decodedToken = this.decodeToken(tokenPayload);    
      this.role = this.decodedToken.Details.role
    }
  }

  private decodeToken(tokenPayload: string): any {
    const decodedPayload = atob(tokenPayload);
    return JSON.parse(decodedPayload);
  }

  ngOnInit() {
    this.setStatuses(this.role);
    this.licenseCount(this.selectedateRange);
    this.licenseType(this.selectedateRange);
    this.customerType(this.selectedateRange);
    this.moduleCount(this.selectedateRange);

    
      if (this.token) {
        const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
        this.userName = tokenPayload.Details.userName
      }
  }
  setStatuses(role: string) {
    if (role.length === 3) {
      this.LicenseStatus = role[0] === '1';
      this.ReportStatus = role[1] === '1';
      this.SettingStatus = role[2] === '1';
      // Adjust buildDiv based on the roles
      if (!this.ReportStatus) {
        if (this.LicenseStatus) {
          this.buildDiv = 'license';
        } else if (this.SettingStatus) {
          this.buildDiv = 'settings';
        }
      }
    } else {
      console.error('Invalid role format');
    }
  }
  licenseCount(dateRange: string) {
    const token = this.token
    this.auth.fetchlicense(token, dateRange).subscribe((res: any) => {
      this.totalLicense = res.licensecount[0].total_count

    }, error => {
      this.popUp.closeAll();
      console.log(error);
      this.popUp.open(PopupComponent, {
        width: '250px',
        height: '250px',
        data: { message: error.error.message, buttonvalue: "Cancel" }
      })
      localStorage.clear()
      this.Router.navigateByUrl('/login')
    })
  }
  licenseType(dateRange: string) {
    const token = this.token
    this.auth.fetchlicensetype(token, dateRange).subscribe((res: any) => {
      this.full_count = res.licensecount[0].full_count
      this.reissue_count = res.licensecount[0].reissue_count
      this.upgrade_count = res.licensecount[0].upgrade_count

    }, error => {
      this.popUp.closeAll();
      console.log(error);
      this.popUp.open(PopupComponent, {
        width: '250px',
        height: '250px',
        data: { message: error.error.message, buttonvalue: "Cancel" }
      })
      localStorage.clear()
      this.Router.navigateByUrl('/login')
    })
  }
  customerType(dateRange: string) {
    const token = this.token
    this.auth.custometype(token, dateRange).subscribe((res: any) => {
      this.endUser = res.customerType[0].endUser
      this.channelPartner = res.customerType[0].channelPartner
      this.reseller = res.customerType[0].reseller

    }, error => {
      this.popUp.closeAll();
      console.log(error);
      this.popUp.open(PopupComponent, {
        width: '250px',
        height: '250px',
        data: { message: error.error.message, buttonvalue: "Cancel" }
      })
      localStorage.clear()
      this.Router.navigateByUrl('/login')
    })
  }
  moduleCount(dateRange: string) {
    const token = this.token
    this.auth.modulecount(token, dateRange).subscribe((res: any) => {
      this.dgVox = res.modulecount[0].dgVox_count
      this.speechBill = res.modulecount[0].speechBill_count
      this.both_count = res.modulecount[0].both_count
      this.Windows = res.modulecount[0].Windows_count
      this.Linux = res.modulecount[0].Linux_count
    }, error => {
      this.popUp.closeAll();
      console.log(error);
      this.popUp.open(PopupComponent, {
        width: '250px',
        height: '250px',
        data: { message: error.error.message, buttonvalue: "Cancel" }
      })
      localStorage.clear()
      this.Router.navigateByUrl('/login')
    })
  }


  selectDateRange(dateRange: string) {
    if (this.dashboardComponent) {
      this.dashboardComponent.selectDateRange(dateRange);
    }
    this.selectedateRange = dateRange;
  }

  divFunction(name: string) {
    this.buildDiv = name
  }

  logout() {  
    localStorage.clear()
    this.Router.navigateByUrl('/login')
  }

  toggleLogout() {
    if (this.showLogoutButton) {
      this.logoutstatus = false;
    } else {
      this.logoutstatus = true;
    }
    this.showLogoutButton = !this.showLogoutButton;
  }
  event() {
    if (this.logoutstatus) {
      this.showLogoutButton = true;
    } else {
      this.showLogoutButton = false;
    }
    this.logoutstatus = false
  }
}
