const util = require('util');
const db = require('../config/dbconnection');
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class generateLicense {
    // Fetching latest licenseId
    static async getLastLicenseId() {
        try {
            const result = await dbQueryPromise("SELECT license_id FROM tb_license ORDER BY created_on DESC LIMIT 1");
            return result.length > 0 ? result[0].license_id + 1 : 1;
        } catch (error) {
            console.error('Error querying tb_license:', error);
            logger.error(error);
            throw error;
        }
    }
    // Inserting license on tb_license
    static async insertLicense(data) {
        try {
            const mac_address = data.mac_address;
            const token = data.token;
            const user_id = data.user_id;
            const amc_startDate = data.amc_startDate;
            const amc_endDate = data.amc_endDate;
            const customer_name = data.customer_name;
            const type = data.type;
            const request_type = data.request_type;
            const expiry_days = data.expiry_days;
            const purchaseOrder = data.purchaseOrder
            const productDate = data.productDate
            const selectedVersion = data.selectedVersion
            const machineCount = data.machineCount
            const license_id = await this.getLastLicenseId();
            const config_num = `${customer_name}_${license_id}`;
            const serialKey = data.serialKey
            const insertData = [
                mac_address,
                token,
                user_id,
                amc_startDate,
                amc_endDate,
                config_num,
                type,
                request_type,
                expiry_days,
                purchaseOrder,
                productDate,
                selectedVersion,
                machineCount,
                serialKey
            ];

            const insertQuery = "INSERT INTO tb_license(mac_address,license_key,userId,amc_startDate,amc_endDate,created_on,config_num,type,request_type,expiry_days,purchaseOrder,productOrder_date,version,machineCount,serialKey) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?,?,?,?,?,?,?)";

            const result = await dbQueryPromise(insertQuery, insertData);

            return result && result.insertId !== undefined ? result.insertId : -1;

        } catch (error) {
            console.error('Error querying user data:', error);
            logger.error(error);
            return -1;
        }
    }
    // Inserting license on tb_licenseDetails
    static async updatelicensedetails(license_details) {
        try {
            let DGvoxstatus = license_details.status.DGvoxstatus
            let Speechbillstatus = license_details.status.Speechbillstatus
            const license_id = license_details.result
            const region = license_details.region
            const system = license_details.system
            const customer_name = license_details.customer_name
            const dealerName = license_details.dealerName
            const resellerName = license_details.resellerName

            if (DGvoxstatus == true) {
                DGvoxstatus = 1
            } else {
                DGvoxstatus = 0
            }
            if (Speechbillstatus == true) {
                Speechbillstatus = 1
            } else {
                Speechbillstatus = 0
            }
            const insertData = [
                license_id,
                DGvoxstatus,
                Speechbillstatus,
                system,
                customer_name,
                region,
                dealerName,
                resellerName
            ];

            const insertQuery = "INSERT INTO tb_licenseDetails(license_id,dgVox_status,speechBill_status,system,created_on,customer_name,region,dealer_name,resellers_name) VALUES (?,?,?,?,CURRENT_TIMESTAMP,?,?,?,?)";

            const result = await dbQueryPromise(insertQuery, insertData);

            return result && result.insertId !== undefined ? result.insertId : -1;

        } catch (error) {
            console.error('Error querying user data:', error);
            logger.error(error);
            return -1;
        }
    }
}

module.exports = { generateLicense: generateLicense }