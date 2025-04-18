import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LicenseListService } from '../../service/licenseDetails/license-list.service';
import { HttpClientModule } from '@angular/common/http';
import { DealersLisitingService } from '../../service/dealers/dealers-lisiting.service';
import { CustomersPopupComponent } from '../customers-popup/customers-popup.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserslisitingService } from '../../service/users/userslisiting.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [MatIconModule, HttpClientModule, FormsModule, CustomersPopupComponent, ReactiveFormsModule,
    MatFormFieldModule, MatSelectModule, MatCheckboxModule],
  providers: [UserslisitingService],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.css'
})

export class AddUsersComponent {
  // toppings = new FormControl('');
  // toppings = new FormControl([...this.toppingList]);

  toppingList: any[] = [{ name: 'License', checked: false }, { name: 'Dashboard', checked: false },
  { name: 'Settings', checked: false }];
  // toppings = new FormControl(['all']);
  toppings = new FormControl(this.toppingList);
  // toppings = new FormControl([...this.toppingList, 'all']);
  value: any = 1;

  isEditMode: boolean | undefined;
  token: string | null;
  userName: string ='null';
  firstName: string | undefined;
  lastName: string | undefined;
  phone: number | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  role: string | undefined;
  passwordMismatch: boolean = false;
  type: string = '';
  isEmailReadOnly: boolean = false;
  passwordErrors: string[] = [''];
  status: string = 'Create New User';

  checkPasswordMismatch() {
    this.passwordMismatch = this.password !== this.confirmPassword;
  }

  constructor(public dialogRef: MatDialogRef<AddUsersComponent>, private users: UserslisitingService,
    private popUp: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.token = localStorage.getItem('Token');
    this.isEditMode = data && data.elementData;
  }

  ngOnInit(): void {
    if (this.data && this.data.elementData) {
      const element = this.data.elementData;
      const type = element.type
      this.userName = element.userName
      this.email = element.emailId
      this.firstName = element.firstName
      this.lastName = element.lastName
      this.phone = element.phone
      this.role = element.role
      this.password = element.password
      this.confirmPassword = element.password
      this.isEmailReadOnly = true
      this.status = this.data.status

      switch (this.role) {
        case '111':
          this.toppingList[0].checked = true;
          this.toppingList[1].checked = true;
          this.toppingList[2].checked = true;
          break;
        case '110':
          this.toppingList[0].checked = true;
          this.toppingList[1].checked = true;
          this.toppingList[2].checked = false;
          break;
        case '101':
          this.toppingList[0].checked = true;
          this.toppingList[1].checked = false;
          this.toppingList[2].checked = true;
          break;
        case '011':
          this.toppingList[0].checked = false;
          this.toppingList[1].checked = true;
          this.toppingList[2].checked = true;
          break;
        case '100':
          this.toppingList[0].checked = true;
          this.toppingList[1].checked = false;
          this.toppingList[2].checked = false;
          break;
        case '010':
          this.toppingList[0].checked = false;
          this.toppingList[1].checked = true;
          this.toppingList[2].checked = false;
          break;
        case '001':
          this.toppingList[0].checked = false;
          this.toppingList[1].checked = false;
          this.toppingList[2].checked = true;
          break;
        default:
          this.toppingList[0].checked = false;
          this.toppingList[1].checked = false;
          this.toppingList[2].checked = false;
          break;
      }
         
    }
  }

  allComplete: any
  updateAllComplete(checkboxValue: any) {
    this.allComplete = this.toppingList != null && this.toppingList.every((t: any) => t.checked);
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (completed == true) {
      this.toppingList.forEach((t: any) => (t.checked = true));
    } else {
      this.toppingList.forEach((t: any) => (t.checked = false));
    }
  }

  closeDateSelector() {
    this.dialogRef.close();
  }

