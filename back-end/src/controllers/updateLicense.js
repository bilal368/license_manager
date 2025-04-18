const CryptoJS = require('crypto-js');
require('../config/env')
const apiSecret = process.env.AUTHORIZATION_USER
const { updateLicense } = require('../models/updateLicense')
const { JwtToken } = require('../utils/jwttoken')
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Updating License
exports.updateLicense = async (req, res) => {
    try {
        logger.info('Executing UpdateLicense API')
        const dealerName = req.body.dealerName
        const resellerName = req.body.resellerName
        const macAddress = req.body.mac_address
        const user_id = req.body.userId
        const type = req.body.type.toLowerCase()
        const request_type = req.body.request_type.toLowerCase()
        const amc_startDate = req.body.amc_startDate
        const amc_endDate = req.body.amc_endDate
        const customer_name = req.body.selectedCustomer
        const Usedtoken = req.body.token
        const internalFeatures = req.body.internalFeatures

        const DGvoxstatus = req.body.products.DGvox.status
        const Speechbillstatus = req.body.products.Speechbill.status
        const expiry_days = req.body.expiry_days
        const ActiveDirectory = req.body.ActiveDirectory
        const status = {DGvoxstatus,Speechbillstatus}
        const system = req.body.system
        const purchaseOrder = req.body.purchaseOrder
        const productDate = req.body.productDate
        const selectedVersion = req.body.selectedVersion
        const machineCount = req.body.machineCount
        const region = req.body.region.toUpperCase();

        let DGvox = {}
        let DGvox_default = {}
        let DGvoxFeature = {}

        let Speechbill = {}
        let Speechbill_default = {}

        //Both DGvox and Speechbill Using
        if (DGvoxstatus == true && Speechbillstatus == true) {
            DGvox_default = {
                DashBoard: true,
                AlertsandAlarms: true,
                ScheduledArchive: true,
                ScheduledArchive: true,
                ScheduledRecording: true,
                RuleBasedSearch: true
            };
            DGvoxFeature = {
                SMS: req.body.products.DGvox.SMS,
                EMC_centera: req.body.products.DGvox.EMC_centera,
                Screen_capture: req.body.products.DGvox.Screen_capture,
                AQM: req.body.products.DGvox.AQM,
                FAX: req.body.products.DGvox.FAX,
                Installation: req.body.products.DGvox.selectedinstallation,
                SeatsValue: req.body.products.DGvox.seatsValue
            }
            let Digitalstatus = req.body.products.DGvox.Digital_Recorder.status;
            let Passive_IP_status = req.body.products.DGvox.Passive_IP.status;
            let Active_IP_status = req.body.products.DGvox.Active_IP.status;
            let Analog_Recorder_status = req.body.products.DGvox.Analog_Recorder.status;
            let E1_Recorder_status = req.body.products.DGvox.E1_Recorder.status;

            let Digital_Recorder = {};
            let Passive_IP = {};
            let Active_IP = {};
            let Analog_Recorder = {};
            let E1_Recorder = {};

            if (Digitalstatus === true) {
                Digital_Recorder = req.body.products.DGvox.Digital_Recorder
            } else if (Digitalstatus === false) {
                Digital_Recorder = {
                    status: false
                };
            }

            if (Passive_IP_status === true) {
                Passive_IP = req.body.products.DGvox.Passive_IP
            } else if (Passive_IP_status === false) {
                Passive_IP = {
                    status: false
                };
            }

            if (Active_IP_status === true) {
                Active_IP = req.body.products.DGvox.Active_IP
            } else if (Active_IP_status === false) {
                Active_IP = {
                    status: false
                };
            }

            if (Analog_Recorder_status === true) {
                Analog_Recorder = req.body.products.DGvox.Analog_Recorder
            } else if (Analog_Recorder_status === false) {
                Analog_Recorder = {
                    status: false
                };
            }

            if (E1_Recorder_status === true) {
                E1_Recorder = req.body.products.DGvox.E1_Recorder
            } else if (E1_Recorder_status === false) {
                E1_Recorder = {
                    status: false
                };
            }

            let DGvoxRecorder = {
                Digital_Recorder: Digital_Recorder,
                Passive_IP: Passive_IP,
                Active_IP: Active_IP,
                Analog_Recorder: Analog_Recorder,
                E1_Recorder: E1_Recorder
            };
            DGvox = Object.assign(DGvox, DGvox_default, DGvoxFeature, DGvoxRecorder);
            Speechbill_default = req.body.products.Speechbill
            Speechbill = Object.assign(Speechbill_default);
        }
        //Only DGvox Using
        else if (DGvoxstatus == true) {
            DGvox_default = {
                DashBoard: true,
                AlertsandAlarms: true,
                ScheduledArchive: true,
                ScheduledArchive: true,
                ScheduledRecording: true,
                RuleBasedSearch: true
            };
            DGvoxFeature = {
                SMS: req.body.products.DGvox.SMS,
                EMC_centera: req.body.products.DGvox.EMC_centera,
                Screen_capture: req.body.products.DGvox.Screen_capture,
                AQM: req.body.products.DGvox.AQM,
                FAX: req.body.products.DGvox.FAX,
                Installation: req.body.products.DGvox.selectedinstallation,
                SeatsValue: req.body.products.DGvox.seatsValue
            }
            let Digitalstatus = req.body.products.DGvox.Digital_Recorder.status;
            let Passive_IP_status = req.body.products.DGvox.Passive_IP.status;
            let Active_IP_status = req.body.products.DGvox.Active_IP.status;
            let Analog_Recorder_status = req.body.products.DGvox.Analog_Recorder.status;
            let E1_Recorder_status = req.body.products.DGvox.E1_Recorder.status;

            let Digital_Recorder = {};
            let Passive_IP = {};
            let Active_IP = {};
            let Analog_Recorder = {};
            let E1_Recorder = {};

            if (Digitalstatus === true) {
                Digital_Recorder = req.body.products.DGvox.Digital_Recorder
            } else if (Digitalstatus === false) {
                Digital_Recorder = {
                    status: false
                };
            }

            if (Passive_IP_status === true) {
                Passive_IP = req.body.products.DGvox.Passive_IP

            } else if (Passive_IP_status === false) {
                Passive_IP = {
                    status: false
                };
            }

            if (Active_IP_status === true) {
                Active_IP = req.body.products.DGvox.Active_IP

            } else if (Active_IP_status === false) {
                Active_IP = {
                    status: false
                };
            }

            if (Analog_Recorder_status === true) {
                Analog_Recorder = req.body.products.DGvox.Analog_Recorder

            } else if (Analog_Recorder_status === false) {
                Analog_Recorder = {
                    status: false
                };
            }

            if (E1_Recorder_status === true) {
                E1_Recorder = req.body.products.DGvox.E1_Recorder

            } else if (E1_Recorder_status === false) {
                E1_Recorder = {
                    status: false
                };
            }

            let DGvoxRecorder = {
                Digital_Recorder: Digital_Recorder,
                Passive_IP: Passive_IP,
                Active_IP: Active_IP,
                Analog_Recorder: Analog_Recorder,
                E1_Recorder: E1_Recorder
            };
            DGvox = Object.assign(DGvox, DGvox_default, DGvoxFeature, DGvoxRecorder);
            Speechbill = { status: false }

        }
        //Only Speechbill Using
        else if (Speechbillstatus == true) {
            Speechbill_default = {
                Speechbill: req.body.products.Speechbill
            }
            Speechbill = Object.assign(Speechbill_default);
            DGvox = { status: false }

        } else {
            DGvox = { status: false }
            Speechbill = { status: false }
        }

        const amc = { amc_startDate: amc_startDate, amc_endDate: amc_endDate }
        const orderDetails = { customer_name:customer_name, purchaseOrder:purchaseOrder, productDate:productDate, selectedVersion:selectedVersion, machineCount:machineCount, region:region, system:system, DGvoxstatus:DGvoxstatus,Speechbillstatus:Speechbillstatus,resellerName:resellerName,dealerName:dealerName }
        const tokenDetails = {amc, DGvox, Speechbill,expiry_days,ActiveDirectory,internalFeatures,orderDetails}
          //Generate Jwt Token
        const token = JwtToken.genToken(tokenDetails);
        const secretKey = apiSecret;
        const combinedData = `${token}.${macAddress}`;

        //Encrypt Jwt Token
        const hashedKey = CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Hex).slice(0, 32);
        
        // Example: AES encryption with the correctly sized key
        const encryptedData = CryptoJS.AES.encrypt(combinedData, CryptoJS.enc.Hex.parse(hashedKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        const data = {
            mac_address: macAddress, token: encryptedData, user_id: user_id, amc_startDate: amc_startDate,
            amc_endDate: amc_endDate, customer_name: customer_name, type: type, request_type: request_type,expiry_days:expiry_days,purchaseOrder:purchaseOrder,
            productDate:productDate,selectedVersion:selectedVersion,machineCount:machineCount,Usedtoken:Usedtoken
        }

        const result = await updateLicense.UpdateLicense(data);
        const license_id = result.license_id
        if (result.result.affectedRows > 0) {
            const license_details = {license_id,status,system,customer_name,region}
            const updatelicense = await updateLicense.updatelicensedetails(license_details);
            res.status(200).json({ status: true, message: "License Updated Successfully", token: token });
        } else {
            logger.error(result);
            res.status(400).json({ status: false, message: "Given License is no more valid" });
        }

    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}