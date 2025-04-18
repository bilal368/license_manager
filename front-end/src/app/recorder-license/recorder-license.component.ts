import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountingLicneseComponent } from '../accounting-licnese/accounting-licnese.component';
import { LicenseListService } from '../../service/licenseDetails/license-list.service';

@Component({
  selector: 'app-recorder-license',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, AccountingLicneseComponent],
  templateUrl: './recorder-license.component.html',
  styleUrl: './recorder-license.component.css'
})


export class RecorderLicenseComponent {

  constructor(private licenseService: LicenseListService) { }

  @Input() fromaddLicense: any | undefined;
  @Input() backaddLicense: any | undefined;
  selectedinstallation: string = 'Stand Alone';
  showDropdown_installation: boolean = false;
  SMS: boolean = false;
  EMC: boolean = false;
  Screen: boolean = false;
  AQM: boolean = false;
  FAX: boolean = false;
  seatsValue: number = 0;
  NGXValue: number = 0;
  ShCTIValue: number = 0;
  NortelValue: number = 0;
  HPXValue: number = 0;
  GSMValue: number = 0;
  VOXValue: number = 0;
  SynwayValue: number = 0;
  SipTrunkValue: number = 0;
  AvayaValue: number = 0;
  AstriskValue: number = 0;
  AnalogShCTI_Value: number = 0;
  AnalogOcha_Value: number = 0;
  E1ShCTI_Value: number = 0;
  E1Ocha_Value: number = 0;
  ActiveAvaya_Value: number = 0;
  ActiveCisco_Value: number = 0;
  ActiveNortel_Value: number = 0;
  ED137Recorder: number = 0;
  ActiveNEC_Value: number = 0;
  ActiveBCM_Value: number = 0;
  isSMSChecked: boolean = false;
  isEMCChecked: boolean = false;
  isScreenChecked: boolean = false;
  isAQMChecked: boolean = false;
  isFAXChecked: boolean = false;
  inputValue: string = "accounding";
  AccountFeatures: any;
  backaccounding: any;


