const util = require('util');
const db = require('../../config/dbconnection');
const { Logger } = require('../../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class license {
    // Fetching the total count license
    static async fetchCount(dateRange) {
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

            const result = await dbQueryPromise(`SELECT COALESCE(total_count, 0) AS total_count
            FROM (
                SELECT
                    COUNT(*) AS total_count
                FROM
                    tb_license
                WHERE
                    created_on >= CASE
                                         ${filterQuery}
                                    END
            ) AS counts;            
             `);
            return result;
        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
}

module.exports = {license:license};