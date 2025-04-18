const util = require('util');
const db = require('../config/dbconnection');
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class usercreate {
    // Inserting endUser customer
    static async insertcustomer(data) {
        try {
            const customerName = data.customerName;
            const address1 = data.address1;
            const address2 = data.address2;
            const city = data.city;
            const state = data.state;
            const postalCode = data.postalCode;
            const country = data.country;
            const customerType = data.customerType;
            const contactNum = data.contactNum;
            const alternateContactNum = data.alternateContactNum;
            const emailId = data.emailId;
            const regionId = data.regionId;
            const userId = data.userId;

            let isActive = data.isActive;
            let customerId;
            let customerCode;

            const result = await dbQueryPromise('SELECT customerId FROM tb_customers ORDER BY created_on DESC LIMIT 1;');

            if (result.length > 0) {
                customerId = result[0].customerId + 1;
            } else {
                customerId = 1;
            }

            customerCode = `${customerName}_${customerId}`;

            const insertResult = await dbQueryPromise(
                `INSERT INTO tb_customers(customerCode,customerName,address1,address2,address3,city,state,postalCode,
                    country,customerType,contactNum,alternateContactNum,emailId,regionId,isActive,created_on,userId) 
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?)`,
                [
                    customerCode,
                    customerName,
                    address1,
                    address2,
                    address2,
                    city,
                    state,
                    postalCode,
                    country,
                    customerType,
                    contactNum,
                    alternateContactNum,
                    emailId,
                    regionId,
                    isActive,
                    userId,
                ]
            );

            return insertResult.insertId;
        } catch (error) {
            console.error('Error inserting user data:', error);
            logger.error(error);
        }
    }
    // Updating endUser details 
    static async updatecustomer(data) {
        try {
            const customerName = data.customerName;
            const address1 = data.address1;
            const address2 = data.address2;
            const city = data.city;
            const state = data.state;
            const postalCode = data.postalCode;
            const country = data.regionId;
            const customerType = data.customerType;
            const contactNum = data.contactNum;
            const alternateContactNum = data.alternateContactNum;
            const emailId = data.emailId;
            const regionId = data.regionId;
            const userId = data.userId;
            const customerCode = data.customerCode

            const updateResult = await dbQueryPromise(
                `update tb_customers set customerName = ?,address1 = ? , address2 = ?, city = ?, state = ?, postalCode = ?, country = ?,regionId=?,
                customerType = ?, contactNum= ?, alternateContactNum = ?, emailId = ?,userId = ?
                 where customerCode = ?;`,
                [
                    customerName,
                    address1,
                    address2,
                    city,
                    state,
                    postalCode,
                    country,
                    regionId,
                    customerType,
                    contactNum,
                    alternateContactNum,
                    emailId,
                    userId,
                    customerCode
                ]
            );
            return updateResult;
        } catch (error) {
            console.error('Error updating customer data:', error);
            logger.error(error);
        }
    }
    // Deleting EndUser
    static deletecustomer = async function (customerCode) {
        try {
            const customercode = customerCode;
            const result = await dbQueryPromise("DELETE FROM tb_customers WHERE customerCode = ?;", [customercode]);
            return result
        } catch (error) {
            console.error('Error deleting EndUser data:', error);
            logger.error(error);
        }
    }
    // Fetching EndUser Details
    static async fetchcustomer() {
        try {
            const result = await dbQueryPromise('SELECT customerCode, customerName, address1, address2, city, country, contactNum, customerType, postalCode, emailId, alternateContactNum, regionId, state FROM tb_customers;');
            return result;
        } catch (error) {
            console.error('Error fetching EndUser data:', error);
            logger.error(error);
        }
    }
}

module.exports = { usercreate: usercreate };
