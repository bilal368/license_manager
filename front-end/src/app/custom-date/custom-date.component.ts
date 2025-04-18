import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { LicenseListService } from '../../service/licenseDetails/license-list.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-date',
  standalone: true,
  imports: [MatIconModule, MatSelectModule, CommonModule, FormsModule],
  providers: [LicenseListService],
  templateUrl: './custom-date.component.html',
  styleUrl: './custom-date.component.css'
})
export class CustomDateComponent {
  @Output() close = new EventEmitter<void>();
  @Output() datesSelected = new EventEmitter<{ fromDate: string, toDate: string }>();

  token: string | null | undefined;
  dropdownOpen = false;
  dropdownOpenTo = false;
  selectedMonth = 'January';
  selectedMonthTo = 'December';
  years: number[] = [];
  to_years: number[] = [];
  from_selectedyear: any = 2014;
  to_selectedyear: any = 2014;
  selectedyear: any;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  fromSelectYear: any = 2014;
  toSelectYear: any = new Date().getFullYear();
  fromSelectMonth: any = 'January';
  toSelectMonth: string = new Date().toLocaleString('default', { month: 'long' }); 

  constructor(public dialogRef: MatDialogRef<CustomDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.selectedyear = new Date().getFullYear();
    let startYear = 2014;
    // this.fromSelectYear = 2014;
    // this.toSelectYear = currentYear

    for (let year = currentYear; startYear <= year; startYear++) {
      this.years.push(startYear);
    }

    this.to_selectedyear;
    for (let year = currentYear; this.to_selectedyear <= year; this.to_selectedyear++) {
      this.to_years.push(this.to_selectedyear);
    }

  }

  closeDateSelector() {
    this.dialogRef.close();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleDropdownTo() {
    this.dropdownOpenTo = !this.dropdownOpenTo;
  }
  selectMonth(month: string) {
    this.selectedMonth = month;
    this.dropdownOpen = false;
  }
  selectedMonthTO(month: string) {
    this.selectedMonthTo = month;
    this.dropdownOpen = false;
  }
  selectYear_from(year: number) {
    this.from_selectedyear = year
    this.to_selectedyear = year
    this.to_years = []
    this.ngOnInit();
  }
  selectYear(year: number) {
    this.selectedyear = year
  }

  setdate() {
    // Get the index of the selected month
    const fromMonthIndex = this.months.indexOf(this.fromSelectMonth);
    const toMonthIndex = this.months.indexOf(this.toSelectMonth);

    // Create the from date using the selected year and month index
    const fromDate1 = new Date(this.fromSelectYear, fromMonthIndex, 1);

    // Create the to date using the selected year, month index, and the last day of the month
    const toDate1 = new Date(this.toSelectYear, toMonthIndex + 1, 0);

    // Format the dates as 'YYYY-MM-DD'
    const formattedFromDate = this.formatDate(fromDate1);
    const formattedToDate = this.formatDate(toDate1);

    const fromDate = formattedFromDate;
    const toDate = formattedToDate;
    // const dates = { formattedFromDate: formattedFromDate, formattedToDate: formattedToDate }
    // this.datesSelected.emit({ fromDate, toDate });
    console.log("fromDate",fromDate);
    console.log("toDate",toDate);

    // Emit the dates and close the dialog
    this.datesSelected.emit({ fromDate, toDate });
    this.dialogRef.close({ fromDate, toDate });
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  }
}
