const util = require('util');
const db = require('../config/dbconnection');
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Promisify the db.query method
const dbQueryPromise = util.promisify(db.query).bind(db);

class userlogin {
    // Fetch Users details
    static fetchuserdetails = async function (email) {
        try {
            const data = await dbQueryPromise("SELECT emailId, password, phone,userName,userId,role FROM tb_users WHERE emailId = ?", [email]);
            return data;
        } catch (error) {
            logger.error(error);
            console.error("Error querying user data:", error);
            return [];
        }
    };
    // Updating new token while login user
    static updatetoken = async function (token, email) {
        try {
            const data = await dbQueryPromise("UPDATE tb_users SET autheticationToken = ? WHERE emailId = ?", [token, email]);
            return data;
        } catch (error) {
            logger.error(error);
            console.error("Error querying user data:", error);
            return [];
        }
    }
}

module.exports = { userlogin: userlogin }