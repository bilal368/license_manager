import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LicenseListService } from '../../service/licenseDetails/license-list.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { RecorderLicenseComponent } from '../recorder-license/recorder-license.component';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ThemePalette } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { exit } from 'process';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
interface Feature {
  packageFeatureId: any;
  packageName: any;
  basicFeatureName: string;
  completed: boolean;
  // Add other properties as needed
}

@Component({
  selector: 'app-add-license',
  standalone: true,
  providers: [provideNativeDateAdapter(), LicenseListService],
  imports: [MatIconModule, CommonModule, MatFormFieldModule, FormsModule, MatInputModule, MatDatepickerModule,
    HttpClientModule, MatSelectModule, RecorderLicenseComponent, MatCheckboxModule],
  templateUrl: './add-license.component.html',
  styleUrl: './add-license.component.css'
})
export class AddLicenseComponent implements OnInit {
  selectedFeatures: any[] = [];
  productfeatures: any[] = [];
  allComplete: boolean = false;
  selectedtype: string = 'PRODUCTION';
  dropdownOpen: boolean = false;
  dropdownOpenlicense: boolean = false;
  selectedlicense: string = 'NEW';
  dropdownOpensearch: boolean = false;
  selectedsearch: string = 'LICENSE';
  searchfilter: string = '';
  searchValue: string = '';
  searchValue_dealer: string = '';
  searchValue_reseller: string = '';
  searchValue_customer: string = '';
  searchValue_region: string = '';
  macValue: string = '';
  nextpage: number = 0;
  nextButtonClicked: boolean = false;
  EnablesubmitClicked: boolean = false;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  token: string | null;
  expiryDays: number = 0;
  dealers: string[] = [];
  resellers: string[] = [];
  Versions: string[] = [];
  selectedDealer: string = '';
  showDropdown_dealer: boolean = false;
  customers: string[] = [];
  showDropdown_customer: boolean = false;
  selectedCustomer: string = '';
  showDropdown_region: boolean = false;
  regions: string[] = [];
  selectedregion: string | undefined;
  showDropdown_Version: boolean = false;
  showDropdown_modules: boolean = false;
  selectedmodule: any = 'Recorder & Accounting'
  installationValue: string = 'Stand Alone';
  seatsValue!: number;
  showDropdown_installation: boolean = false;
  selectedinstallation: string = 'Stand Alone';
  userType: any;
  showResellersList: any;
  res: any;
  list: any;
  showDropdown_reseller: boolean = false;
  selectedResellers: any;
  selectedVersion: any;
  showDatePicker = false;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  minDate_AMC: Date | undefined;
  maxDate_AMC: Date | undefined;
  activeDirectoryEnabled: boolean = false;
  selectedSystem: string = 'WINDOWS';
  macAddress: string = '';
  productName: string = '';
  poDate: string = '';
  machineCount: number = 0;
  dateValue: string = this.getCurrentDate();
  isFirstNextClicked: boolean = false;
  isUpdateClicked: boolean = false;
  resellersListAvailable: boolean = false;
  dropdownOpenSystem: boolean = false;
  recorderValues: any;
  accountValues: any;
  formattedFromDate: string = '0000-00-00 00:00:00';
  Digital_Recorder_status: boolean = false;
  Digital_Passive_IP_status: boolean = false;
  Digital_Active_IP_status: boolean = false;
  Digital_Analog_Recorder_status: boolean = false;
  Digital_E1_Recorder_status: boolean = false;
  isChecked: boolean = false;
  Features: any;
  backvalues: any;
  backaccoundingvalues: any;
  dealerinputvalue: number = 0;
  resellerinputvalue: number = 0;
  customerinputvalue: number = 0;
  regioninputvalue: number = 0;
  featuresByPackage: { [key: string]: Feature[]; } | undefined;
  index: any;
  searchValueToken: any;
  loading: boolean = true;

  constructor(public dialogRef: MatDialogRef<AddLicenseComponent>, private popUp: MatDialog, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, private LicenseList: LicenseListService, private dateAdapter: DateAdapter<Date>) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.token = localStorage.getItem('Token');

    // Set default current date
    const currentDate = new Date();
    this.fromDate = currentDate;

    // Set default to date after 1 year from current date
    this.toDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

    // Set min and max date for datepicker
    this.minDate_AMC = currentDate;
    this.maxDate_AMC = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

