const util = require('util');
const db = require('../config/dbconnection');
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class deleteUser {
    // Fetching User
    static fetchuser = async function (email) {
        try {
            const data = await dbQueryPromise('SELECT emailId, phone FROM tb_users WHERE emailId = ?;', [email]);

            const userData = data.length > 0 ? Object.assign({}, data[0]) : null;
            return userData ? [userData] : [];
        } catch (error) {
            console.error('Error querying user data:', error);
            logger.error(error);
            return [];
        }
    };
    // Deleting user
    static deleteuser = async function (email) {
        try {
            const data = await dbQueryPromise('DELETE FROM tb_users WHERE type != "SuperAdmin" AND emailId = ?;', [email]);
            const userData = data.affectedRows;
            return [userData];
        } catch (error) {
            console.error('Error deleting user data:', error);
            logger.error(error);
            return [];
        }
    }
}

module.exports = { deleteUser: deleteUser }