  getSelectedItemsPlaceholder(): string {
    const selectedItems = this.toppingList.filter(item => item.checked).map(item => item.name);
    if (selectedItems.length > 0) {
        return selectedItems.join(', ');
    } else {
        return 'Select a Role';
    }
}
  save(): void {
    if (this.isEditMode == null) {
      if (this.toppingList[0].checked && this.toppingList[1].checked && this.toppingList[2].checked) {
        // All toppings are checked
        this.role = '111';
        this.type = 'Admin'
      } else if (this.toppingList[0].checked && this.toppingList[1].checked && !this.toppingList[2].checked) {
        // First two toppings are checked, but not the third
        this.role = '110';
        this.type = 'Editor'
      } else if (this.toppingList[0].checked && !this.toppingList[1].checked && this.toppingList[2].checked) {
        // First and third toppings are checked, but not the second
        this.role = '101';
        this.type = 'Editor'
      } else if (!this.toppingList[0].checked && this.toppingList[1].checked && this.toppingList[2].checked) {
        // Second and third toppings are checked, but not the first
        this.role = '011';
        this.type = 'Editor'
      } else if (this.toppingList[0].checked && !this.toppingList[1].checked && !this.toppingList[2].checked) {
        // Only the first topping is checked
        this.role = '100';
        this.type = 'Editor'
      } else if (!this.toppingList[0].checked && this.toppingList[1].checked && !this.toppingList[2].checked) {
        // Only the second topping is checked
        this.role = '010';
        this.type = 'Editor'
      } else if (!this.toppingList[0].checked && !this.toppingList[1].checked && this.toppingList[2].checked) {
        // Only the third topping is checked
        this.role = '001';
        this.type = 'Editor'
      } else {
        // None of the toppings are checked
        this.role = '000';
      }
      const userName = `${this.firstName} ${this.lastName}`
      const userdetails = {
        userName: userName, email: this.email, firstName: this.firstName,
        lastName: this.lastName, phone: this.phone, role_LRS: this.role, password: this.password, type: this.type
      }
      this.users.createuser(this.token, userdetails).subscribe((res: any) => {
        this.popUp.closeAll();
        if (res.status == true) {
          this.popUp.open(CustomersPopupComponent, {
            width: '300px', height: '210px',
            data: { message: res.message, buttonvalue: "OK" }
          })
        }
      }, error => {
        this.popUp.closeAll();
        console.log("error", error);
        this.popUp.open(CustomersPopupComponent, {
          width: '300px',
          height: '210px', data: { message: error.error.message, buttonvalue: "Cancel" }
        })
      }
      )
    }
    // Edit User
    else {
      if (this.toppingList[0].checked && this.toppingList[1].checked && this.toppingList[2].checked) {
        // All toppings are checked
        this.role = '111';
        this.type = 'Admin'
      } else if (this.toppingList[0].checked && this.toppingList[1].checked && !this.toppingList[2].checked) {
        // First two toppings are checked, but not the third
        this.role = '110';
        this.type = 'Editor'
      } else if (this.toppingList[0].checked && !this.toppingList[1].checked && this.toppingList[2].checked) {
        // First and third toppings are checked, but not the second
        this.role = '101';
        this.type = 'Editor'
      } else if (!this.toppingList[0].checked && this.toppingList[1].checked && this.toppingList[2].checked) {
        // Second and third toppings are checked, but not the first
        this.role = '011';
        this.type = 'Editor'
      } else if (this.toppingList[0].checked && !this.toppingList[1].checked && !this.toppingList[2].checked) {
        // Only the first topping is checked
        this.role = '100';
        this.type = 'Editor'
      } else if (!this.toppingList[0].checked && this.toppingList[1].checked && !this.toppingList[2].checked) {
        // Only the second topping is checked
        this.role = '010';
        this.type = 'Editor'
      } else if (!this.toppingList[0].checked && !this.toppingList[1].checked && this.toppingList[2].checked) {
        // Only the third topping is checked
        this.role = '001';
        this.type = 'Editor'
      } else {
        // None of the toppings are checked
        this.role = '000';
        this.type = 'Editor'
      }

      const userdetails = {
        userName: this.userName, email: this.email, firstName: this.firstName,
        lastName: this.lastName, phone: this.phone, role_LRS: this.role, password: this.password, type: this.type
      }
      this.users.updateuser(this.token, userdetails).subscribe((res: any) => {
        this.popUp.closeAll();
        if (res.status == true) {
          this.popUp.open(CustomersPopupComponent, {
            width: '300px', height: '210px',
            data: { message: res.message, buttonvalue: "OK" }
          })
        }
      }, error => {
        this.popUp.closeAll();
        console.log("error", error);
        this.popUp.open(CustomersPopupComponent, {
          width: '300px',
          height: '210px', data: { message: error.error.message, buttonvalue: "Cancel" }
        })
      }
      )
    }
  }

  isValidForm(): boolean {

    if (this.isEditMode == null) {
    return !!(
      this.userName &&
      this.password &&
      this.firstName &&
      this.confirmPassword &&
      this.phone &&
      this.lastName &&
      this.email &&
      (this.toppingList[0].checked ||
        this.toppingList[1].checked ||
        this.toppingList[2].checked) &&
      (this.passwordMismatch == false)
    );
  }
  else{
    return !!(
      this.userName &&
      this.firstName &&
      this.phone &&
      this.lastName &&
      this.email &&
      (this.toppingList[0].checked ||
        this.toppingList[1].checked ||
        this.toppingList[2].checked) &&
      (this.passwordMismatch == false)
    );
  }
  }
  
  validatePassword(){
    this.passwordErrors = [];

    if (!this.password) {
      this.passwordErrors.push('Password required.');
    } else {
      if (this.password.length < 8) {
        this.passwordErrors.push('Password must be at least 8 characters long.');
      }
      if (!/[A-Z]/.test(this.password)) {
        this.passwordErrors.push('Password must contain at least one uppercase letter.');
      }
      if (!/[a-z]/.test(this.password)) {
        this.passwordErrors.push('Password must contain at least one lowercase letter.');
      }
      if (!/\d/.test(this.password)) {
        this.passwordErrors.push('Password must contain at least one number.');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
        this.passwordErrors.push('Password must contain at least one special character.');
      }
    }
  }
}
