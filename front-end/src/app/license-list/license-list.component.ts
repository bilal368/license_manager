import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LicenseListService } from '../../service/licenseDetails/license-list.service';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CustomDateComponent } from '../custom-date/custom-date.component';
import { AddLicenseComponent } from '../add-license/add-license.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

export interface PeriodicElement {
  purchaseOrder: any;
  ordernumber: any;
  name: string;
  date: string;
  weight: number;
  symbol: string;

}

@Component({
  selector: 'app-license-list',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, CommonModule, MatSelectModule,
    MatMenuModule, HttpClientModule,  MatPaginatorModule, MatTableModule,
    MatSortModule, FormsModule, ReactiveFormsModule ],
  providers: [LicenseListService],
  templateUrl: './license-list.component.html',
  styleUrl: './license-list.component.css'
})
export class LicenseListComponent implements AfterViewInit {
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedateRange: string = 'This Month';
  displayedColumns: string[] = ['date', 'ordernumber', 'customername', 'region', 'modules', 'type', 'license'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  filteredDataSource = new MatTableDataSource<any>();
  token: string | null;
  decodedToken: any;
  totalLicense_list: any;
  created_on: any;
  purchaseOrder: any;
  customer_name: any;
  region: any;
  dgVox_status: any;
  speechBill_status: any;
  type: any;
  license_key: any;
  element: any;
  sortState: any;
  sortState1: any = 'customername';
  sortStatelicense: any;
  isPopupActive: boolean = false;
  searchValue_license: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private Router: Router, private auth: LicenseListService, private popUp: MatDialog, 
    private _liveAnnouncer: LiveAnnouncer,private clipboard: Clipboard,private snackbar: MatSnackBar) {
    this.token = localStorage.getItem('Token');
    if (this.token) {
      const tokenParts = this.token.split('.')
      const tokenPayload = tokenParts[1];
      // this.decodedToken = this.decodeToken(tokenPayload);
    }
  }

  ngOnInit() {
    this.licenseCount(this.selectedateRange);
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // Copy licensekey
  copyPassword(licenseKey: string) {
    this.clipboard.copy(licenseKey);
    this.snackbar.open('LicenseKey copied to clipboard', 'Dismiss', { duration: 2000 });
    
  }
  // Filter Customers
  filterCustomer() {
    const searchTerm = this.searchValue_license.trim().toLowerCase();

    if (searchTerm === '') {
      // If the search term is empty, load the entire list of dealers
      this.licenseCount(this.selectedateRange);
    } else { 
      
      const filteredData = this.dataSource.data.filter((data: any) => {
        const serialKey = data.serialKey ? data.serialKey.toLowerCase() : '';
        return (
          data.licenseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          serialKey.includes(searchTerm.toLowerCase())
        );
      });
      

      if (filteredData.length === 0) {
        // If no matching records found, clear the existing data and show an empty row
        this.dataSource.data = [];
        this.dataSource.data.push({
          purchaseOrder: undefined,
          ordernumber: undefined,
          name: '',
          date: '',
          weight: 0,
          symbol: ''
        });
      } else {
        // Update the data source with filtered data
        this.dataSource.data = filteredData;
      }
    }
  }
   // Download Customer Details
   downloadExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'License_Details.xlsx');
  }
  // Date Filter
  selectDateRange(dateRange: string) {
    this.selectedateRange = dateRange;

    if (dateRange == 'Custom') {
      this.isPopupActive = true; // Set popup active
      const dialogRef = this.popUp.open(CustomDateComponent, {
        width: '340px',
        height: '240px',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Handle the received dates here

          let dates = JSON.stringify({ fromdate: result.fromDate, todate: result.toDate })

        this.auth.fetchlicenselist(this.token, dateRange, dates).subscribe((res: any) => {
          const licenseDetails = res.license_details;
          console.log("licenseDetails",licenseDetails);
          
          const ELEMENT_DATA: PeriodicElement[] = licenseDetails.map((license: any) => {
            return {
              date: license.created_date,
              purchaseOrder: license.purchaseOrder,
              name: license.customer_name,
              region: license.region,
              type: license.type,
              licenseCode: license.license_key,
              dgVox_status: license.dgVox_status,
              speechBill_status: license.speechBill_status,
              region_svg_id: license.region_svg_id,
              serialKey: license.serialKey
            };
          });
          this.dataSource.data = ELEMENT_DATA;
        }
        )
        }
      });
      
    } else {
      this.licenseCount(dateRange);
    }
  }

  licenseCount(dateRange: string) {
    const token = this.token
    const dates = null
    this.auth.fetchlicenselist(token, dateRange, dates).subscribe((res: any) => { 
      const licenseDetails = res.license_details;

      const ELEMENT_DATA: PeriodicElement[] = licenseDetails.map((license: any) => {
        return {
          date: license.created_date,
          purchaseOrder: license.purchaseOrder,
          name: license.customer_name,
          region: license.region,
          type: license.type,
          licenseCode: license.license_key,
          dgVox_status: license.dgVox_status,
          speechBill_status: license.speechBill_status,
          region_svg_id: license.region_svg_id,
          serialKey: license.serialKey
        };
      });
      
      this.dataSource.data = ELEMENT_DATA;
      this.dataSource.paginator = this.paginator;    

    }
    )
    // ,
    // error=>{
    //   this.popUp.closeAll();
    //   console.log(error);
    //   this.popUp.open(PopupComponent,{ width: '250px',
    //     height: '250px',
    //     data: { message: error.error.message,buttonvalue:"Cancel" }
    //     })
    //     localStorage.clear()
    //     this.Router.navigateByUrl('/login')
    // })
  }

  announceSortChange(sortState: Sort) {

    if (sortState.active == "ordernumber") {

      this.sortState1 = { active: "customername" };
      this.displayedColumns[2] = 'customername';
      this.sortStatelicense = { active: "license" };
      this.displayedColumns[6] = 'license';

      this.sortState = { active: "name", direction: sortState.direction };
      this.displayedColumns[1] = 'name';
    }
    else if (sortState.active == "customername") {

      this.sortState = { active: "ordernumber" };
      this.displayedColumns[1] = 'ordernumber';
      this.sortStatelicense = { active: "license" };
      this.displayedColumns[6] = 'license';

      this.sortState1 = { active: "name", direction: sortState.direction };
      this.displayedColumns[2] = 'name';
    } else if (sortState.active == "license") {

      this.sortState1 = { active: "customername" }
      this.displayedColumns[2] = 'customername';
      this.sortState = { active: "ordernumber" }
      this.displayedColumns[1] = 'ordernumber';

      this.sortStatelicense = { active: "name", direction: sortState.direction };
      this.displayedColumns[6] = 'name';
    }
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filterData(sortDirection: string) {

    const sortedData = this.dataSource.filteredData.slice().sort((a, b) => {

      if (sortDirection === 'asc') {
        return a.purchaseOrder.localeCompare(b.purchaseOrder);
      } else {
        return b.purchaseOrder.localeCompare(a.purchaseOrder);
      }
    });
    this.filteredDataSource.data = sortedData;
  }
  new_license(){    
    const dialogRef = this.popUp.open(AddLicenseComponent, {
      width: "800px",
      height: "530px",
  });

  // After the dialog is closed, refresh the license count
  dialogRef.afterClosed().subscribe(result => {
          this.licenseCount(this.selectedateRange);
  });
  }
}
