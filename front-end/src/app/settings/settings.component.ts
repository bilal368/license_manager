import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DealersLisitingService } from '../../service/dealers/dealers-lisiting.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddCustomersComponent } from '../add-customers/add-customers.component';
import { CustomersPopupComponent } from '../customers-popup/customers-popup.component';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { EndUserLisitingService } from '../../service/endUsers_customer/end-user-lisiting.service';
import { AddEndUsersComponent } from '../add-end-users/add-end-users.component';
import { UserslisitingService } from '../../service/users/userslisiting.service';
import { AddUsersComponent } from '../add-users/add-users.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { PasswordChangePopupComponent } from '../password-change-popup/password-change-popup.component';
import { AddRegionComponent } from '../add-region/add-region.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


export interface PeriodicElement {
  State: any;
  alternateContactNum: any;
  Type: any;
  region: any;
  postalCode: any;
  type: any;
  phone: any;
  lastName: any;
  firstName: any;
  emailId: any;
  CustomerName: string;
  Address: string;
  City: string;
  Country: string;
  Region: string;
  Phone: number;
  dealerCode: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatTabsModule, FormsModule, ReactiveFormsModule, MatIconModule, MatFormFieldModule,
    MatTableModule, MatPaginatorModule],
  providers: [DealersLisitingService, EndUserLisitingService, UserslisitingService, UserslisitingService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements AfterViewInit {
  @ViewChild('dealerPaginator') dealerPaginator!: MatPaginator;
  @ViewChild('endUsersPaginator') endUsersPaginator!: MatPaginator;
  @ViewChild('UsersPaginator') UsersPaginator!: MatPaginator;

  token: string | null;
  searchValue_dealer: any;
  searchValue_customer: any;
  searchValue_user: any;
  oldPassword: string | undefined;
  newPassword: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  ngAfterViewInit() {
    this.dataSource.paginator = this.dealerPaginator;
    this.endUsers_dataSource.paginator = this.endUsersPaginator;
    this.Users_dataSource.paginator = this.UsersPaginator
  }
  ngOnInit() {
    this.dealerList();
    this.customerList();
    this.userList();
  }

  //Users
  Users_displayed: string[] = ['User Name', 'First Name', 'Last Name', 'Phone', 'Email', 'icons'];
  Users_dataSource = new MatTableDataSource<PeriodicElement>([]);
  Users_filteredData = new MatTableDataSource<any>();

  // Dealers
  displayedColumns: string[] = ['Dealer Name', 'Address', 'City', 'Country', 'Type', 'Phone', 'icons'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  filteredDataSource = new MatTableDataSource<any>();

  // End-users
  endUsers_displayed: string[] = ['Customer Name', 'Address', 'City', 'Country', 'Type', 'Phone', 'icons'];
  endUsers_dataSource = new MatTableDataSource<PeriodicElement>([]);
  endUsers_filteredDataSource = new MatTableDataSource<any>();

  constructor(private dealer_list: DealersLisitingService, private popUp: MatDialog, private router: Router,
    private customer_list: EndUserLisitingService, private users_list: UserslisitingService, private users: UserslisitingService,
  ) {
    this.token = localStorage.getItem('Token');
  }
  clearFields() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  checkPasswordMismatch() {
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
  }

  isValidForm() {
    if (this.newPassword.trim() == '' && this.confirmPassword.trim() == '') {
      return false;
    } else {
      return this.newPassword === this.confirmPassword;
    }
  }
  // user Password change
  changePassword() {
    let UserId
    if (this.token) {
      const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
      UserId = tokenPayload.Details.userId
    }
    const userdetails = { UserId: UserId, oldPassword: this.oldPassword, newPassword: this.newPassword }
    this.users.changePassword(this.token, userdetails).subscribe((res: any) => {
      this.popUp.closeAll();
      if (res.status == true) {
        this.popUp.open(PasswordChangePopupComponent, {
          width: '300px', height: '210px',
          data: { message: res.message, buttonvalue: "OK" }
        })
        this.clearFields();
        localStorage.setItem('Token', '');
        this.token = '';
        this.router.navigate(['/login']);
      }
    }, error => {
      this.popUp.closeAll();
      console.log("error", error);
      this.popUp.open(PasswordChangePopupComponent, {
        width: '300px',
        height: '210px', data: { message: error.error.message, buttonvalue: "Cancel" }
      })
    })

  }
  // Filter Users
  filterUsers() {
    const searchTerm = this.searchValue_user.trim().toLowerCase();

    if (searchTerm === '') {
      // If the search term is empty, load the entire list of dealers
      this.userList();
    } else { 
      // Filter the data based on the search term
      const filteredData = this.Users_dataSource.data.filter((user: any) =>
        user.userName.toLowerCase().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.phone.toLowerCase().includes(searchTerm) ||
        user.emailId.toLowerCase().includes(searchTerm) 
      );

      if (filteredData.length === 0) {
        // If no matching records found, clear the existing data and show an empty row
        this.Users_dataSource.data = [];
        this.Users_dataSource.data.push({
          CustomerName: '',
          Address: '',
          City: '',
          Country: '',
          Region: '',
          Phone: 0,
          dealerCode: '',
          type: '',
          phone: '',
          lastName: '',
          firstName: '',
          emailId: '',
          State: undefined,
          alternateContactNum: undefined,
          Type: undefined,
          region: undefined,
          postalCode: undefined
        });
      } else {
        // Update the data source with filtered data
        this.Users_dataSource.data = filteredData;
      }
    }
  }
  // Filter Dealers
  filterDealers() {
    const searchTerm = this.searchValue_dealer.trim().toLowerCase();

    if (searchTerm === '') {
      // If the search term is empty, load the entire list of dealers
      this.dealerList();
    } else {
      // Filter the data based on the search term
      const filteredData = this.dataSource.data.filter((dealer: any) =>
        dealer.CustomerName.toLowerCase().includes(searchTerm) ||
        dealer.Address.toLowerCase().includes(searchTerm)
      );

      if (filteredData.length === 0) {
        // If no matching records found, clear the existing data and show an empty row
        this.dataSource.data = [];
        this.dataSource.data.push({
          CustomerName: 'No data found',
          Address: '',
          City: '',
          Country: '',
          Region: '',
          Phone: 0,
          dealerCode: '',
          type: undefined,
          phone: undefined,
          lastName: undefined,
          firstName: undefined,
          emailId: undefined,
          State: undefined,
          alternateContactNum: undefined,
          Type: undefined,
          region: undefined,
          postalCode: undefined
        });
      } else {
        // Update the data source with filtered data
        this.dataSource.data = filteredData;
      }
    }
  }
  // Filter Customers
  filterCustomer() {
    const searchTerm = this.searchValue_customer.trim().toLowerCase();

    if (searchTerm === '') {
      // If the search term is empty, load the entire list of dealers
      this.customerList();
    } else {
      // Filter the data based on the search term
      const filteredData = this.endUsers_dataSource.data.filter((dealer: any) =>
        dealer.CustomerName.toLowerCase().includes(searchTerm) ||
        dealer.Address.toLowerCase().includes(searchTerm)
      );

      if (filteredData.length === 0) {
        // If no matching records found, clear the existing data and show an empty row
        this.endUsers_dataSource.data = [];
        this.endUsers_dataSource.data.push({
          CustomerName: 'No data found',
          Address: '',
          City: '',
          Country: '',
          Region: '',
          Phone: 0,
          dealerCode: '',
          emailId: '',
          firstName: '',
          lastName: '',
          phone: '',
          type: '',
          State: undefined,
          alternateContactNum: undefined,
          Type: undefined,
          region: undefined,
          postalCode: undefined
        });
      } else {
        // Update the data source with filtered data
        this.endUsers_dataSource.data = filteredData;
      }
    }
  }
  // Download Users Details
  downloadExcel_users() {
    console.log("this.Users_dataSource.data",this.Users_dataSource.data);
    // 'Type': user.type
    let userDetails = this.Users_dataSource.data.map(user => ({
      'Email Id': user.emailId,
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Phone': user.phone,   
    }));
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(userDetails);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    /* save to file */
    XLSX.writeFile(wb, 'User Details.xlsx');
  }
  // Download Dealers Details
  downloadExcel() {

    let dealerDetails = this.dataSource.data.map(user => ({
      'Address': user.Address,
      'Postalcode': user.postalCode,
      'Email id': user.emailId,
      'Region': user.region,
      'Customer name': user.CustomerName,
      'City': user.City,
      'Cutomer type': user.Type,
      'Phone': user.Phone,
      'Alternate no': user.alternateContactNum,
      'State': user.State  
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dealerDetails);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Dealer Details.xlsx');
  }
  // Download Customer Details
  downloadExcel_endUsers() {
    let endUsersDetails = this.endUsers_dataSource.data.map(user => ({
      'Address': user.Address,
      'Postalcode': user.postalCode,
      'Email id': user.emailId,
      'Region': user.Country,
      'Customer name': user.CustomerName,
      'City': user.City,
      'Cutomer type': user.Type,
      'Phone': user.Phone,
      'Alternate no': user.alternateContactNum,
      'State': user.State  
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(endUsersDetails);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'EndUsers Details.xlsx');
  }
  //Fetching users data
  userList() {
    let UserId
    if (this.token) {
      const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
      UserId = tokenPayload.Details.userId
    }

    interface User {
      userId: string;
      firstName: string;
      lastName: string;
      emailId: string;
      phone: string;
      type: string;
      userName: string;
      role: string
    }
    this.users_list.fetchusersList(this.token,UserId).subscribe((res: any) => {
      const ELEMENT_DATA: PeriodicElement[] = res.users.map((user: User) => ({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        phone: user.phone,
        type: user.type,
        userName: user.userName,
        role: user.role
      }));
      this.Users_dataSource.data = ELEMENT_DATA;
    })
  }
  //Fetching dealers data
  dealerList() {
    interface Dealer {
      state: any;
      address1: string;
      address2: string;
      city: string;
      contactNum: string;
      country: string;
      customerType: string;
      dealerCode: string;
      dealerName: string;
      icons: any;
      postalCode: any;
      emailId: any;
      alternateContactNum: any;
      regionID: any;
    }
    this.dealer_list.fetchdealerList(this.token).subscribe((res: any) => {
      const ELEMENT_DATA: PeriodicElement[] = res.dealers.map((dealer: Dealer) => ({
        dealerCode: dealer.dealerCode,
        Address2: dealer.address2,
        postalCode: dealer.postalCode,
        emailId: dealer.emailId,
        region: dealer.regionID,
        alternateContactNum: dealer.alternateContactNum,
        CustomerName: dealer.dealerName,
        Address: dealer.address1,
        City: dealer.city,
        Country: dealer.country,
        Type: dealer.customerType,
        Phone: parseInt(dealer.contactNum),
        State: dealer.state
      }));
      this.dataSource.data = ELEMENT_DATA;
    })
  }
  //Fetching customer data
  customerList() {
    interface Customer {
      state: any;
      address1: string;
      address2: string;
      city: string;
      contactNum: string;
      country: string;
      customerType: string;
      customerCode: string;
      customerName: string;
      icons: any;
      postalCode: any;
      emailId: any;
      alternateContactNum: any;
      regionID: any;
    }
    this.customer_list.fetchcustomerList(this.token).subscribe((res: any) => {
      const ELEMENT_DATA: PeriodicElement[] = res.customers.map((customer: Customer) => ({
        customerCode: customer.customerCode,
        Address2: customer.address2,
        postalCode: customer.postalCode,
        emailId: customer.emailId,
        region: customer.regionID,
        alternateContactNum: customer.alternateContactNum,
        CustomerName: customer.customerName,
        Address: customer.address1,
        City: customer.city,
        Country: customer.country,
        Type: customer.customerType,
        Phone: parseInt(customer.contactNum),
        State: customer.state
      }));
      this.endUsers_dataSource.data = ELEMENT_DATA;
    })
  }
  // Edit User
  user_editItem(element: any) {
    const dialogRef: MatDialogRef<AddUsersComponent> = this.popUp.open(AddUsersComponent, {
      width: "800px",
      height: "500px",
      data: { elementData: element,status:"Update user" }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.userList(); // This will be called after the dialog is closed
    });
  }
  // Edit Dealer
  editItem(element: any) {
    const dialogRef: MatDialogRef<AddCustomersComponent> = this.popUp.open(AddCustomersComponent, {
      width: "800px",
      height: "500px",
      data: { elementData: element,status:"Update dealer"  }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.dealerList(); // This will be called after the dialog is closed
    });
  }
  // Edit Customers
  endUser_editItem(element: any) {
    const dialogRef: MatDialogRef<AddEndUsersComponent> = this.popUp.open(AddEndUsersComponent, {
      width: "800px",
      height: "500px",
      data: { elementData: element }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.customerList(); // This will be called after the dialog is closed
    });
  }
  // Delete user
  delete_user(emailId: any) {

    const dialogRef = this.popUp.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { email: emailId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.popUp.open(LoadingSpinnerComponent);
        this.users_list.Deleteuser(this.token, emailId).subscribe((res: any) => {
          this.popUp.closeAll();
          if (res.status == true) {
            this.popUp.open(CustomersPopupComponent, {
              width: '300px',
              height: '210px',
              data: { message: res.message, buttonvalue: "OK" }
            })
            this.userList();
          }
        }, error => {
          this.popUp.closeAll();
          console.log("error", error);
          this.popUp.open(CustomersPopupComponent, {
            width: '300px',
            height: '210px',
            data: { message: error.error.message, buttonvalue: "Cancel" }
          })
          this.userList();
        }
        )
      }
    });
  }
  //Delete Dealer
  deleteItem(dealerCode: any) {
    const dialogRef = this.popUp.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { dealerCode: dealerCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.popUp.open(LoadingSpinnerComponent);
        this.dealer_list.Deletedealer(this.token, dealerCode).subscribe((res: any) => {
          this.popUp.closeAll();
          if (res.status == true) {
            this.popUp.open(CustomersPopupComponent, {
              width: '300px',
              height: '210px',
              data: { message: res.message, buttonvalue: "OK" }
            })
            this.dealerList();
          }
        }, error => {
          this.popUp.closeAll();
          console.log("error", error);
          this.popUp.open(CustomersPopupComponent, {
            width: '300px',
            height: '210px',
            data: { message: error.error.message, buttonvalue: "Cancel" }
          })
          this.dealerList();
        }
        )
      }
    });
  }
  //Delete Customer
  endUser_deleteItem(customerCode: any) {
    // customerdelete
    const dialogRef = this.popUp.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { customerCode: customerCode }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customer_list.Deletecustomer(this.token, customerCode).subscribe((res: any) => {
          this.popUp.closeAll();
          if (res.status == true) {
            this.popUp.open(CustomersPopupComponent, {
              width: '300px',
              height: '210px',
              data: { message: res.message, buttonvalue: "OK" }
            })
            this.customerList();
          }
        }, error => {
          this.popUp.closeAll();
          console.log("error", error);
          this.popUp.open(CustomersPopupComponent, {
            width: '300px',
            height: '210px',
            data: { message: error.error.message, buttonvalue: "Cancel" }
          })
          this.customerList();
        }
        )
      }
    });
  }
  // Adding new user
  new_User() {
    const dialogRef: MatDialogRef<AddUsersComponent> = this.popUp.open(AddUsersComponent, {
      width: "800px",
      height: "500px",
    });

    dialogRef.afterClosed().subscribe(() => {
      this.userList(); // This will be called after the dialog is closed
    });
  }
  // Adding new Dealer
  new_Customer() {
    const dialogRef: MatDialogRef<AddCustomersComponent> = this.popUp.open(AddCustomersComponent, {
      width: "800px",
      height: "500px",
    });

    dialogRef.afterClosed().subscribe(() => {
      this.dealerList(); // This will be called after the dialog is closed
    });
  }
  // Adding new Enduser customers
  new_Endusers() {
    const dialogRef: MatDialogRef<AddEndUsersComponent> = this.popUp.open(AddEndUsersComponent, {
      width: "800px",
      height: "500px",
    });

    dialogRef.afterClosed().subscribe(() => {
      this.customerList(); // This will be called after the dialog is closed
    });
  }
  // Add Region
  new_region() {
    const dialogRef: MatDialogRef<AddRegionComponent> = this.popUp.open(AddRegionComponent, {
      width: "400px",
      height: "434px",
    });
  }
}

