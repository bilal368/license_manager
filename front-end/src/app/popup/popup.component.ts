import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})

export class PopupComponent implements OnInit {
  // open(PopupComponent: typeof PopupComponent, arg1: { width: string; height: string; data: { message: any; buttonvalue: string; }; }) {
  //   throw new Error('Method not implemented.');
  // }
  closeAll() {
    throw new Error('Method not implemented.');
  }
  constructor(@Inject(MAT_DIALOG_DATA) public datas: any) {}

  message: any = ''
  heading: any = ''
  buttonvalue: any
  
  ngOnInit() {
    this.heading = this.datas.heading
    this.message = this.datas.message
    this.buttonvalue = this.datas.buttonvalue
  }
  
}

