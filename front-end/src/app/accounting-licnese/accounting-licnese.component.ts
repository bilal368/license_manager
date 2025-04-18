import { Component, Input } from '@angular/core';
import { LicenseListService } from '../../service/licenseDetails/license-list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accounting-licnese',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './accounting-licnese.component.html',
  styleUrl: './accounting-licnese.component.css'
})
export class AccountingLicneseComponent {
  @Input()accounting_data : any; 
  Extension_Value: number = 0;
  Branch_Value: number = 0;
  Department_Value: number = 0;
  isAvayaCMChecked: boolean = false;
  AvayaCM: boolean = false;
  isAvayaIPChecked: boolean = false;
  AvayaIP: boolean = false;
  isCUCMChecked: boolean = false;
  CiscoCUCM: boolean = false;
  isCUCMExpressChecked: boolean = false;
  CUCMExpress: boolean = false;
  isNortelChecked: boolean = false;
  Nortel: boolean = false;
  isAlcatelChecked: boolean = false;
  Alcatel: boolean = false;
  isPanasonicChecked: boolean = false;
  Panasonic: boolean = false;
  isNECChecked: boolean = false;
  NEC: boolean = false;
  isSiemensChecked: boolean = false;
  Siemens: boolean = false;
  isMatrixChecked: boolean = false;
  Matrix: boolean = false;
  isHuaweiChecked: boolean = false;
  Huawei: boolean = false;
  isMitelChecked: boolean = false;
  Mitel: boolean = false;
  isMicrosoftChecked: boolean = false;
  Microsoft: boolean = false;

  constructor(private licenseService: LicenseListService){}

  ngOnInit(): void {    
    this.updatevalues(this.accounting_data[1].Accounting)
    if (this.accounting_data[2].backaccounding.accountValue != '') {
      if (this.accounting_data[2].backaccounding.recorderValue != '') {
        this.Extension_Value = this.accounting_data[2].backaccounding.Extension
        this.Branch_Value = this.accounting_data[2].backaccounding.Branch
        this.Department_Value = this.accounting_data[2].backaccounding.Department
        this.isAvayaCMChecked = this.accounting_data[2].backaccounding.AvayaCM
        this.AvayaCM = this.accounting_data[2].backaccounding.AvayaCM
        this.isAvayaIPChecked = this.accounting_data[2].backaccounding.AvayaIP
        this.AvayaIP = this.accounting_data[2].backaccounding.AvayaIP
        this.isCUCMChecked = this.accounting_data[2].backaccounding.CiscoCUCM
        this.CiscoCUCM = this.accounting_data[2].backaccounding.CiscoCUCM
        this.isCUCMExpressChecked = this.accounting_data[2].backaccounding.CUCMExpress
        this.CUCMExpress = this.accounting_data[2].backaccounding.CUCMExpress
        this.isNortelChecked = this.accounting_data[2].backaccounding.Nortel
        this.Nortel = this.accounting_data[2].backaccounding.Nortel
        this.isAlcatelChecked = this.accounting_data[2].backaccounding.Alcatel
        this.Alcatel = this.accounting_data[2].backaccounding.Alcatel
        this.isPanasonicChecked = this.accounting_data[2].backaccounding.Panasonic
        this.Panasonic = this.accounting_data[2].backaccounding.Panasonic
        this.isNECChecked = this.accounting_data[2].backaccounding.NEC
        this.NEC = this.accounting_data[2].backaccounding.NEC
        this.isSiemensChecked = this.accounting_data[2].backaccounding.Siemens
        this.Siemens = this.accounting_data[2].backaccounding.Siemens
        this.isMatrixChecked = this.accounting_data[2].backaccounding.Matrix
        this.Matrix = this.accounting_data[2].backaccounding.Matrix
        this.isHuaweiChecked = this.accounting_data[2].backaccounding.Huawei
        this.Huawei = this.accounting_data[2].backaccounding.Huawei
        this.isMitelChecked = this.accounting_data[2].backaccounding.Mitel
        this.Mitel = this.accounting_data[2].backaccounding.Mitel
        this.isMicrosoftChecked = this.accounting_data[2].backaccounding.Microsoft
        this.Microsoft = this.accounting_data[2].backaccounding.Microsoft
     
      }
    }
  }
  updatevalues(accountFeatures: any){
    if (accountFeatures != undefined) {
      if (accountFeatures.Speechbill.status) {
        this.Extension_Value = accountFeatures.Speechbill.Extension.channels
        this.Branch_Value = accountFeatures.Speechbill.Branch.channels
        this.Department_Value = accountFeatures.Speechbill.Department.channels
        this.isAvayaCMChecked = accountFeatures.Speechbill.AvayaCM
        this.AvayaCM = accountFeatures.Speechbill.AvayaCM
        this.isAvayaIPChecked = accountFeatures.Speechbill.AvayaIP
        this.AvayaIP = accountFeatures.Speechbill.AvayaIP
        this.isCUCMChecked = accountFeatures.Speechbill.CiscoCUCM
        this.CiscoCUCM = accountFeatures.Speechbill.CiscoCUCM
        this.isCUCMExpressChecked = accountFeatures.Speechbill.CUCMExpress
        this.CUCMExpress = accountFeatures.Speechbill.CUCMExpress
        this.isNortelChecked = accountFeatures.Speechbill.Nortel
        this.Nortel = accountFeatures.Speechbill.Nortel
        this.isAlcatelChecked = accountFeatures.Speechbill.Alcatel
        this.Alcatel = accountFeatures.Speechbill.Alcatel
        this.isPanasonicChecked = accountFeatures.Speechbill.Panasonic
        this.Panasonic = accountFeatures.Speechbill.Panasonic
        this.isNECChecked = accountFeatures.Speechbill.NEC
        this.NEC = accountFeatures.Speechbill.NEC
        this.isSiemensChecked = accountFeatures.Speechbill.Siemens
        this.Siemens = accountFeatures.Speechbill.Siemens
        this.isMatrixChecked = accountFeatures.Speechbill.Matrix
        this.Matrix = accountFeatures.Speechbill.Matrix
        this.isHuaweiChecked = accountFeatures.Speechbill.Huawei
        this.Huawei = accountFeatures.Speechbill.Huawei
        this.isMitelChecked = accountFeatures.Speechbill.Mitel
        this.Mitel = accountFeatures.Speechbill.Mitel
        this.isMicrosoftChecked = accountFeatures.Speechbill.Microsoft
        this.Microsoft = accountFeatures.Speechbill.Microsoft  
        this.account_values();    
      }
    }   
  }

