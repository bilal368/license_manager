import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LicenseListService } from '../../service/licenseDetails/license-list.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomersPopupComponent } from '../customers-popup/customers-popup.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EndUserLisitingService } from '../../service/endUsers_customer/end-user-lisiting.service';
import { MatSelectModule } from '@angular/material/select';
import { AddRegionComponent } from '../add-region/add-region.component';


@Component({
  selector: 'app-add-end-users',
  standalone: true,
  imports: [MatIconModule, HttpClientModule, FormsModule, CustomersPopupComponent, MatSelectModule, AddRegionComponent],
  providers: [LicenseListService, EndUserLisitingService],
  templateUrl: './add-end-users.component.html',
  styleUrl: './add-end-users.component.css'
})
export class AddEndUsersComponent {
  isEditMode: boolean | undefined;
  token: string | null;
  regions: string[] = [];
  selectedregion: string | undefined;
  selectedCustomerType: string = 'endUser';
  customerName: string | undefined;
  Address1: string | undefined;
  CityName: string | undefined;
  ContactNumber: number | undefined;
  Email: string | undefined;
  StateName: string | undefined;
  AlternateNumber: number | undefined;
  Address2: string | undefined;
  PostalCode: number | undefined;
  customerCode: string | undefined;
  constructor(public dialogRef: MatDialogRef<AddEndUsersComponent>, private LicenseList: LicenseListService,
    @Inject(MAT_DIALOG_DATA) public data: any, private endUser_list: EndUserLisitingService, private popUp: MatDialog
  ) {
    this.token = localStorage.getItem('Token');
    this.isEditMode = data && data.elementData;
  }
  async ngOnInit(): Promise<void> {
    await this.regiondetails();
    if (this.data && this.data.elementData) {
      const element = this.data.elementData;    
      this.customerName = element.CustomerName
      this.Address1 = element.Address
      this.Address2 = element.Address2
      this.CityName = element.City
      this.StateName = element.Country
      this.ContactNumber = element.Phone
      this.AlternateNumber = element.alternateContactNum
      this.PostalCode = element.postalCode
      this.Email = element.emailId
      this.selectedregion = element.Country 
      this.customerCode = element.customerCode
      this.selectedCustomerType = element.Type 
    }
  }
  // validation
  isValidForm(): boolean {
    return !!(
      this.customerName &&
      this.Address1 &&
      this.CityName &&
      this.selectedregion &&
      // this.ContactNumber &&
      // this.Email &&
      this.selectedCustomerType &&
      this.Address2 &&
      this.StateName &&
      // this.AlternateNumber &&
      this.PostalCode
    );
  }
  // fetching region details
  regiondetails(): Promise<void> {
    const token = this.token;
    return new Promise((resolve) => {
      this.LicenseList.fetchregionlist(token).subscribe((res: any) => {
        this.regions = res.region.map((region: { regionName: any; }) => region.regionName);
        // Set the default selected dealer to the first one in the array
        if (this.regions.length > 0) {
          this.selectedregion = this.regions[0];
        }
        resolve(); // Signal completion of regiondetails()
      });
    });
  }
  // regiondetails() {
  //   const token = this.token
  //   this.LicenseList.fetchregionlist(token).subscribe((res: any) => {
  //     this.regions = res.region.map((region: { regionName: any; }) => region.regionName);
  //     // Set the default selected dealer to the first one in the array
  //     if (this.regions.length > 0) {
  //       this.selectedregion = this.regions[0];
  //     }
  //   })
  // }
  // Closing window
  closeDateSelector() {
    this.dialogRef.close();
  }
  // Managing Region
  new_region() {
    const dialogRef: MatDialogRef<AddRegionComponent> = this.popUp.open(AddRegionComponent, {
      width: "500px",
      height: "434px",
    });
    dialogRef.afterClosed().subscribe(result => {
      this.regiondetails();
    })
  }
  // Save the End users details
  save() {
    if (this.isEditMode == null) {
      let UserId
      if (this.token) {
        const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
        UserId = tokenPayload.Details.userId
      }
      const dealerdetails = {
        customerName: this.customerName, address1: this.Address1, address2: this.Address2,
        city: this.CityName, state: this.StateName, postalCode: this.PostalCode, customerType: this.selectedCustomerType,
        contactNum: this.ContactNumber, alternateContactNum: this.AlternateNumber, emailId: this.Email,
        country: this.selectedregion, regionId: this.selectedregion, userId: UserId, isActive: 1
      }
      this.endUser_list.createEnduser(this.token, dealerdetails).subscribe((res: any) => {
        this.popUp.closeAll();
        if (res.status == true) {
          this.popUp.open(CustomersPopupComponent, {
            width: '300px',
            height: '210px',
            data: { message: res.message, buttonvalue: "OK" }
          })
        }
      }, error => {
        this.popUp.closeAll();
        console.log("error", error);
        this.popUp.open(CustomersPopupComponent, {
          width: '300px',
          height: '210px',
          data: { message: error.error.message, buttonvalue: "Cancel" }
        })
      }
      )
    }
    // update endUser
    else {
      let UserId
      if (this.token) {
        const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
        UserId = tokenPayload.Details.userId
      }
      const dealerdetails = {
        customerName: this.customerName, address1: this.Address1, address2: this.Address2,
        city: this.CityName, state: this.StateName, postalCode: this.PostalCode, customerType: this.selectedCustomerType,
        contactNum: this.ContactNumber, alternateContactNum: this.AlternateNumber, emailId: this.Email,
        regionId: this.selectedregion, userId: UserId, isActive: 1, customerCode: this.customerCode
      }
      this.endUser_list.updateendUser(this.token, dealerdetails).subscribe((res: any) => {
        this.popUp.closeAll();
        if (res.status == true) {
          this.popUp.open(CustomersPopupComponent, {
            width: '300px',
            height: '210px',
            data: { message: res.message, buttonvalue: "OK" }
          })
          this.dialogRef.close();
        }
      }, error => {
        this.popUp.closeAll();
        this.popUp.open(CustomersPopupComponent, {
          width: '300px',
          height: '210px',
          data: { message: error.error.message, buttonvalue: "Cancel" }
        })
      }
      )
    }
  }

}
