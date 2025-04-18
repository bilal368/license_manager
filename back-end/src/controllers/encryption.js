const CryptoJS = require('crypto-js');
require('../config/env')
const apiSecret = process.env.AUTHORIZATION_USER
const pako = require('pako');
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Decryption license Key
exports.encryption = async (req, res) => {
    try {
        logger.info('Executing decryption API')
        //decryption
        const token = req.body.token;
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

        res.status(200).json({ MacAddress, decodedPayload })
    } catch (outerError) {
        logger.error(outerError);
        console.error("Error querying decrypting license:", outerError);
    }
}