import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialog,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { LicenseListService } from '../../service/licenseDetails/license-list.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { RegionUpdatePopupComponent } from '../region-update-popup/region-update-popup.component';
import {MatSelectModule} from '@angular/material/select';

// Define an interface to describe the structure of each region object
interface Region {
  regionId: string;
  regionName: string;
}
interface FlagRegion{
  id: string;
  name: string;
}
@Component({
  selector: 'app-add-region',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule,
    MatIconModule,HttpClientModule, FormsModule,LoadingSpinnerComponent,MatSelectModule],
  providers:[LicenseListService],
  templateUrl: './add-region.component.html',
  styleUrl: './add-region.component.css',
 
})


export class AddRegionComponent {
  token: string | null;
  regions: Region[] = [];
  selectedregion: string | undefined;
  message: any = ''
  heading: any = ''
  buttonvalue: any
  addNewfieldStatus: boolean = false;
  flagregions: FlagRegion[] = [];
  selectedFlagRegion: string = '';
  filteredFlagRegions: FlagRegion[] = [];

  searchFilter : any
  filteredData : any

  constructor(private LicenseList: LicenseListService, @Inject(MAT_DIALOG_DATA) public datas: any,
  public dialogRef: MatDialogRef<AddRegionComponent>, private popUp: MatDialog) 
  {
    this.token = localStorage.getItem('Token');
  }

  ngOnInit() {
    this.regiondetails();
    this.flagRegions();
  }

  filter() {
    this.filteredData = this.flagregions.filter((data: any) => {
      return data.name.toLowerCase().includes(this.searchFilter.toLowerCase())
    })
  }

  filterOptions(value: any) {
    if (value !== null && value !== undefined) {
      const trimmedValue = value.trim();
      if (trimmedValue === '') {
        this.filteredFlagRegions = this.flagregions; // Show all regions when input is empty
      } else {
        // Filter regions based on partial input
        this.filteredFlagRegions = this.flagregions.filter(region =>
          region.name.toLowerCase().includes(trimmedValue.toLowerCase())
        );
      }
    }
  }
  AddRegion(selectedFlagRegion:any){
    // this.popUp.open(LoadingSpinnerComponent);
    const token = this.token
    // AddRegion
    this.LicenseList.AddRegion(token,selectedFlagRegion).subscribe((res: any) => {
      if (res.status == true) {
        this.addNewfieldStatus = false
        this.popUp.open(RegionUpdatePopupComponent, {
          width: '300px',
          height: '210px',
          data: { message: res.message, buttonvalue: "OK" }
        })
        this.regiondetails();
      }
    }, error => {
      // this.popUp.closeAll();
      console.log("error", error);
      this.popUp.open(RegionUpdatePopupComponent, {
        width: '300px',
        height: '210px',
        data: { message: error.error.message, buttonvalue: "Cancel" }
      })
      this.regiondetails();
    })
  }
  new_region(){
   this.addNewfieldStatus = true
  }
  closeAll() {
    throw new Error('Method not implemented.');
  }
  closeDateSelector() {
    this.dialogRef.close();
  }

  regiondetails() {
    const token = this.token
    this.LicenseList.fetchregionlist(token).subscribe((res: any) => {
      this.regions = res.region.map((region: { regionId: any, regionName: any }) => ({
        regionId: region.regionId,
        regionName: region.regionName
      }));  
    })
  }

  flagRegions(){
    const token = this.token
    this.LicenseList.flagregion(token).subscribe((res: any) => {   
      this.flagregions = res.flagregion.map((flagregion: { id: any, name: any }) => ({
        id: flagregion.id,
        name: flagregion.name
      }));  
      this.filteredFlagRegions = this.flagregions; 
      this.filteredData = this.flagregions; 
      
    })
  }

  deleteRegion(regionId:any){
    const token = this.token
    this.LicenseList.deleteregion(token,regionId).subscribe((res: any) => {
      if (res.status == true) {
        this.popUp.open(RegionUpdatePopupComponent, {
          width: '300px',
          height: '210px',
          data: { message: res.message, buttonvalue: "OK" }
        })
        this.regiondetails();
      }
    }, error => {
      // this.popUp.closeAll();
      console.log("error", error);
      this.popUp.open(RegionUpdatePopupComponent, {
        width: '300px',
        height: '210px',
        data: { message: error.error.message, buttonvalue: "Cancel" }
      })
      this.regiondetails();
    })
  }
}
