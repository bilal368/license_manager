const util = require('util');
const db = require('../../config/dbconnection');
const { Logger } = require('../../utils/logger');
const logger = Logger.logger;
// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class licenselist {
    // Listing license in given date range
    static async fetchlist(dateRange, fromDate, toDate) {
        try {
            const start_date = fromDate;
            const end_date = toDate;
            let filterQuery
            if (dateRange === 'This Month') {
                filterQuery = `(YEAR(l.created_on) = YEAR(CURRENT_DATE()) AND MONTH(l.created_on) = MONTH(CURRENT_DATE()))`
            } else if (dateRange === 'Last Month') {
                filterQuery = `(YEAR(l.created_on) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) AND MONTH(l.created_on) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH))`
            } else if (dateRange === 'This Quarter') {
                filterQuery = `(YEAR(l.created_on) = YEAR(CURRENT_DATE()) AND QUARTER(l.created_on) = QUARTER(CURRENT_DATE()))`
            } else if (dateRange === 'Last Quarter') {
                filterQuery = `(YEAR(l.created_on) = YEAR(CURRENT_DATE() - INTERVAL 3 MONTH) AND QUARTER(l.created_on) = QUARTER(CURRENT_DATE() - INTERVAL 3 MONTH))`
            } else if (dateRange === 'This Year') {
                filterQuery = `(YEAR(l.created_on) = YEAR(CURRENT_DATE()))`
            } else if (dateRange === 'Last Year') {
                filterQuery = `(YEAR(l.created_on) = YEAR(CURRENT_DATE()) - 1)`
            } else if (dateRange === 'Custom') {
                filterQuery = `(l.created_on BETWEEN '${start_date}' AND '${end_date}')`
            }

            const license = await dbQueryPromise(`SELECT 
            DATE_FORMAT(l.created_on, '%d-%m-%Y') AS created_date, 
            l.purchaseOrder, 
            ld.customer_name, 
            ld.dgVox_status, 
            ld.speechBill_status, 
            l.type, 
            l.license_key,
            l.serialKey,
            ld.region, 
            f.svg_id AS region_svg_id  
        FROM 
            tb_license AS l
        JOIN 
            tb_licenseDetails AS ld ON l.license_id = ld.license_id
        LEFT JOIN 
            tb_flag AS f ON ld.region = f.name 
     WHERE   ${filterQuery}
     ORDER BY 
        l.license_id DESC;`);
            return license;

        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
    //Dealers Details
    static async dealer_details() {
        try {
            const dealer = await dbQueryPromise(`SELECT dealerCode,dealerName,customerType FROM tb_dealers`);
            return dealer;

        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
    //Customer Details
    static async customerlist() {
        try {
            const customer = await dbQueryPromise(`SELECT customerCode,customerName FROM tb_customers`);
            return customer;

        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
    //Resellers Details
    static async resellerslist() {
        try {
            const dealer = await dbQueryPromise(`SELECT dealerCode,dealerName,customerType FROM tb_dealers where customerType = 'reseller'`);
            return dealer;

        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
    //Fetch region
    static async region() {
        try {
            const region = await dbQueryPromise(`SELECT regionId,regionName FROM tb_regions`);
            return region;

        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
    // Fetch flagregion
    static async flagregion() {
        try {
            const region = await dbQueryPromise(`SELECT id,name FROM tb_flag`);
            return region;

        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
    //Fetch version
    static async version() {
        try {
            const version = await dbQueryPromise(`SELECT id,version FROM tb_version`);
            return version;

        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
    //Fetch License details
    static async fetchLicense(licenseKey) {
        try {
            const License = await dbQueryPromise(`SELECT 
            l.license_id,
            l.mac_address,
            l.purchaseOrder,
            DATE_FORMAT(l.productOrder_date, '%Y-%m-%d') AS productOrder_date,
            l.machineCount,
            l.serialKey,
            ld.customer_name,
            ld.region,
            ld.dgVox_status,
            ld.speechBill_status,
            ld.system,
            ld.dealer_name,
            ld.resellers_name,
            tv.version
        FROM 
            tb_license AS l
        JOIN 
            tb_licenseDetails AS ld ON l.license_id = ld.license_id
        JOIN 
            tb_version AS tv ON l.version = tv.version
        WHERE 
            l.license_key = ?`, [licenseKey]);

            return License;

        } catch (error) {
            console.error('Error Fetching license data:', error);
            logger.error(error);
        }
    }
    // delete region
    static deleteregion = async function (regionId) {
        try {
            const result = await dbQueryPromise("DELETE FROM tb_regions WHERE regionId = ?;", [regionId]);
            return result
        } catch (error) {
            console.error('Error deleting dealer data:', error);
            logger.error(error);
        }
    }
}

module.exports = { licenselist: licenselist };