  AvayaCM_status(){
    if (this.isAvayaCMChecked) {
      this.AvayaCM = true
      this.account_values();
    } else {
      this.AvayaCM = false
      this.account_values();
    }
  }
  AvayaIP_status(){
    if (this.isAvayaIPChecked) {
      this.AvayaIP = true
      this.account_values();
    } else {
      this.AvayaIP = false
      this.account_values();
    }
  }
  CUCM_status(){
    if (this.isCUCMChecked) {
      this.CiscoCUCM = true
      this.account_values();
    } else {
      this.CiscoCUCM = false
      this.account_values();
    }
  }
  CUCMExpress_status(){
    if (this.isCUCMExpressChecked) {
      this.CUCMExpress = true
      this.account_values();
    } else {
      this.CUCMExpress = false
      this.account_values();
    }
  }
  Nortel_status(){
    if (this.isNortelChecked) {
      this.Nortel = true
      this.account_values();
    } else {
      this.Nortel = false
      this.account_values();
    }
  }
  Alcatel_status(){
    if (this.isAlcatelChecked) {
      this.Alcatel = true
      this.account_values();
    } else {
      this.Alcatel = false
      this.account_values();
    }
  }
  Panasonic_status(){
    if (this.isPanasonicChecked) {
      this.Panasonic = true
      this.account_values();
    } else {
      this.Panasonic = false
      this.account_values();
    }
  }
  NEC_status(){
    if (this.isNECChecked) {
      this.NEC = true
      this.account_values();
    } else {
      this.NEC = false
      this.account_values();
    }
  }
  Siemens_status(){
    if (this.isSiemensChecked) {
      this.Siemens = true
      this.account_values();
    } else {
      this.Siemens = false
      this.account_values();
    }
  }
  Matrix_status(){
    if (this.isMatrixChecked) {
      this.Matrix = true
      this.account_values();
    } else {
      this.Matrix = false
      this.account_values();
    }
  }
  Huawei_status(){
    if (this.isHuaweiChecked) {
      this.Huawei = true
      this.account_values();
    } else {
      this.Huawei = false
      this.account_values();
    }
  }
  Mitel_status(){
    if (this.isMitelChecked) {
      this.Mitel = true
      this.account_values();
    } else {
      this.Mitel = false
      this.account_values();
    }
  }
  Microsoft_status(){
    if (this.isMicrosoftChecked) {
      this.Microsoft = true
      this.account_values();
    } else {
      this.Microsoft = false
      this.account_values();
    }
  }
  account_values(){
    const data = { Extension:this.Extension_Value,Branch:this.Branch_Value,Department:this.Department_Value,
      AvayaCM:this.AvayaCM,AvayaIP:this.AvayaIP,CiscoCUCM:this.CiscoCUCM,CUCMExpress:this.CUCMExpress,Nortel:this.Nortel,
      Alcatel:this.Alcatel,Panasonic:this.Panasonic,NEC:this.NEC,Siemens:this.Siemens,Matrix:this.Matrix,
      Huawei:this.Huawei,Mitel:this.Mitel,Microsoft:this.Microsoft
    }
    this.licenseService.accountgetSetValue(data)
  }
}
