const util = require('util');
const db = require('../../config/dbconnection');
const { Logger } = require('../../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class customertype {
    // Customer Dashboard count
    static async fetchCount(dateRange) {
        try {
            let filterQuery
            if (dateRange === 'This Month') {
                filterQuery = `(created_on >= DATE_FORMAT(NOW(), '%Y-%m-01') AND created_on < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, '%Y-%m-01'))`
            } else if (dateRange === 'Last Month') {
                filterQuery = `(created_on >= DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01') AND created_on < DATE_FORMAT(NOW(), '%Y-%m-01'))`
            } else if (dateRange === 'This Quarter') {
                filterQuery = `(created_on >= DATE_FORMAT(NOW(), '%Y-%m-01') AND created_on < DATE_FORMAT(NOW() + INTERVAL 1 QUARTER, '%Y-%m-01'))`
            } else if (dateRange === 'Last Quarter') {
                filterQuery = `(created_on >= DATE_FORMAT(NOW() - INTERVAL 1 QUARTER, '%Y-%m-01') AND created_on < DATE_FORMAT(NOW(), '%Y-%m-01'))`
            } else if (dateRange === 'This Year') {
                filterQuery = `(created_on >= DATE_FORMAT(NOW(), '%Y-01-01') AND created_on < DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-01-01'))`
            } else if (dateRange === 'Last Year') {
                filterQuery = `(created_on >= DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-01-01') AND created_on < DATE_FORMAT(NOW(), '%Y-01-01'))`
            } else {
                //if nothing works filter as this month
                filterQuery = `(created_on >= DATE_FORMAT(NOW(), '%Y-%m-01') AND created_on < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, '%Y-%m-01'))`
            }

            const result = await dbQueryPromise(`SELECT
                COALESCE(COUNT(*), 0) AS total_count,
                COALESCE(SUM(CASE WHEN customerType = 'endUser' THEN 1 ELSE 0 END), 0) AS endUser,
                COALESCE(SUM(CASE WHEN customerType = 'channelPartner' THEN 1 ELSE 0 END), 0) AS channelPartner,
                COALESCE(SUM(CASE WHEN customerType = 'reseller' THEN 1 ELSE 0 END), 0) AS reseller
                FROM
                tb_customers WHERE ${filterQuery};`);
            console.log(result);
            return result;
        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
}

module.exports = { customertype: customertype };