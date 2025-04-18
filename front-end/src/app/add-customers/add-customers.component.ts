import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LicenseListService } from '../../service/licenseDetails/license-list.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DealersLisitingService } from '../../service/dealers/dealers-lisiting.service';
import { CustomersPopupComponent } from '../customers-popup/customers-popup.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AddRegionComponent } from '../add-region/add-region.component';

@Component({
  selector: 'app-add-customers',
  standalone: true,
  imports: [MatIconModule, HttpClientModule, FormsModule, CustomersPopupComponent, MatSelectModule, AddRegionComponent],
  providers: [LicenseListService, DealersLisitingService],
  templateUrl: './add-customers.component.html',
  styleUrl: './add-customers.component.css'
})

export class AddCustomersComponent implements OnInit {
  isEditMode: boolean | undefined;
  token: string | null;
  regions: string[] = [];
  selectedregion: string ='';
  selectedCustomerType: string = 'Channel Partner';
  dealerName: string | undefined;
  Address1: string | undefined;
  CityName: string | undefined;
  ContactNumber: number | undefined;
  Email: string | undefined;
  StateName: string | undefined;
  AlternateNumber: number | undefined;
  Address2: string | undefined;
  PostalCode: number | undefined;
  dealerCode: string | undefined;
  status: string = 'Create New Dealer';

  constructor(public dialogRef: MatDialogRef<AddCustomersComponent>, private LicenseList: LicenseListService,
    private dealer_list: DealersLisitingService, private popUp: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.token = localStorage.getItem('Token');
    this.isEditMode = data && data.elementData;
  }
  async ngOnInit():  Promise<void> {
    await this.regiondetails();
    if (this.data && this.data.elementData) {
      const element = this.data.elementData;      
      this.dealerName = element.CustomerName
      this.Address1 = element.Address
      this.Address2 = element.Address2
      this.CityName = element.City
      this.StateName = element.State
      this.ContactNumber = element.Phone
      this.AlternateNumber = element.alternateContactNum
      this.PostalCode = element.postalCode
      this.Email = element.emailId
      this.selectedregion = element.Country
      this.dealerCode = element.dealerCode
      this.status = this.data.status     
      this.selectedCustomerType = element.Type
    }
  }
  // Validating Form
  isValidForm(): boolean {
    return !!(
      this.dealerName &&
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
  // Fetching region details
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
  // Saving dealer details
  save() {
    if (this.isEditMode == null) {
      let UserId
      if (this.token) {
        const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
        UserId = tokenPayload.Details.userId
      }
      const dealerdetails = {
        dealerName: this.dealerName, address1: this.Address1, address2: this.Address2,
        city: this.CityName, state: this.StateName, postalCode: this.PostalCode, customerType: this.selectedCustomerType,
        contactNum: this.ContactNumber, alternateContactNum: this.AlternateNumber, emailId: this.Email,
        regionId: this.selectedregion, userId: UserId, isActive: 1
      }
      this.dealer_list.createDealer(this.token, dealerdetails).subscribe((res: any) => {
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
    } else {
      let UserId
      if (this.token) {
        const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
        UserId = tokenPayload.Details.userId
      }
      const dealerdetails = {
        dealerName: this.dealerName, address1: this.Address1, address2: this.Address2,
        city: this.CityName, state: this.StateName, postalCode: this.PostalCode, customerType: this.selectedCustomerType,
        contactNum: this.ContactNumber, alternateContactNum: this.AlternateNumber, emailId: this.Email,
        regionId: this.selectedregion, userId: UserId, isActive: 1, dealerCode: this.dealerCode
      }
      this.dealer_list.updateDealer(this.token, dealerdetails).subscribe((res: any) => {
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
        console.log("error", error);
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
