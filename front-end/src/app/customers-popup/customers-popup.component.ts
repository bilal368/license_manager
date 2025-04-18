import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customers-popup',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule,MatIconModule],
  templateUrl: './customers-popup.component.html',
  styleUrl: './customers-popup.component.css'
})
export class CustomersPopupComponent implements OnInit  {
  closeAll() {
    throw new Error('Method not implemented.');
  }
  constructor(@Inject(MAT_DIALOG_DATA) public datas: any,public dialogRef: MatDialogRef<CustomersPopupComponent>) {}

  message: any = ''
  heading: any = ''
  buttonvalue: any
  
  ngOnInit() {
    this.heading = this.datas.heading
    this.message = this.datas.message
    this.buttonvalue = this.datas.buttonvalue
  }
  closeDateSelector() {
    this.dialogRef.close();
  }
}
