const util = require('util');
const db = require('../../config/dbconnection');
const { Logger } = require('../../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class licensetype {
    // License Types Count
    static async fetchtype(dateRange) {
        try {
            let filterQuery
            if (dateRange === 'This Month') {
                filterQuery = `created_on >= DATE_FORMAT(NOW(), '%Y-%m-01');`
            } else if (dateRange === 'Last Month') {
                filterQuery = `created_on >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
                AND created_on < DATE_FORMAT(NOW(), '%Y-%m-01');`
            } else if (dateRange === 'This Quarter') {
                filterQuery = `created_on >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL QUARTER(NOW()) - 1 QUARTER), '%Y-%m-01');`
            } else if (dateRange === 'Last Quarter') {
                filterQuery = `created_on >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL QUARTER(NOW()) + 1 QUARTER), '%Y-%m-01')
                AND created_on < DATE_FORMAT(DATE_SUB(NOW(), INTERVAL QUARTER(NOW())), '%Y-%m-01');`
            } else if (dateRange === 'This Year') {
                filterQuery = `YEAR(created_on) = YEAR(NOW());`
            } else if (dateRange === 'Last Year') {
                filterQuery = `YEAR(created_on) = YEAR(NOW()) - 1;`
            } else {
                //if nothing works filter as this month
                filterQuery = `created_on >= DATE_FORMAT(NOW(), '%Y-%m-01');`
            }

            const result = await dbQueryPromise(`SELECT 
            COALESCE(COUNT(*), 0) AS total_count,
            COALESCE(SUM(CASE WHEN type = 'new' THEN 1 ELSE 0 END), 0) AS full_count,
            COALESCE(SUM(CASE WHEN type = 're-issue' THEN 1 ELSE 0 END), 0) AS reissue_count,
            COALESCE(SUM(CASE WHEN type = 'upgrade' THEN 1 ELSE 0 END), 0) AS upgrade_count
        FROM 
            tb_license
        WHERE
                            ${filterQuery}          
        `);

            return result;
        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
    // License internal features
    static async fetchFeatures() {
        try {
            const result = await dbQueryPromise(`CALL spGetLicensePackageFeature(1);`);
            return result;
        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
}

module.exports = { licensetype: licensetype };