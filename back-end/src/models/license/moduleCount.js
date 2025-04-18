const util = require('util');
const db = require('../../config/dbconnection');
const { Logger } = require('../../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class moduleCount {
    // License System count
    static async fetchtype(dateRange) {
        try {
            let filterQuery
            if (dateRange === 'This Month') {
                filterQuery = `WHEN DATE_FORMAT(NOW(), '%Y-%m') = DATE_FORMAT(created_on, '%Y-%m') THEN DATE_FORMAT(NOW(), '%Y-%m-01')`
            } else if (dateRange === 'Last Month') {
                filterQuery = `WHEN DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m') = DATE_FORMAT(created_on, '%Y-%m') THEN DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01')`
            } else if (dateRange === 'This Quarter') {
                filterQuery = `WHEN QUARTER(NOW()) = QUARTER(created_on) AND YEAR(NOW()) = YEAR(created_on) THEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL QUARTER(NOW()) - 1 QUARTER), '%Y-%m-01')`
            } else if (dateRange === 'Last Quarter') {
                filterQuery = `WHEN QUARTER(NOW()) = QUARTER(created_on) - 1 AND YEAR(NOW()) = YEAR(created_on) THEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL QUARTER(NOW()) - 2 QUARTER), '%Y-%m-01')`
            } else if (dateRange === 'This Year') {
                filterQuery = `WHEN YEAR(NOW()) = YEAR(created_on) THEN DATE_FORMAT(NOW(), '%Y-01-01')`
            } else if (dateRange === 'Last Year') {
                filterQuery = `WHEN YEAR(NOW()) - 1 = YEAR(created_on) THEN DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-01-01')`
            } else {
                //if nothing works filter as this month
                filterQuery = `WHEN DATE_FORMAT(NOW(), '%Y-%m') = DATE_FORMAT(created_on, '%Y-%m') THEN DATE_FORMAT(NOW(), '%Y-%m-01')`
            }

            const result = await dbQueryPromise(`
            SELECT
                COUNT(*) AS total_count,
                COALESCE(SUM(CASE WHEN dgVox_status = 1 AND speechBill_status = 1 THEN 1 ELSE 0 END), 0) AS both_count,
                COALESCE(SUM(CASE WHEN dgVox_status = 1 AND speechBill_status = 0 THEN 1 ELSE 0 END), 0) AS dgVox_count,
                COALESCE(SUM(CASE WHEN dgVox_status = 0 AND speechBill_status = 1 THEN 1 ELSE 0 END), 0) AS speechBill_count,
                COALESCE(SUM(CASE WHEN system = 'WINDOWS' THEN 1 ELSE 0 END), 0) AS Windows_count,
                COALESCE(SUM(CASE WHEN system = 'LINUX' THEN 1 ELSE 0 END), 0) AS Linux_count
            FROM
                tb_licenseDetails
            WHERE
                created_on >= CASE
                                   ${filterQuery}   
                                END;`);
            return result;
        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
}

module.exports = { moduleCount: moduleCount };