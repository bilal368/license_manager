const CryptoJS = require('crypto-js');
require('../../config/env')
const apiSecret = process.env.AUTHORIZATION_USER
const pako = require('pako');
const { Logger } = require('../../utils/logger');
const logger = Logger.logger;
const { licenselist } = require('../../models/license/licenseList');

// Listing license in given date range
exports.licenselist = async (req, res) => {
    try {
        const dateRange = req.query.dateRange
        const dates = JSON.parse(req.query.dates);
        let fromDate
        let toDate
        if (dateRange == 'Custom') {
            fromDate = dates.fromdate;
            toDate = dates.todate;
        }
        const license_details = await licenselist.fetchlist(dateRange, fromDate, toDate);
        res.status(200).json({ status: true, license_details })
    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}
//Dealers Details
exports.dealerlist = async (req, res) => {
    try {
        const dealer_details = await licenselist.dealer_details();
        res.status(200).json({ status: true, dealer_details })
    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}
//Customer Details
exports.customerlist = async (req, res) => {
    try {
        const customerlist = await licenselist.customerlist();
        res.status(200).json({ status: true, customerlist })
    } catch (error) {
        logger.error(error);
        console.error(error);
    }

}
//Resellers Details
exports.resellerslist = async (req, res) => {
    try {
        const resellerslist = await licenselist.resellerslist();
        res.status(200).json({ status: true, resellerslist })
    } catch (error) {
        logger.error(error);
        console.error(error);
    }

}
//Fetch region
exports.region = async (req, res) => {
    try {
        const region = await licenselist.region();
        res.status(200).json({ status: true, region })
    } catch (error) {
        logger.error(error);
        console.error(error);
    }

}
// Fetch flagregion
exports.flagregion = async (req, res) => {
    try {
        const flagregion = await licenselist.flagregion();
        res.status(200).json({ status: true, flagregion })
    } catch (error) {
        logger.error(error);
        console.error(error);
    }

}
// delete region
exports.deleteregion = async (req, res) => {
    try {
        const regionId = req.body.regionId
        logger.info('Deleting Dealer')

        // Insert dealer details
        const deleteDealer = await licenselist.deleteregion(regionId);

        if (deleteDealer.affectedRows > 0) {
            res.status(200).json({ status: true, message: 'Region deleted successfully' });
        } else {
            res.status(400).json({ status: false, message: 'Error No data found' });
        }
    } catch (error) {
        logger.error(error);
        console.error(error);
    }

}
//Fetch version
exports.version = async (req, res) => {
    try {
        const version = await licenselist.version();
        res.status(200).json({ status: true, version })
    } catch (error) {
        logger.error(error);
        console.error(error);
    }

}
//Fetch License details
exports.fetchLicense = async (req, res) => {
    try {
        const licenseKey = req.body.token
        const License = await licenselist.fetchLicense(licenseKey);
        if (License.length > 0) {

            const receivedEncryptedData = licenseKey;
            // Hash the key to ensure it is the correct length
            const hashedKey = CryptoJS.SHA256(apiSecret).toString(CryptoJS.enc.Hex).slice(0, 32);

            // Step 1: Decrypt the encrypted data
            const decrypted = CryptoJS.AES.decrypt(receivedEncryptedData, CryptoJS.enc.Hex.parse(hashedKey), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            // Step 2: Convert decrypted data from WordArray to Base64 string
            const decryptedBase64 = decrypted.toString(CryptoJS.enc.Utf8);

            // Step 3: Convert Base64 string to Uint8Array
            const byteCharacters = atob(decryptedBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Step 4: Decompress the data using pako
            const decompressedData = pako.inflate(byteArray, { to: 'string' });
            const receivedToken = decompressedData;


            const parts = receivedToken.split('.');
            const MacAddress = parts[parts.length - 1];
            const encodedPayload = parts[1];
            const decodedPayload = JSON.parse(atob(encodedPayload));

            res.status(200).json({ status: true, MacAddress: MacAddress, decodedPayload: decodedPayload, License: License })
        } else {
            res.status(400).json({ status: false, message: "LicenseKey is incorrect" });
        }

    } catch (error) {
        logger.error(error);
        console.error(error);
    }

}

// Search Licence Key
exports.decryption = async (req, res) => {
    try {
        logger.info('Executing decryption API')
        //decryption
        const token = req.body.token;
        const License = await licenselist.fetchLicense(token);
        if (License.length > 0) {
            const receivedEncryptedData = token;

            // Hash the key to ensure it is the correct length
            const hashedKey = CryptoJS.SHA256(apiSecret).toString(CryptoJS.enc.Hex).slice(0, 32);

            // Step 1: Decrypt the encrypted data
            const decrypted = CryptoJS.AES.decrypt(receivedEncryptedData, CryptoJS.enc.Hex.parse(hashedKey), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            // Step 2: Convert decrypted data from WordArray to Base64 string
            const decryptedBase64 = decrypted.toString(CryptoJS.enc.Utf8);

            // Step 3: Convert Base64 string to Uint8Array
            const byteCharacters = atob(decryptedBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Step 4: Decompress the data using pako
            const decompressedData = pako.inflate(byteArray, { to: 'string' });
            const receivedToken = decompressedData;

            const parts = receivedToken.split('.');
            const MacAddress = parts[parts.length - 1];
            const encodedPayload = parts[1];
            const decodedPayload = JSON.parse(atob(encodedPayload));

            // return res.status(200).json({ MacAddress, decodedPayload })
            res.status(200).json({ status: true, MacAddress: MacAddress, decodedPayload: decodedPayload, License: License })

        }
        else {
            res.status(400).json({ status: false, message: "LicenseKey is incorrect" });
            return
        }

    } catch (outerError) {
        logger.error(outerError);
        console.error("Error querying decrypting license:", outerError);
    }
}
// Decryption Licence Key
exports.newTokenDecryption = async (req, res) => {
    try {
        logger.info('Executing decryption API')
        //decryption
        const token = req.body.token;
        if (!token) {
            return res.status(404).json({ status: false, message: "LicenseKey is not exist" });
        }
        const receivedEncryptedData = token;

        // Hash the key to ensure it is the correct length
        const hashedKey = CryptoJS.SHA256(apiSecret).toString(CryptoJS.enc.Hex).slice(0, 32);

        // Step 1: Decrypt the encrypted data
        const decrypted = CryptoJS.AES.decrypt(receivedEncryptedData, CryptoJS.enc.Hex.parse(hashedKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        // Step 2: Convert decrypted data from WordArray to Base64 string
        const decryptedBase64 = decrypted.toString(CryptoJS.enc.Utf8);

        // Step 3: Convert Base64 string to Uint8Array
        const byteCharacters = atob(decryptedBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Step 4: Decompress the data using pako
        const decompressedData = pako.inflate(byteArray, { to: 'string' });
        const receivedToken = decompressedData;

        const parts = receivedToken.split('.');
        const MacAddress = parts[parts.length - 1];
        const encodedPayload = parts[1];
        const decodedPayload = JSON.parse(atob(encodedPayload));

        // return res.status(200).json({ MacAddress, decodedPayload })
        res.status(200).json({ status: true, MacAddress: MacAddress, decodedPayload: decodedPayload })

    } catch (outerError) {
        logger.error(outerError);
        console.error("Error querying decrypting license:", outerError);
        res.status(400).json({ status: false, message: "LicenseKey is incorrect" });
        return
    }
}



