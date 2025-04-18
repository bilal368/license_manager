const CryptoJS = require('crypto-js');
require('../config/env')
const apiSecret = process.env.AUTHORIZATION_USER
const { generateLicense } = require('../models/generateLicense')
const { JwtToken } = require('../utils/jwttoken')
const { Logger } = require('../utils/logger');
const logger = Logger.logger;
const crypto = require('crypto');
const pako = require('pako');
const base64url = require('base64url');
const constantsecretKey = process.env.SERIALKEY
const fs = require('fs');
const path = require('path');

// Licnese Creation
exports.generateLicense = async (req, res) => {
    try {
        logger.info('Executing GenerateLicense API');
        const dealerName = req.body.dealerName;
        const resellerName = req.body.resellerName;
        const serialKey = req.body.mac_address;
        const originalserialKey = serialKey;
        const user_id = req.body.userId;
        const type = req.body.type.toLowerCase();
        const request_type = req.body.request_type.toLowerCase();
        const amc_startDate = req.body.amc_startDate;
        const amc_endDate = req.body.amc_endDate;
        const amc_status = req.body.amc_status;
        const internalFeatures = req.body.internalFeatures;

        const DGvoxstatus = req.body.products.DGvox.status;
        const Speechbillstatus = req.body.products.Speechbill.status;

        const expiry_days = req.body.expiry_days;
        const ActiveDirectory = req.body.ActiveDirectory;
        const status = { DGvoxstatus, Speechbillstatus };
        const system = req.body.system;

        const customer_name = req.body.selectedCustomer;
        const purchaseOrder = req.body.purchaseOrder;
        const productDate = req.body.productDate;
        const selectedVersion = req.body.selectedVersion;
        const machineCount = req.body.machineCount;
        const region = req.body.region.toUpperCase();

        const macAddress = decryptSerialKey(serialKey, constantsecretKey);
        console.log(`Decrypted MAC Address: ${macAddress}`);
        if (macAddress) {
            console.log(`Decrypted MAC Address: ${macAddress}`);
        } else {
            console.log('Failed to decrypt the serial key.');
            return res.status(400).json({ status: false, message: "Failed to decrypt the serial key." });
        }

        let DGvox = {};
        let DGvox_default = {};
        let DGvoxFeature = {};

        let Speechbill = {};
        let Speechbill_default = {};

        // Both DGvox and Speechbill Using
        if (DGvoxstatus == true && Speechbillstatus == true) {
            DGvox_default = {
                db: true, // DashBoard
                aa: true, // AlertsandAlarms
                sa: true, // ScheduledArchive
                sr: true, // ScheduledRecording
                rs: true  // RuleBasedSearch
            };
            DGvoxFeature = {
                sms: req.body.products.DGvox.SMS,
                emc: req.body.products.DGvox.EMC_centera,
                sc: req.body.products.DGvox.Screen_capture,
                aqm: req.body.products.DGvox.AQM,
                fax: req.body.products.DGvox.FAX,
                inst: req.body.products.DGvox.selectedinstallation, // Installation
                seats: req.body.products.DGvox.seatsValue // SeatsValue
            };
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

            Digital_Recorder = Digitalstatus
                ? { ...req.body.products.DGvox.Digital_Recorder, st: true }
                : { st: false };

            Passive_IP = Passive_IP_status
                ? { ...req.body.products.DGvox.Passive_IP, st: true }
                : { st: false };

            Active_IP = Active_IP_status
                ? { ...req.body.products.DGvox.Active_IP, st: true }
                : { st: false };

            Analog_Recorder = Analog_Recorder_status
                ? { ...req.body.products.DGvox.Analog_Recorder, st: true }
                : { st: false };

            E1_Recorder = E1_Recorder_status
                ? { ...req.body.products.DGvox.E1_Recorder, st: true }
                : { st: false };


            let DGvoxRecorder = {
                dr: Digital_Recorder, // Digital_Recorder
                pi: Passive_IP, // Passive_IP
                ai: Active_IP, // Active_IP
                ar: Analog_Recorder, // Analog_Recorder
                e1: E1_Recorder // E1_Recorder
            };
            DGvox = Object.assign(DGvox, DGvox_default, DGvoxFeature, DGvoxRecorder);
            Speechbill_default = req.body.products.Speechbill;
            Speechbill = Object.assign(Speechbill_default);
        }
        // Only DGvox Using
        else if (DGvoxstatus == true) {
            DGvox_default = {
                db: true, // DashBoard
                aa: true, // AlertsandAlarms
                sa: true, // ScheduledArchive
                sr: true, // ScheduledRecording
                rs: true  // RuleBasedSearch
            };
            DGvoxFeature = {
                sms: req.body.products.DGvox.SMS,
                emc: req.body.products.DGvox.EMC_centera,
                sc: req.body.products.DGvox.Screen_capture,
                aqm: req.body.products.DGvox.AQM,
                fax: req.body.products.DGvox.FAX,
                inst: req.body.products.DGvox.selectedinstallation, // Installation
                seats: req.body.products.DGvox.seatsValue // SeatsValue
            };
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

            Digital_Recorder = Digitalstatus
                ? { ...req.body.products.DGvox.Digital_Recorder, st: true }
                : { st: false };
            delete Digital_Recorder.status;

            Passive_IP = Passive_IP_status
                ? { ...req.body.products.DGvox.Passive_IP, st: true }
                : { st: false };
            delete Passive_IP.status;

            Active_IP = Active_IP_status
                ? { ...req.body.products.DGvox.Active_IP, st: true }
                : { st: false };
            delete Active_IP.status;

            Analog_Recorder = Analog_Recorder_status
                ? { ...req.body.products.DGvox.Analog_Recorder, st: true }
                : { st: false };
            delete Analog_Recorder.status;

            E1_Recorder = E1_Recorder_status
                ? { ...req.body.products.DGvox.E1_Recorder, st: true }
                : { st: false };
            delete E1_Recorder.status;




            let DGvoxRecorder = {
                dr: Digital_Recorder, // Digital_Recorder
                pi: Passive_IP, // Passive_IP
                ai: Active_IP, // Active_IP
                ar: Analog_Recorder, // Analog_Recorder
                e1: E1_Recorder // E1_Recorder
            };
            DGvox = Object.assign(DGvox, DGvox_default, DGvoxFeature, DGvoxRecorder);
            Speechbill = { st: false }; // status
        }
        // Only Speechbill Using
        else if (Speechbillstatus == true) {
            Speechbill_default = {
                sb: req.body.products.Speechbill // Speechbill
            };
            Speechbill = Object.assign(Speechbill_default);
            DGvox = { st: false }; // status
        } else {
            DGvox = { st: false }; // status
            Speechbill = { st: false }; // status
        }

        const amc = { st: amc_status, sd: amc_startDate, ed: amc_endDate }; // amc_status, amc_startDate, amc_endDate
        const orderDetails = {
            cn: customer_name, // customer_name
            po: purchaseOrder, // purchaseOrder
            pd: productDate, // productDate
            sv: selectedVersion, // selectedVersion
            mc: machineCount, // machineCount
            reg: region, // region
            sys: system, // system
            dg: DGvoxstatus, // DGvoxstatus
            sb: Speechbillstatus, // Speechbillstatus
            rn: resellerName, // resellerName
            dn: dealerName, // dealerName
            sk: serialKey // serialKey
        };

        // Simplify internalFeatures to only include basicFeatureName
        const simplifiedInternalFeatures = internalFeatures.map(feature => feature.basicFeatureName);

        const tokenDetails = {
            amc,
            dg: DGvox, // DGvox
            sb: Speechbill, // Speechbill
            ed: expiry_days, // expiry_days
            ad: ActiveDirectory, // ActiveDirectory
            if: simplifiedInternalFeatures, // internalFeatures
            od: orderDetails // orderDetails
        };
        console.log("tokenDetails", tokenDetails);

        //Generate Jwt Token
        const token = JwtToken.genToken(tokenDetails);
        console.log("token",token);
        
        const secretKey = apiSecret;
        const combinedData = `${token}.${macAddress}`;

        // Step 1: Compress the data
        const compressedData = pako.deflate(combinedData);

        // Step 2: Convert the compressed data (Uint8Array) to a Base64 string
        const compressedDataBase64 = btoa(String.fromCharCode.apply(null, compressedData));

        //Encrypt Jwt Token
        const hashedKey = CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Hex).slice(0, 32);

        // Example: AES encryption with the correctly sized key
        const encryptedData = CryptoJS.AES.encrypt(compressedDataBase64, CryptoJS.enc.Hex.parse(hashedKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        const data = {
            mac_address: macAddress, token: encryptedData, user_id: user_id, amc_startDate: amc_startDate,
            amc_endDate: amc_endDate, customer_name: customer_name, type: type, request_type: request_type, expiry_days: expiry_days, purchaseOrder: purchaseOrder,
            productDate: productDate, selectedVersion: selectedVersion, machineCount: machineCount, serialKey, amc_status: amc_status,
        }

        const result = await generateLicense.insertLicense(data);

        if (result > 0) {

            // Define the directory and file path
            const dir = path.join(__dirname, '../../license');
            const sanitizedSerialKey = serialKey.replace(/[\/\\]/g, '_');
            const filePath = path.join(dir, `${sanitizedSerialKey}.txt`);  // Specify the full file path

            // Create directories if they don't exist
            fs.mkdirSync(dir, { recursive: true });

            // Save encryptedData into the file
            fs.writeFile(filePath, encryptedData, (err) => {
                if (err) {
                    console.error('Error saving encryptedData to file:', err);
                }
            });

            const license_details = { result, status, system, customer_name, region, dealerName, resellerName }
            const updatelicense = await generateLicense.updatelicensedetails(license_details);
            res.status(200).json({ status: true, message: "License Generated Successfully", token: encryptedData });
        } else {
            logger.error(result);
            res.status(400).json({ status: false, message: result });
        }
    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}

function decryptSerialKey(serialKey, constantsecretKey) {
    try {

        // Decode the base64 serial key to get the encrypted data and IV
        const encryptedMac = base64url.toBuffer(serialKey); // Convert base64 string back to buffer
        const iv = encryptedMac.slice(0, 16); // Extract the first 16 bytes (IV)
        const encryptedText = encryptedMac.slice(16); // The rest is the actual encrypted MAC address

        // Convert the constantsecretKey from hex string to a 32-byte buffer
        if (constantsecretKey.length !== 64) {
            throw new Error('Invalid key length: The key must be 64 hex characters (32 bytes)');
        }
        const key = Buffer.from(constantsecretKey, 'hex');

        // Create AES decipher for AES-256-CBC
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        // Decrypt and remove padding
        let decryptedMac = decipher.update(encryptedText, 'binary', 'utf8');
        decryptedMac += decipher.final('utf8');

        // Return the decrypted MAC address
        return decryptedMac.trim();

    } catch (error) {
        // Handle decryption errors
        console.error('Decryption failed:', error.message);
        return null; // Return null or an appropriate error message
    }
}