  ngOnInit(): void {
    this.AccountFeatures = {
      Accounting: this.fromaddLicense[1].Accounting
    }
    this.backaccounding = {
      backaccounding: this.fromaddLicense[3].backaccounding
    } 
    if (this.fromaddLicense[2].backrecording.recorderValue != '') {
      this.selectedinstallation = this.fromaddLicense[2].backrecording.selectedinstallation
      this.seatsValue = this.fromaddLicense[2].backrecording.seatsValue
      this.NGXValue = this.fromaddLicense[2].backrecording.NGXValue
      this.ShCTIValue = this.fromaddLicense[2].backrecording.ShCTIValue
      this.NortelValue = this.fromaddLicense[2].backrecording.NortelValue
      this.HPXValue = this.fromaddLicense[2].backrecording.HPXValue
      this.GSMValue = this.fromaddLicense[2].backrecording.GSMValue
      this.VOXValue = this.fromaddLicense[2].backrecording.VOXValue
      this.SynwayValue = this.fromaddLicense[2].backrecording.SynwayValue
      this.SipTrunkValue = this.fromaddLicense[2].backrecording.SipTrunkValue
      this.AvayaValue = this.fromaddLicense[2].backrecording.AvayaValue
      this.AstriskValue = this.fromaddLicense[2].backrecording.AstriskValue
      this.AnalogShCTI_Value = this.fromaddLicense[2].backrecording.AnalogShCTI_Value
      this.AnalogOcha_Value = this.fromaddLicense[2].backrecording.AnalogOcha_Value
      this.E1ShCTI_Value = this.fromaddLicense[2].backrecording.E1ShCTI_Value
      this.E1Ocha_Value = this.fromaddLicense[2].backrecording.E1Ocha_Value
      this.ActiveAvaya_Value = this.fromaddLicense[2].backrecording.ActiveAvaya_Value
      this.ActiveCisco_Value = this.fromaddLicense[2].backrecording.ActiveCisco_Value
      this.ActiveNortel_Value = this.fromaddLicense[2].backrecording.ActiveNortel_Value
      this.ED137Recorder = this.fromaddLicense[2].backrecording.ED137Recorder
      this.ActiveNEC_Value = this.fromaddLicense[2].backrecording.ActiveNEC_Value
      this.ActiveBCM_Value = this.fromaddLicense[2].backrecording.ActiveBCM_Value
      this.SMS = this.fromaddLicense[2].backrecording.SMS
      this.isSMSChecked = this.fromaddLicense[2].backrecording.SMS
      this.isEMCChecked = this.fromaddLicense[2].backrecording.EMC
      this.EMC = this.fromaddLicense[2].backrecording.EMC
      this.isScreenChecked = this.fromaddLicense[2].backrecording.ScreenCapture
      this.Screen = this.fromaddLicense[2].backrecording.ScreenCapture
      this.isFAXChecked = this.fromaddLicense[2].backrecording.FAX
      this.FAX = this.fromaddLicense[2].backrecording.FAX
      this.isAQMChecked = this.fromaddLicense[2].backrecording.AQM
      this.AQM = this.fromaddLicense[2].backrecording.AQM 
    }
    this.updatevalues(this.fromaddLicense)
  }
  updatevalues(fromaddLicense: any) {
    if (fromaddLicense[0] == 'Recorder & Accounting') {
      //Recording & Accounting feature values
      this.selectedinstallation = fromaddLicense[1].recorder.Installation
      this.seatsValue = fromaddLicense[1].recorder.SeatsValue

      this.isSMSChecked = fromaddLicense[1].recorder.SMS
      this.SMS = fromaddLicense[1].recorder.SMS

      this.EMC = fromaddLicense[1].recorder.EMC_centera;
      this.isEMCChecked = fromaddLicense[1].recorder.EMC_centera;

      this.Screen = fromaddLicense[1].recorder.Screen_capture;
      this.isScreenChecked = fromaddLicense[1].recorder.Screen_capture;

      this.isAQMChecked = fromaddLicense[1].recorder.AQM
      this.AQM = fromaddLicense[1].recorder.AQM

      this.isFAXChecked = fromaddLicense[1].recorder.FAX
      this.FAX = fromaddLicense[1].recorder.FAX

      if (fromaddLicense[1].recorder.Active_IP.status) {
        this.ActiveBCM_Value = fromaddLicense[1].recorder.Active_IP.ActiveBCM_Value.channels
        this.ActiveNEC_Value = fromaddLicense[1].recorder.Active_IP.Active_NEC.channels
        this.ActiveAvaya_Value = fromaddLicense[1].recorder.Active_IP.Active_avaya.channels
        this.ActiveCisco_Value = fromaddLicense[1].recorder.Active_IP.Active_cisco.channels
        this.ED137Recorder = fromaddLicense[1].recorder.Active_IP.ED137Recorder.channels
        this.ActiveNortel_Value = fromaddLicense[1].recorder.Active_IP.Nortel.channels
      }
      if (fromaddLicense[1].recorder.Digital_Recorder.status) {
        this.NGXValue = fromaddLicense[1].recorder.Digital_Recorder.Digital_NGX.channels
        this.NortelValue = fromaddLicense[1].recorder.Digital_Recorder.Digital_Nortel.channels
        this.ShCTIValue = fromaddLicense[1].recorder.Digital_Recorder.Digital_ShCTI.channels
      }
      if (fromaddLicense[1].recorder.Passive_IP.status) {
        this.AstriskValue = fromaddLicense[1].recorder.Passive_IP.Astrisk.channels
        this.AvayaValue = fromaddLicense[1].recorder.Passive_IP.Avaya_ip_office.channels
        this.GSMValue = fromaddLicense[1].recorder.Passive_IP.GSM_recorder.channels
        this.SipTrunkValue = fromaddLicense[1].recorder.Passive_IP.SipTrunk_recorder.channels
        this.VOXValue = fromaddLicense[1].recorder.Passive_IP.Vox_IP.channels
        this.HPXValue = fromaddLicense[1].recorder.Passive_IP.passive_HPX.channels
        this.SynwayValue = fromaddLicense[1].recorder.Passive_IP.synway_IP_recorder.channels
      }
      if (fromaddLicense[1].recorder.E1_Recorder.status) {
        this.E1Ocha_Value = fromaddLicense[1].recorder.E1_Recorder.E1_Ocha.channels
        this.E1ShCTI_Value = fromaddLicense[1].recorder.E1_Recorder.E1_ShCTI.channels
      }
      if (fromaddLicense[1].recorder.Analog_Recorder.status) {
        this.AnalogOcha_Value = fromaddLicense[1].recorder.Analog_Recorder.Analog_Ocha.channels
        this.AnalogShCTI_Value = fromaddLicense[1].recorder.Analog_Recorder.Analog_ShCTI.channels
      }
    } else if (fromaddLicense[0] == 'Recorder') {

      //Recording fature values
      this.selectedinstallation = fromaddLicense[1].recorder.Installation
      this.seatsValue = fromaddLicense[1].recorder.SeatsValue

      this.isSMSChecked = fromaddLicense[1].recorder.SMS
      this.SMS = fromaddLicense[1].recorder.SMS

      this.EMC = fromaddLicense[1].recorder.EMC_centera;
      this.isEMCChecked = fromaddLicense[1].recorder.EMC_centera;

      this.Screen = fromaddLicense[1].recorder.Screen_capture;
      this.isScreenChecked = fromaddLicense[1].recorder.Screen_capture;

      this.isAQMChecked = fromaddLicense[1].recorder.AQM
      this.AQM = fromaddLicense[1].recorder.AQM

      this.isFAXChecked = fromaddLicense[1].recorder.FAX
      this.FAX = fromaddLicense[1].recorder.FAX

      if (fromaddLicense[1].recorder.Active_IP.status) {
        this.ActiveBCM_Value = fromaddLicense[1].recorder.Active_IP.ActiveBCM_Value.channels
        this.ActiveNEC_Value = fromaddLicense[1].recorder.Active_IP.Active_NEC.channels
        this.ActiveAvaya_Value = fromaddLicense[1].recorder.Active_IP.Active_avaya.channels
        this.ActiveCisco_Value = fromaddLicense[1].recorder.Active_IP.Active_cisco.channels
        this.ED137Recorder = fromaddLicense[1].recorder.Active_IP.ED137Recorder.channels
        this.ActiveNortel_Value = fromaddLicense[1].recorder.Active_IP.Nortel.channels
      }
      if (fromaddLicense[1].recorder.Digital_Recorder.status) {
        this.NGXValue = fromaddLicense[1].recorder.Digital_Recorder.Digital_NGX.channels
        this.NortelValue = fromaddLicense[1].recorder.Digital_Recorder.Digital_Nortel.channels
        this.ShCTIValue = fromaddLicense[1].recorder.Digital_Recorder.Digital_ShCTI.channels
      }
      if (fromaddLicense[1].recorder.Passive_IP.status) {
        this.AstriskValue = fromaddLicense[1].recorder.Passive_IP.Astrisk.channels
        this.AvayaValue = fromaddLicense[1].recorder.Passive_IP.Avaya_ip_office.channels
        this.GSMValue = fromaddLicense[1].recorder.Passive_IP.GSM_recorder.channels
        this.SipTrunkValue = fromaddLicense[1].recorder.Passive_IP.SipTrunk_recorder.channels
        this.VOXValue = fromaddLicense[1].recorder.Passive_IP.Vox_IP.channels
        this.HPXValue = fromaddLicense[1].recorder.Passive_IP.passive_HPX.channels
        this.SynwayValue = fromaddLicense[1].recorder.Passive_IP.synway_IP_recorder.channels
      }
      if (fromaddLicense[1].recorder.E1_Recorder.status) {
        this.E1Ocha_Value = fromaddLicense[1].recorder.E1_Recorder.E1_Ocha.channels
        this.E1ShCTI_Value = fromaddLicense[1].recorder.E1_Recorder.E1_ShCTI.channels
      }
      if (fromaddLicense[1].recorder.Analog_Recorder.status) {
        this.AnalogOcha_Value = fromaddLicense[1].recorder.Analog_Recorder.Analog_Ocha.channels
        this.AnalogShCTI_Value = fromaddLicense[1].recorder.Analog_Recorder.Analog_ShCTI.channels
      }
      this.recorder_values();
    }
  }
  toggleDropdown_installation(): void {
    this.showDropdown_installation = !this.showDropdown_installation
    if (event) {
      event.stopPropagation(); // Stop click event propagation
    }
  }
  selectInstallation(install: string): void {
    this.selectedinstallation = install;
    this.showDropdown_installation = false;
    this.recorder_values();
  }
  handleClick(event: MouseEvent) {
    this.showDropdown_installation = false;
  }

