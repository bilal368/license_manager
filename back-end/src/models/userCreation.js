const util = require('util');
const db = require('../config/dbconnection');
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Promisify the db.query method
const dbQueryPromise = util.promisify(db.query).bind(db);

class usercreate {
    // Create User
    static insertuser = async function (data) {
        try {
            const userName = data.userName;
            const phone = data.phone;
            const Password = data.hashedPassword;
            const firstName = data.firstName;
            const lastName = data.lastName;
            const role = data.role_LRS;
            const email = data.email;
            const type = data.type;
            const token = data.token;

            const insertUserQuery = "INSERT INTO tb_users(userName,phone,password,firstName,lastName,role,emailId,type,autheticationToken) values(?,?,?,?,?,?,?,?,?)";

            // Use await to wait for the completion of the asynchronous db.query
            const result = await dbQueryPromise(insertUserQuery, [userName, phone, Password, firstName, lastName, role, email, type, token]);
            return result.insertId;
        } catch (outerError) {
            logger.error(outerError);
            console.error("Error inserting user data:", outerError);
            return 0;
        }
    }
    // Update dealer
      static updateuser = async function (data) {
        try {
            const userName = data.userName;
            const phone = data.phone;
            const firstName = data.firstName;
            const lastName = data.lastName;
            const role = data.role_LRS;
            const email = data.email;
            const type = data.type;
 
            const updateResult = await dbQueryPromise(
                `update tb_users set userName = ?,phone = ? , firstName = ?, lastName = ?, role = ?, 
                type=? where emailId = ?;`,
                [
                    userName,
                    phone,
                    firstName,
                    lastName,
                    role,
                    type,
                    email
                ]
            );
            return updateResult;
        } catch (error) {
            console.error('Error Updating dealer data:', error);
            logger.error(error);
        }
    }
    // update with password
    static updateuser_withPassword = async function (data) {
        try {
            const userName = data.userName;
            const phone = data.phone;
            const password = data.hashedPassword
            const firstName = data.firstName;
            const lastName = data.lastName;
            const role = data.role_LRS;
            const email = data.email;
            const type = data.type;
 
            const updateResult = await dbQueryPromise(
                `update tb_users set userName = ?,phone = ? , password = ?, firstName = ?, lastName = ?, role = ?, 
                type=? where emailId = ?;`,
                [
                    userName,
                    phone,
                    password,
                    firstName,
                    lastName,
                    role,
                    type,
                    email
                ]
            );
            return updateResult;
        } catch (error) {
            console.error('Error updating user data:', error);
            logger.error(error);
        }
    }
    // Fetch User
    static async fetchusers(UserId) {
        try {
            const result = await dbQueryPromise(`SELECT userId, firstName, lastName, phone, emailId, type, role, userName FROM tb_users WHERE userId != ${UserId} AND type !='SuperAdmin';`);
            return result;
        } catch (error) {
            console.error('Error Fetching user data:', error);
            logger.error(error);
        }
    }
    // Get user password
    static async getpassword_with_userId(userId) {
        try {
            const data = await dbQueryPromise("SELECT password, userName FROM tb_users WHERE userId = ?;", [userId]);
            return data;
        } catch (err) {
            console.error("Error querying user data:", err);
            return false;
        }
    }
    //Update new password in the table
    static async updatepassword_with_userId(newencrpyted, userId) {
        try {
            const data = await dbQueryPromise("UPDATE tb_users SET password=? WHERE userId=?", [newencrpyted, userId]);
            logger.info("User password updated");
            if (data.affectedRows === 1) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error("Error updating password:", err);
            return false;
        }
    }
}

module.exports = { usercreate: usercreate };