    // Use 'en-GB' locale for the datepicker
    this.dateAdapter.setLocale('en-GB');
  }

  toggleActiveDirectory() {
    this.activeDirectoryEnabled = !this.activeDirectoryEnabled;
  }
  onCheckboxChange(event: any) {
    this.showDatePicker = event.target.checked;
    this.isChecked = this.showDatePicker
  }
  ngOnInit(): void {
    this.dealerdetails();
    this.customerdetails();
    this.regiondetails();
    this.resellerslist();
    this.Versionsdetails();
    this.getRecording();
    this.getaccounding();
    this.featureCheck();
  }

  featureCheck() {
    if (this.selectedmodule == 'Recorder & Accounting') {
      if (this.recorderValues == '' && this.accountValues == '') {
        this.EnablesubmitClicked = false;
      }
    }
  }
  getRecording() {
    this.LicenseList.setSetValue().subscribe((res: any) => {
      this.recorderValues = res;
      if (this.selectedmodule == 'Recorder & Accounting') {
        if (this.recorderValues.seatsValue && this.accountValues.Extension) {
          this.updateFirstNextClicked();
        }
      }
      else if (this.selectedmodule == 'Recorder') {

        if (this.recorderValues.seatsValue) {
          this.updateFirstNextClicked();
        }
      } else if (this.selectedmodule == 'Accounting') {
        if (this.accountValues.Extension) {
          this.updateFirstNextClicked();
        }
      }
      this.backvalues = {
        backrecording: res
      }
    })
  }
  getaccounding() {
    this.LicenseList.accountSetValue().subscribe((res: any) => {
      this.accountValues = res;
      if (this.accountValues.Extension) {
        this.updateFirstNextClicked();
      }
      this.backaccoundingvalues = {
        backaccounding: res
      }
    })
  }


  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
  closeDateSelector() {
    this.dialogRef.close();
  }
  // Dropdown control 
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (event) {
      this.Features
      event.stopPropagation(); // Stop click event propagation
    }
    this.dropdownOpenSystem = false;
    this.dropdownOpenlicense = false;
    this.dropdownOpensearch = false;
  }
  // Dropdown control license
  toggleDropdownlicense() {
    this.dropdownOpenlicense = !this.dropdownOpenlicense;
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.dropdownOpenSystem = false;
    this.dropdownOpen = false;
    this.dropdownOpensearch = false;
  }
  // Dropdown control search
  toggleDropdownsearch() {
    this.dropdownOpensearch = !this.dropdownOpensearch;
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.dropdownOpenSystem = false;
    this.dropdownOpen = false;
    this.dropdownOpenlicense = false;
  }
  // Dropdown control system
  toggleDropdownSystem() {
    this.dropdownOpenSystem = !this.dropdownOpenSystem;
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.dropdownOpen = false;
    this.dropdownOpenlicense = false;
    this.dropdownOpensearch = false;
  }
  // Selected system
  selectedsystem(system: string) {
    this.selectedSystem = system;
    this.dropdownOpenSystem = false;
  }
  // Selected Type
  selectedType(type: string) {
    this.selectedtype = type;
    this.dropdownOpen = false;
    if (type == 'DEMO') {
      this.expiryDays = 30
    } else {
      this.expiryDays = 0
    }
  }
  // Selected license
  selectedLicense(license: string) {
    this.selectedlicense = license;
    this.dropdownOpenlicense = false;
    if (license == 'RE-ISSUE') {
      this.onInputChange();
    } else if (license == 'UPGRADE') {
      this.onInputChange();
    } else {
      this.EnablesubmitClicked = false;
    }
  }
  // Selected search
  selectedSearch(search: string) {
    this.selectedsearch = search;
    this.dropdownOpensearch = false;
  }
  onInputChange(): void {
    this.EnablesubmitClicked = this.searchValue.trim() === '';
  }

  next() {   
    const token = this.token;
    this.EnablesubmitClicked = true;
    this.nextButtonClicked = true;
    this.dropdownOpen = false;
    this.dropdownOpenlicense = false;
    if (this.selectedlicense != 'NEW') {
      this.loading = false;
      this.LicenseList.fetchlicense(token, this.searchValue).subscribe((res: any) => {
        this.dropdownOpensearch = false;
        if (this.searchValue) {
          setTimeout(() => {
            this.EnablesubmitClicked = false;
          }, 100)
          this.isFirstNextClicked = false;
          // this.nextpage = 1
          if (this.nextpage < 2) {
            this.nextpage++;
          }
          if (this.nextpage == 2) {
            // this.isFirstNextClicked = true;
            this.EnablesubmitClicked = false;
            this.isUpdateClicked = true
            const internalFeatures = res.decodedPayload.internalFeatures;
            this.selectedFeatures = internalFeatures
            this.LicenseList.fetchproductDetails(token).subscribe((res: any) => {

              let featuresByPackage: { [key: string]: any[] } = {};
              this.productfeatures = res.Features;
              // Iterate over res.Features
              res.Features.forEach((feature: Feature) => {
                // Initialize the packageName array if it doesn't exist
                if (!featuresByPackage[feature.packageName]) {
                  featuresByPackage[feature.packageName] = [];
                }

                // Check if the feature matches any in selectedFeatures by packageFeatureId
                const matchedFeature = this.selectedFeatures.find(
                  (internal: { packageFeatureId: any }) => internal.packageFeatureId === feature.packageFeatureId
                );

                // Push the feature into the featuresByPackage array with the 'completed' flag
                featuresByPackage[feature.packageName].push({
                  ...feature,
                  completed: matchedFeature ? true : false,
                });
              });

              // Assign the organized features to a class-level variable
              this.featuresByPackage = featuresByPackage;
            })
          }
        } else {
          this.nextpage = 0;
          this.isFirstNextClicked = false;
        }
        this.macAddress = res.MacAddress
        this.activeDirectoryEnabled = res.decodedPayload.ActiveDirectory
        this.selectedCustomer = res.decodedPayload.License.customer_name
        this.productName = res.decodedPayload.License.purchaseOrder
        this.dateValue = res.decodedPayload.License.productOrder_date
        this.selectedregion = res.decodedPayload.License.region
        // this.Features = res.decodedPayload.internalFeatures

        const recoder_status = res.License[0].dgVox_status
        const account_status = res.License[0].speechBill_status
        if ((recoder_status && account_status) == 1) {
          this.selectedmodule = 'Recorder & Accounting'
        } else if (recoder_status == 1 && account_status == 0) {
          this.selectedmodule = 'Recorder'
        } else if (account_status == 1 && recoder_status == 0) {
          this.selectedmodule = 'Accounting'
        }

        this.selectedVersion = res.License[0].version
        this.machineCount = res.License[0].machineCount

        this.Features = {
          recorder: res.decodedPayload.DGvox,
          Accounting: res.decodedPayload.Speechbill
        }

        this.selectedDealer = res.License[0].dealer_name

        if (res.License[0].resellers_name != 0) {
          this.showResellersList = true
          this.selectedResellers = res.License[0].resellers_name
        }

      }, error => {
        // this.popUp.closeAll();
        this.EnablesubmitClicked = false;
        this.nextButtonClicked = false;
        console.log(error);
        this.popUp.open(PopupComponent, {
          width: '250px',
          height: '250px',
          data: { message: error.error.message, buttonvalue: "Cancel" }
        })
      }
      )
    } else {
      // this.nextpage = 1  
      if (this.nextpage < 2) {
        this.nextpage++;
      }
      this.isFirstNextClicked = false
      if (this.nextpage == 1) {
        this.EnablesubmitClicked = false;
        if (this.searchValueToken) {

          this.LicenseList.newTokenDecryption(token, this.searchValueToken).subscribe(
            (res: any) => {      
              this.macAddress = res.decodedPayload.License.serialKey;
              this.activeDirectoryEnabled = res.decodedPayload.ActiveDirectory;
              this.selectedCustomer = res.decodedPayload.License.customer_name;
              this.productName = res.decodedPayload.License.purchaseOrder;
              this.dateValue = res.decodedPayload.License.productDate;
              this.selectedregion = res.decodedPayload.License.region;

              const recoder_status = res.decodedPayload.License.DGvoxstatus;
              const account_status = res.decodedPayload.License.Speechbillstatus;
              if ((recoder_status && account_status) == 1) {
                this.selectedmodule = 'Recorder & Accounting';
              } else if (recoder_status == 1 && account_status == 0) {
                this.selectedmodule = 'Recorder';
              } else if (account_status == 1 && recoder_status == 0) {
                this.selectedmodule = 'Accounting';
              }

              this.selectedVersion = res.decodedPayload.License.selectedVersion;
              this.machineCount = res.decodedPayload.License.machineCount;

              this.Features = {
                recorder: res.decodedPayload.DGvox,
                Accounting: res.decodedPayload.Speechbill
              };
              this.selectedDealer = res.decodedPayload.License.dealerName;

              if (res.decodedPayload.resellers_name != 0) {
                this.showResellersList = true;
                this.selectedResellers = res.decodedPayload.License.resellerName;
              }

              this.selectedFeatures = res.decodedPayload.internalFeatures
              this.loading = false; // Stop loading after data is fetched
            },
            (error) => {
              this.EnablesubmitClicked = true;
              this.nextButtonClicked = false;
              console.log(error);
              this.popUp.open(PopupComponent, {
                width: '250px',
                height: '250px',
                data: { message: error.error.message, buttonvalue: "Cancel" }
              });
              this.loading = false; // Stop loading on error
            }
          )

        } else {
          this.EnablesubmitClicked = true;
          this.loading = false;
          // Default values
          this.macAddress = '';
          this.activeDirectoryEnabled = false;
          this.productName = '';
          this.dateValue = this.getCurrentDate();;
          this.selectedmodule = 'Recorder & Accounting';
          this.machineCount = 0;
          this.Features = '';
          this.showResellersList = false;
          this.searchValue = '';
          this.dealerdetails();
          this.customerdetails();
          this.regiondetails();
          this.resellerslist();
          this.Versionsdetails();
          this.getRecording();
          this.featureCheck();
        }

      }
      if (this.nextpage == 2) {
        this.isFirstNextClicked = true
        this.EnablesubmitClicked = false;
        const internalFeatures = this.selectedFeatures;
        this.LicenseList.fetchproductDetails(token).subscribe((res: any) => {
          // Restructure product features into an object grouped by package name
          const featuresByPackage: { [key: string]: Feature[] } = {};
          this.productfeatures = res.Features;
          res.Features.forEach((feature: Feature) => {
            if (!featuresByPackage[feature.packageName]) {
              featuresByPackage[feature.packageName] = [];
            }
            const matchedFeature = internalFeatures.find(internal => internal.packageFeatureId === feature.packageFeatureId);
            featuresByPackage[feature.packageName].push({
              ...feature,
              completed: matchedFeature ? matchedFeature.completed : false
            });
          });
          // Assign the restructured data to a new property for use in the template
          this.featuresByPackage = featuresByPackage;
        })
      }

    }
  }
  someComplete(): boolean {
    return this.productfeatures.filter(f => f.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;

    // Check if featuresByPackage is defined before accessing it
    if (this.featuresByPackage) {
      // Loop through each package's features
      Object.values(this.featuresByPackage).forEach(packageFeatures => {
        packageFeatures.forEach(feature => {
          feature.completed = completed; // Set the completed property
        });
      });
    }

    // Update selectedFeatures based on the allComplete flag
    if (this.allComplete) {
      this.selectedFeatures = [...this.productfeatures]; // Select all features
    } else {
      this.selectedFeatures = []; // Clear selected features
    }
  }

  trackByFeatureId(index: number, feature: Feature): number {
    return feature.packageFeatureId; // Use a unique identifier for features
  }

  updateAllComplete(feature: any) {

    const totalFeatures = this.productfeatures.length

    this.allComplete = this.productfeatures != null && this.productfeatures.every(f => f.completed);
    // this.allComplete  = true
    if (feature.completed) {
      this.selectedFeatures.push(feature);
    } else {
      this.selectedFeatures = this.selectedFeatures.filter(f => f.packageFeatureId !== feature.packageFeatureId);
    }
    const totalselectFeatures = this.selectedFeatures.length

    if (totalFeatures == totalselectFeatures) {
      this.allComplete = true
    }
  }

  backclick() {
    setTimeout(() => {
      this.EnablesubmitClicked = false;
    }, 100)
    // this.nextpage = 0
    this.nextButtonClicked = false;
    this.isFirstNextClicked = false;
    this.isUpdateClicked = false;
    if (this.nextpage > 0) {
      this.nextpage--;
    }
  }
  // Fetching dealer details
  dealerdetails(): void {
    const token = this.token
    this.LicenseList.fetchdealerlist(token).subscribe((res: any) => {
      this.list = res.dealer_details
      this.userType = res.dealer_details[0].customerType;
      this.dealers = res.dealer_details.map((dealer: { dealerCode: any; }) => dealer.dealerCode);

      // Set the default selected dealer to the first one in the array
      if (this.dealers.length > 0) {
        this.selectedDealer = this.dealers[0];
      }
    })
  }
  // Fetching resellerslist
  resellerslist(): void {
    const token = this.token
    this.LicenseList.resellerlist(token).subscribe((res: any) => {
      this.resellers = res.resellerslist.map((dealer: { dealerCode: any; }) => dealer.dealerCode);

      // Set the default selected dealer to the first one in the array
      if (this.resellers.length > 0) {
        this.selectedResellers = this.resellers[0];
      }
    })
  }
  // Fetching customerdetails
  customerdetails() {
    const token = this.token
    this.LicenseList.fetchcustomerlist(token).subscribe((res: any) => {
      this.customers = res.customerlist.map((customer: { customerCode: any; }) => customer.customerCode);
      // Set the default selected dealer to the first one in the array
      if (this.customers.length > 0) {
        this.selectedCustomer = this.customers[0];
      }
    })
  }
  // Fetching Versionsdetails
  Versionsdetails() {
    const token = this.token
    this.LicenseList.fetchversionslist(token).subscribe((res: any) => {
      this.Versions = res.version.map((versions: { version: any; }) => versions.version);
      // Set the default selected dealer to the first one in the array
      if (this.Versions.length > 0) {
        this.selectedVersion = this.Versions[0];
      }
    })
  }
  // Fetching regiondetails
  regiondetails() {
    const token = this.token
    this.LicenseList.fetchregionlist(token).subscribe((res: any) => {
      this.regions = res.region.map((region: { regionName: any; }) => region.regionName);
      // Set the default selected dealer to the first one in the array
      if (this.regions.length > 0) {
        this.selectedregion = this.regions[0];
      }
    })
  }
  // Dropdown control dealer
  toggleDropdown_dealer(): void {
    this.showDropdown_dealer = !this.showDropdown_dealer;
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.showDropdown_customer = false;
    this.showDropdown_modules = false;
    this.showDropdown_region = false;
    this.showDropdown_reseller = false;
    this.showDropdown_Version = false;
  }
  // Dropdown control customer
  toggleDropdown_customer(): void {
    this.showDropdown_customer = !this.showDropdown_customer;
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.showDropdown_dealer = false;
    this.showDropdown_modules = false;
    this.showDropdown_region = false;
    this.showDropdown_reseller = false;
    this.showDropdown_Version = false;
  }
  // Dropdown control region
  toggleDropdown_region(): void {
    this.showDropdown_region = !this.showDropdown_region
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.showDropdown_dealer = false;
    this.showDropdown_customer = false;
    this.showDropdown_modules = false;
    this.showDropdown_reseller = false;
    this.showDropdown_Version = false;
  }
  // Dropdown control modules
  toggleDropdown_modules(): void {
    this.showDropdown_modules = !this.showDropdown_modules
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.showDropdown_dealer = false;
    this.showDropdown_customer = false;
    this.showDropdown_region = false;
    this.showDropdown_reseller = false;
    this.showDropdown_Version = false;
  }
  // Dropdown control installation
  toggleDropdown_installation(): void {
    this.showDropdown_installation = !this.showDropdown_installation
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.showDropdown_dealer = false;
    this.showDropdown_customer = false;
    this.showDropdown_region = false;
    this.showDropdown_modules = false;
    this.showDropdown_reseller = false;
    this.showDropdown_Version = false;
  }
  // Dropdown control reseller
  toggleDropdown_reseller(): void {
    this.showDropdown_reseller = !this.showDropdown_reseller
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.showDropdown_dealer = false;
    this.showDropdown_customer = false;
    this.showDropdown_region = false;
    this.showDropdown_modules = false;
    this.showDropdown_installation = false;
    this.showDropdown_Version = false;
  }
  // Dropdown control Version
  toggleDropdown_Version(): void {
    this.showDropdown_Version = !this.showDropdown_Version
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
    this.showDropdown_dealer = false;
    this.showDropdown_customer = false;
    this.showDropdown_region = false;
    this.showDropdown_modules = false;
    this.showDropdown_installation = false;
    this.showDropdown_reseller = false
  }
  // Selected dealer
  selectDealer(dealer: string): void {
    this.dealerinputvalue = 0;
    this.selectedDealer = dealer;
    const selectedDealerDetails = this.list.find((d: any) => d.dealerCode === dealer);
    // Set the userType of the selected dealer
    if (selectedDealerDetails) {
      this.userType = selectedDealerDetails.customerType;
    }
    this.showDropdown_dealer = false;
  }
  // Selected Reseller
  selectReseller(reseller: string): void {
    this.selectedResellers = reseller;
    this.showDropdown_reseller = false;
  }
  // Selected Customer 
  selectCustomer(customer: string): void {
    this.selectedCustomer = customer;
    this.showDropdown_customer = false;
  }
  // Selected Version
  selectVersion(Version: string): void {
    this.selectedVersion = Version;
    this.showDropdown_Version = false;
  }
  // Selected Region
  selectRegion(region: string): void {
    this.selectedregion = region;
    this.showDropdown_region = false;
  }
  // Selected Module
  selectModule(Recorder: string): void {
    this.selectedmodule = Recorder;
    this.showDropdown_modules = false;
    this.updateFirstNextClicked();
    this.getRecording();
  }
  // Selected Installation
  selectInstallation(install: string): void {
    this.selectedinstallation = install;
    this.showDropdown_installation = false;
  }
  // Screen Click
  handleClick(event: MouseEvent) {
    this.dropdownOpenSystem = false;
    this.dropdownOpen = false;
    this.dropdownOpenlicense = false;
    this.dropdownOpensearch = false;
    this.showDropdown_modules = false;
    if (this.dealerinputvalue == 1) {
      this.showDropdown_dealer = true;
    } else {
      this.showDropdown_dealer = false;
    }
    if (this.resellerinputvalue == 1) {
      this.showDropdown_reseller = true;
    } else {
      this.showDropdown_reseller = false;
    }
    if (this.customerinputvalue == 1) {
      this.showDropdown_customer = true;
    } else {
      this.showDropdown_customer = false;
    }
    if (this.regioninputvalue == 1) {
      this.showDropdown_region = true;
    } else {
      this.showDropdown_region = false;
    }

    this.dealerinputvalue = 0;
    this.resellerinputvalue = 0;
    this.customerinputvalue = 0;
    this.regioninputvalue = 0;
  }
  // Search dealer
  handledealerTouch(event: any) {
    this.dealerinputvalue = 1;
  }
  // Search reseller
  handleresellerTouch(event: any) {
    this.resellerinputvalue = 1;
  }
  // Search customer
  handlecustomerTouch(event: any) {
    this.customerinputvalue = 1;
  }
  // Search region
  handleregionTouch(event: any) {
    this.regioninputvalue = 1;
  }
  Macdetails() {
    const mac = this.macAddress
  }
  podetails() {
    const productName = this.productName
  }
  dateChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    this.dateValue = target.value;
  }
  machinecount(event: any) {
    const countValue = event.target.value;
    this.machineCount = countValue;
  }
  resellersdetails() {
    this.resellersListAvailable = true
  }
  onFromDateChange(date: Date) {
    // Handle changes to fromDate here
    this.fromDate = date
  }
  onToDateChange(date: Date) {
    // Handle changes to toDate here
    this.toDate = date
  }
  loadingDialogRef: MatDialogRef<LoadingSpinnerComponent> | undefined;
  submit() {
    const token = this.token;
    this.loadingDialogRef = this.popUp.open(LoadingSpinnerComponent);
    // this.popUp.open(LoadingSpinnerComponent);
    let recoderStatus
    let accountingStatus
    let resellerName = '0'
    let formattedDate = this.fromDate?.toISOString().slice(0, 19).replace('T', ' ');
    let formattedtoDate = this.toDate?.toISOString().slice(0, 19).replace('T', ' ');
    const dealerName = this.selectedDealer
    if (this.showResellersList) {
      resellerName = this.selectedResellers
    }
    const region = this.selectedregion
    const purchaseOrder = this.productName
    const system = this.selectedSystem
    const ActiveDirectory = this.activeDirectoryEnabled
    const productDate = this.dateValue
    const selectedVersion = this.selectedVersion
    const machineCount = this.machineCount
    if (this.selectedmodule == 'Recorder & Accounting') {
      recoderStatus = true;
      accountingStatus = true;
    } else if (this.selectedmodule == 'Recorder') {
      recoderStatus = true;
      accountingStatus = false;
    } else {
      recoderStatus = false;
      accountingStatus = true;
    }

    if (this.showResellersList == true) {
      // console.log("selectedResellers", this.selectedResellers);
    }
    if (this.selectedtype == 'Production') {
      this.expiryDays = 0;
    }
    // if (this.showDatePicker == false) {
    //   formattedDate = "0000-00-00 00:00:00"
    //   formattedtoDate = "0000-00-00 00:00:00"
    // }

    //Digital Recorder status
    const digital = {
      NGXValue: this.recorderValues.NGXValue,
      NortelValue: this.recorderValues.NortelValue,
      ShCTIValue: this.recorderValues.ShCTIValue
    };
    this.Digital_Recorder_status = Object.values(digital).some(value => value > 0);

    //Passive Recorder status
    const Passive_IP = {
      HPXValue: this.recorderValues.HPXValue,
      GSMValue: this.recorderValues.GSMValue,
      VOXValue: this.recorderValues.VOXValue,
      SynwayValue: this.recorderValues.SynwayValue,
      SipTrunkValue: this.recorderValues.SipTrunkValue,
      AvayaValue: this.recorderValues.AvayaValue,
      AstriskValue: this.recorderValues.AstriskValue
    }
    this.Digital_Passive_IP_status = Object.values(Passive_IP).some(value => value > 0);

    // Analog Recorder
    const Analog_Recorder = {
      Analog_ShCTI: this.recorderValues.AnalogShCTI_Value,
      Analog_Ocha: this.recorderValues.Analog_Ocha_Value
    }
    this.Digital_Analog_Recorder_status = Object.values(Analog_Recorder).some(value => value > 0);

    // E1 Recorder
    const E1_Recorder = {
      E1_ShCTI: this.recorderValues.E1ShCTI_Value,
      E1_Ocha: this.recorderValues.E1Ocha_Value
    }
    this.Digital_E1_Recorder_status = Object.values(E1_Recorder).some(value => value > 0);

    //Active IP status
    const Active_IP = {
      Active_avaya: this.recorderValues.ActiveAvaya_Value,
      Active_cisco: this.recorderValues.ActiveCisco_Value,
      Active_NEC: this.recorderValues.ActiveNEC_Value,
      Nortel: this.recorderValues.ActiveNortel_Value,
      ED137Recorder: this.recorderValues.ED137Recorder,
      ActiveBCM_Value: this.recorderValues.ActiveBCM_Value
    }
    this.Digital_Active_IP_status = Object.values(Active_IP).some(value => value > 0);

    // Setting UserId
    const Usertoken = localStorage.getItem('Token');
    let UserId
    if (Usertoken) {
      const tokenPayload = JSON.parse(atob(Usertoken.split('.')[1]));
      UserId = tokenPayload.Details.userId
    }

    const payload = {
      mac_address: this.macAddress, userId: UserId, type: this.selectedlicense, request_type: this.selectedtype, expiry_days: this.expiryDays,
      amc_status:this.isChecked, amc_startDate: formattedDate, amc_endDate: formattedtoDate, selectedCustomer: this.selectedCustomer, ActiveDirectory: ActiveDirectory,
      system: system, purchaseOrder: purchaseOrder, region: region, productDate: productDate, selectedVersion: selectedVersion,
      machineCount: machineCount, dealerName: dealerName, resellerName: resellerName, internalFeatures: this.selectedFeatures,
      products: {
        DGvox: {
          status: recoderStatus,
          SMS: this.recorderValues.SMS,
          EMC_centera: this.recorderValues.EMC,
          Screen_capture: this.recorderValues.ScreenCapture,
          AQM: this.recorderValues.AQM,
          FAX: this.recorderValues.FAX,
          seatsValue: this.recorderValues.seatsValue,
          selectedinstallation: this.recorderValues.selectedinstallation,
          //Digital Recorder
          Digital_Recorder: {
            status: this.Digital_Recorder_status,
            Digital_NGX: {
              channels: this.recorderValues.NGXValue
            },
            Digital_ShCTI: {
              channels: this.recorderValues.ShCTIValue
            },
            Digital_Nortel: {
              channels: this.recorderValues.ShCTIValue
            }
          },

          //Passive Recorder
          Passive_IP: {
            status: this.Digital_Passive_IP_status,
            passive_HPX: {
              channels: this.recorderValues.HPXValue
            },
            GSM_recorder: {
              channels: this.recorderValues.GSMValue
            },
            Vox_IP: {
              channels: this.recorderValues.VOXValue
            },
            synway_IP_recorder: {
              channels: this.recorderValues.SynwayValue
            },
            SipTrunk_recorder: {
              channels: this.recorderValues.SipTrunkValue
            },
            Avaya_ip_office: {
              channels: this.recorderValues.AvayaValue
            },
            Astrisk: {
              channels: this.recorderValues.AstriskValue
            }
          },

          // Analog Recorder
          Analog_Recorder: {
            status: this.Digital_Analog_Recorder_status,
            Analog_ShCTI: {
              channels: this.recorderValues.AnalogShCTI_Value
            },
            Analog_Ocha: {
              channels: this.recorderValues.AnalogOcha_Value
            }
          },

          // E1 Recorder
          E1_Recorder: {
            status: this.Digital_E1_Recorder_status,
            E1_ShCTI: {
              channels: this.recorderValues.E1ShCTI_Value
            },
            E1_Ocha: {
              channels: this.recorderValues.E1Ocha_Value
            }
          },
          //Active IP
          Active_IP: {
            status: this.Digital_Active_IP_status,
            Active_avaya: {
              channels: this.recorderValues.ActiveAvaya_Value
            },
            Active_cisco: {
              channels: this.recorderValues.ActiveCisco_Value
            },
            Active_NEC: {
              channels: this.recorderValues.ActiveNEC_Value
            },
            Nortel: {
              channels: this.recorderValues.ActiveNortel_Value
            },
            ED137Recorder: {
              channels: this.recorderValues.ED137Recorder
            },
            ActiveBCM_Value: {
              channels: this.recorderValues.ActiveBCM_Value
            }
          }
        },

        Speechbill: {
          status: accountingStatus,
          AvayaCM: this.accountValues.AvayaCM,
          AvayaIP: this.accountValues.AvayaIP,
          CiscoCUCM: this.accountValues.CiscoCUCM,
          CUCMExpress: this.accountValues.CUCMExpress,
          Nortel: this.accountValues.Nortel,
          Alcatel: this.accountValues.Alcatel,
          Panasonic: this.accountValues.Panasonic,
          NEC: this.accountValues.NEC,
          Siemens: this.accountValues.Siemens,
          Matrix: this.accountValues.Matrix,
          Huawei: this.accountValues.Huawei,
          Mitel: this.accountValues.Mitel,
          Microsoft: this.accountValues.Microsoft,

          Extension: {
            channels: this.accountValues.Extension
          },
          Branch: {
            channels: this.accountValues.Branch
          },
          Department: {
            channels: this.accountValues.Department
          },
        }
      }
    }

    this.LicenseList.addlicense(token, payload).subscribe((res: any) => {
      this.popUp.closeAll();
      if (res.status == true) {
        // localStorage.setItem('Token', res.Token)
        this.popUp.open(PopupComponent, {
          width: '250px',
          height: '250px',
          data: { message: res.message, buttonvalue: "OK" }
        })
        this.dialogRef.close();
        // this.router.navigateByUrl('/home')
      }
    },
    (error) => {
      if (this.loadingDialogRef) {
        this.loadingDialogRef.close();
      }
      this.EnablesubmitClicked = true;
      this.nextButtonClicked = false;
      console.log(error);
      this.popUp.open(PopupComponent, {
        width: '250px',
        height: '250px',
        data: { message: error.error.message, buttonvalue: "Cancel" }
      });
      // this.loading = false; // Stop loading on error
    })
  }
  updateButton() {
    this.isUpdateClicked = true
  }
  update() {
    // Setting UserId
    const Usertoken = localStorage.getItem('Token');
    const licenseToken = this.searchValue
    let UserId
    if (Usertoken) {
      const tokenPayload = JSON.parse(atob(Usertoken.split('.')[1]));
      UserId = tokenPayload.Details.userId
    }

    const token = this.token;
    this.popUp.open(LoadingSpinnerComponent);

    let recoderStatus
    let accountingStatus
    let formattedDate = this.fromDate?.toISOString().slice(0, 19).replace('T', ' ');
    let formattedtoDate = this.toDate?.toISOString().slice(0, 19).replace('T', ' ');
    const region = this.selectedregion
    const purchaseOrder = this.productName
    const system = this.selectedSystem
    const ActiveDirectory = this.activeDirectoryEnabled
    const productDate = this.dateValue
    const selectedVersion = this.selectedVersion
    const machineCount = this.machineCount
    let resellerName = '0'
    const dealerName = this.selectedDealer
    if (this.showResellersList) {
      resellerName = this.selectedResellers
    }

    if (this.selectedmodule == 'Recorder & Accounting') {
      recoderStatus = true;
      accountingStatus = true;
    } else if (this.selectedmodule == 'Recorder') {
      recoderStatus = true;
      accountingStatus = false;
    } else {
      recoderStatus = false;
      accountingStatus = true;
    }

    if (this.showResellersList == true) {
      // console.log("selectedResellers", this.selectedResellers);
    }
    if (this.selectedtype == 'Production') {
      this.expiryDays = 0;
    }
    // if (this.showDatePicker == false) {
    //   formattedDate = "0000-00-00 00:00:00"
    //   formattedtoDate = "0000-00-00 00:00:00"
    // }

    //Digital Recorder status
    const digital = {
      NGXValue: this.recorderValues.NGXValue,
      NortelValue: this.recorderValues.NortelValue,
      ShCTIValue: this.recorderValues.ShCTIValue
    };
    this.Digital_Recorder_status = Object.values(digital).some(value => value > 0);

    //Passive Recorder status
    const Passive_IP = {
      HPXValue: this.recorderValues.HPXValue,
      GSMValue: this.recorderValues.GSMValue,
      VOXValue: this.recorderValues.VOXValue,
      SynwayValue: this.recorderValues.SynwayValue,
      SipTrunkValue: this.recorderValues.SipTrunkValue,
      AvayaValue: this.recorderValues.AvayaValue,
      AstriskValue: this.recorderValues.AstriskValue
    }
    this.Digital_Passive_IP_status = Object.values(Passive_IP).some(value => value > 0);

    // Analog Recorder
    const Analog_Recorder = {
      Analog_ShCTI: this.recorderValues.AnalogShCTI_Value,
      Analog_Ocha: this.recorderValues.Analog_Ocha_Value
    }
    this.Digital_Analog_Recorder_status = Object.values(Analog_Recorder).some(value => value > 0);

    // E1 Recorder
    const E1_Recorder = {
      E1_ShCTI: this.recorderValues.E1ShCTI_Value,
      E1_Ocha: this.recorderValues.E1Ocha_Value
    }
    this.Digital_E1_Recorder_status = Object.values(E1_Recorder).some(value => value > 0);

    //Active IP status
    const Active_IP = {
      Active_avaya: this.recorderValues.ActiveAvaya_Value,
      Active_cisco: this.recorderValues.ActiveCisco_Value,
      Active_NEC: this.recorderValues.ActiveNEC_Value,
      Nortel: this.recorderValues.ActiveNortel_Value,
      ED137Recorder: this.recorderValues.ED137Recorder,
      ActiveBCM_Value: this.recorderValues.ActiveBCM_Value
    }
    this.Digital_Active_IP_status = Object.values(Active_IP).some(value => value > 0);

    const payload = {
      mac_address: this.macAddress, userId: UserId, type: this.selectedlicense, request_type: this.selectedtype, expiry_days: this.expiryDays,
      amc_startDate: formattedDate, amc_endDate: formattedtoDate, selectedCustomer: this.selectedCustomer, ActiveDirectory: ActiveDirectory,
      system: system, purchaseOrder: purchaseOrder, region: region, productDate: productDate, selectedVersion: selectedVersion,
      machineCount: machineCount, dealerName: dealerName, resellerName: resellerName, token: licenseToken, internalFeatures: this.selectedFeatures,
      products: {
        DGvox: {
          status: recoderStatus,
          SMS: this.recorderValues.SMS,
          EMC_centera: this.recorderValues.EMC,
          Screen_capture: this.recorderValues.ScreenCapture,
          AQM: this.recorderValues.AQM,
          FAX: this.recorderValues.FAX,
          seatsValue: this.recorderValues.seatsValue,
          selectedinstallation: this.recorderValues.selectedinstallation,
          //Digital Recorder
          Digital_Recorder: {
            status: this.Digital_Recorder_status,
            Digital_NGX: {
              channels: this.recorderValues.NGXValue
            },
            Digital_ShCTI: {
              channels: this.recorderValues.ShCTIValue
            },
            Digital_Nortel: {
              channels: this.recorderValues.ShCTIValue
            }
          },

          //Passive Recorder
          Passive_IP: {
            status: this.Digital_Passive_IP_status,
            passive_HPX: {
              channels: this.recorderValues.HPXValue
            },
            GSM_recorder: {
              channels: this.recorderValues.GSMValue
            },
            Vox_IP: {
              channels: this.recorderValues.VOXValue
            },
            synway_IP_recorder: {
              channels: this.recorderValues.SynwayValue
            },
            SipTrunk_recorder: {
              channels: this.recorderValues.SipTrunkValue
            },
            Avaya_ip_office: {
              channels: this.recorderValues.AvayaValue
            },
            Astrisk: {
              channels: this.recorderValues.AstriskValue
            }
          },

          // Analog Recorder
          Analog_Recorder: {
            status: this.Digital_Analog_Recorder_status,
            Analog_ShCTI: {
              channels: this.recorderValues.AnalogShCTI_Value
            },
            Analog_Ocha: {
              channels: this.recorderValues.AnalogOcha_Value
            }
          },

          // E1 Recorder
          E1_Recorder: {
            status: this.Digital_E1_Recorder_status,
            E1_ShCTI: {
              channels: this.recorderValues.E1ShCTI_Value
            },
            E1_Ocha: {
              channels: this.recorderValues.E1Ocha_Value
            }
          },
          //Active IP
          Active_IP: {
            status: this.Digital_Active_IP_status,
            Active_avaya: {
              channels: this.recorderValues.ActiveAvaya_Value
            },
            Active_cisco: {
              channels: this.recorderValues.ActiveCisco_Value
            },
            Active_NEC: {
              channels: this.recorderValues.ActiveNEC_Value
            },
            Nortel: {
              channels: this.recorderValues.ActiveNortel_Value
            },
            ED137Recorder: {
              channels: this.recorderValues.ED137Recorder
            },
            ActiveBCM_Value: {
              channels: this.recorderValues.ActiveBCM_Value
            }
          }
        },

        Speechbill: {
          status: accountingStatus,
          AvayaCM: this.accountValues.AvayaCM,
          AvayaIP: this.accountValues.AvayaIP,
          CiscoCUCM: this.accountValues.CiscoCUCM,
          CUCMExpress: this.accountValues.CUCMExpress,
          Nortel: this.accountValues.Nortel,
          Alcatel: this.accountValues.Alcatel,
          Panasonic: this.accountValues.Panasonic,
          NEC: this.accountValues.NEC,
          Siemens: this.accountValues.Siemens,
          Matrix: this.accountValues.Matrix,
          Huawei: this.accountValues.Huawei,
          Mitel: this.accountValues.Mitel,
          Microsoft: this.accountValues.Microsoft,

          Extension: {
            channels: this.accountValues.Extension
          },
          Branch: {
            channels: this.accountValues.Branch
          },
          Department: {
            channels: this.accountValues.Department
          },
        }
      }
    }
    this.LicenseList.updatelicense(token, payload).subscribe((res: any) => {
      this.popUp.closeAll();
      if (res.status == true) {
        // localStorage.setItem('Token', res.Token)
        this.popUp.open(PopupComponent, {
          width: '250px',
          height: '250px',
          data: { message: res.message, buttonvalue: "OK" }
        })
        this.dialogRef.close();
        // this.router.navigateByUrl('/home')
      }
    })
  }
  updateFirstNextClicked() {
    if (
      this.macAddress &&
      this.selectedDealer &&
      this.selectedCustomer &&
      this.productName &&
      this.dateValue &&
      this.selectedregion &&
      this.selectedmodule &&
      this.selectedVersion &&
      this.machineCount
    ) {
      if (this.selectedmodule == 'Recorder & Accounting') {
        if (this.recorderValues.seatsValue && this.accountValues.Extension) {
          this.EnablesubmitClicked = false;
        }
      } else if (this.selectedmodule == 'Recorder') {
        if (this.recorderValues.seatsValue) {
          this.EnablesubmitClicked = false;
        }
      } else if (this.selectedmodule == 'Accounting') {
        if (this.accountValues.Extension) {
          this.EnablesubmitClicked = false;
        }
      }
    } else {
      this.EnablesubmitClicked = true;
    }
  }

  filterDealers() {
    if (this.searchValue_dealer.trim() === '') {
      this.dealerdetails();
    } else {
      this.dealers = this.dealers.slice().sort().filter(dealer => dealer.toLowerCase().startsWith(this.searchValue_dealer));
      if (this.dealers.length === 0) {
        this.dealers.push('No data found');
      }
    }
  }
  filterReseller() {
    if (this.searchValue_reseller.trim() === '') {
      this.resellerslist();
    } else {
      this.resellers = this.resellers.slice().sort().filter(reseller => reseller.toLowerCase().startsWith(this.searchValue_reseller));
      if (this.resellers.length === 0) {
        this.resellers.push('No data found');
      }
    }
  }

  filterCustomer() {
    if (this.searchValue_customer.trim() === '') {
      this.customerdetails();
    } else {
      this.customers = this.customers.slice().sort().filter(customer => customer.toLowerCase().startsWith(this.searchValue_customer));
      if (this.customers.length === 0) {
        this.customers.push('No data found');
      }
    }
  }

  filterRegion() {
    if (this.searchValue_region.trim() === '') {
      this.regiondetails();
    } else {
      this.regions = this.regions.slice().sort().filter(region => region.toLowerCase().startsWith(this.searchValue_region));
      if (this.regions.length === 0) {
        this.regions.push('No data found');
      }
    }
  }
}