  recorder_values() {
    const data = {
      seatsValue: this.seatsValue, selectedinstallation: this.selectedinstallation, NGXValue: this.NGXValue,
      ShCTIValue: this.ShCTIValue, NortelValue: this.NortelValue, HPXValue: this.HPXValue, GSMValue: this.GSMValue, VOXValue: this.VOXValue,
      SynwayValue: this.SynwayValue, SipTrunkValue: this.SipTrunkValue, AvayaValue: this.AvayaValue, AstriskValue: this.AstriskValue,
      AnalogShCTI_Value: this.AnalogShCTI_Value, AnalogOcha_Value: this.AnalogOcha_Value, E1ShCTI_Value: this.E1ShCTI_Value, E1Ocha_Value: this.E1Ocha_Value,
      ActiveAvaya_Value: this.ActiveAvaya_Value, ActiveCisco_Value: this.ActiveCisco_Value, ActiveNortel_Value: this.ActiveNortel_Value, ED137Recorder: this.ED137Recorder, ActiveNEC_Value: this.ActiveNEC_Value,
      ActiveBCM_Value: this.ActiveBCM_Value, SMS: this.SMS, EMC: this.EMC, ScreenCapture: this.Screen, AQM: this.AQM, FAX: this.FAX
    }
    this.licenseService.getSetValue(data)
  }
  SMS_status() {
    if (this.isSMSChecked) {
      this.SMS = true
      this.recorder_values();
    } else {
      this.SMS = false
      this.recorder_values();
    }
  }

  EMC_status() {
    if (this.isEMCChecked) {
      this.EMC = true
      this.recorder_values();
    } else {
      this.EMC = false
      this.recorder_values();
    }
  }
  Screen_status() {
    if (this.isScreenChecked) {
      this.Screen = true
      this.recorder_values();
    } else {
      this.Screen = false
      this.recorder_values();
    }
  }
  AQM_status() {
    if (this.isAQMChecked) {
      this.AQM = true
      this.recorder_values();
    } else {
      this.AQM = false
      this.recorder_values();
    }
  }
  FAX_status() {
    if (this.isFAXChecked) {
      this.FAX = true
      this.recorder_values();
    } else {
      this.FAX = false
      this.recorder_values();
    }
  }

}
