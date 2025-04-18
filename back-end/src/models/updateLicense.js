const util = require('util');
const db = require('../config/dbconnection');
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class updateLicense {
    // Fetching latest license_id
    static async getLastLicenseId(Usedtoken) {
        try {
            const result = await dbQueryPromise("SELECT license_id FROM tb_license WHERE license_key=?",[Usedtoken]);
            return result.length > 0 ? result[0].license_id: 1;
        } catch (error) {
            console.error('Error querying tb_license:', error);
            logger.error(error);
            throw error;
        }
    }
    // Updating license on tb_license
    static async UpdateLicense(data) {
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
            const Usedtoken = data.Usedtoken
            const license_id = await this.getLastLicenseId(Usedtoken);
            const config_num = `${customer_name}_${license_id}`;

            const updateData = [
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
                Usedtoken
            ];

            const updateQuery = `
            UPDATE tb_license
            SET mac_address = ?,
                license_key=?,
                userId = ?,
                amc_startDate = ?,
                amc_endDate = ?,
                created_on = CURRENT_TIMESTAMP,
                config_num = ?,
                type = ?,
                request_type = ?,
                expiry_days = ?,
                purchaseOrder = ?,
                productOrder_date = ?,
                version = ?,
                machineCount = ?
            WHERE license_key = ?;
          `;

            const result = await dbQueryPromise(updateQuery, updateData);
            console.log("result",result);
            return {
                license_id: license_id !== undefined ? license_id : -1,
                result: result
            };
            // return license_id !== undefined ? license_id : -1,result;

        } catch (error) {
            console.error('Error querying user data:', error);
            logger.error(error);
            return -1;
        }
    }
    // Updating license on tb_licenseDetails
    static async updatelicensedetails(license_details) {
        try{
            let DGvoxstatus = license_details.status.DGvoxstatus
            let Speechbillstatus = license_details.status.Speechbillstatus
            const license_id = license_details.license_id
            const region = license_details.region
            const system = license_details.system
            const customer_name = license_details.customer_name
            if (DGvoxstatus == true) {
                DGvoxstatus = 1
            }else{
                DGvoxstatus = 0
            }
            if (Speechbillstatus == true) {
                Speechbillstatus = 1
            }else{
                Speechbillstatus = 0
            }
            const updateData = [
                DGvoxstatus,
                Speechbillstatus,
                system,
                customer_name,
                region,
                license_id
            ];
            
            const updateQuery = `
                UPDATE tb_licenseDetails
                SET dgVox_status = ?,
                    speechBill_status = ?,
                    system = ?,
                    created_on = CURRENT_TIMESTAMP,
                    customer_name = ?,
                    region = ?
                WHERE license_id = ?;
            `;
            
            const result = await dbQueryPromise(updateQuery, updateData);
            console.log("result",result);
            return result && result.affectedRows > 0 ? license_id : -1;
            
            // const insertData = [
            //     license_id,
            //     DGvoxstatus,
            //     Speechbillstatus,
            //     system,
            //     customer_name,
            //     region
            // ];

            // const insertQuery = "INSERT INTO tb_licenseDetails(license_id,dgVox_status,speechBill_status,system,created_on,customer_name,region) VALUES (?,?,?,?,CURRENT_TIMESTAMP,?,?)";

            // const result = await dbQueryPromise(insertQuery, insertData);
            
            // return result && result.insertId !== undefined ? result.insertId : -1;

    } catch (error) {
        console.error('Error querying user data:', error);
        logger.error(error);
        return -1;
    }
    }
}

module.exports = { updateLicense: updateLicense }