const util = require('util');
const db = require('../config/dbconnection');
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class forgotpassword {

    // Fetching users details using emailid 
    static validateMail = async function (email) {
        try {
            const data = await dbQueryPromise('SELECT userId,phone,userName FROM tb_users WHERE emailId=?;', [email]);
            return data;
        } catch (error) {
            console.error('Error querying user data:', error);
            logger.error(error);
            return ;
        }
    }

    // Updating token when we click on forgot password
    static updatetoken = async function (userId, token) {
        try {
            const data = await dbQueryPromise('UPDATE tb_users SET forgetToken = ? WHERE userId = ?', [token, userId]);
            return data.affectedRows;
        } catch (error) {
            console.error('Error updating token:', error);
            logger.error(error);
            return ;
        }
    }

    // Fetch user details to set a new password
    static fetchuserdetails = async function (token) {
        try {
            const data = await dbQueryPromise('SELECT userId, emailId FROM tb_users WHERE forgetToken=?;', [token]);
            return data;
        } catch (error) {
            console.error('Error querying user data:', error);
            logger.error(error);
            return ;
        }
    }

    // Save a new password with a new Token
    static Updatepassword = async function (password, updatetoken, token) {
        try {
            const data = await dbQueryPromise('UPDATE tb_users SET password=?, autheticationToken=?, forgetToken=? WHERE forgetToken=?', [password, updatetoken, updatetoken, token]);
            return data.affectedRows === 1;
        } catch (error) {
            console.error('Error updating password:', error);
            logger.error(error);
            return ;
        }
    }

}

module.exports = { forgotpassword: forgotpassword }