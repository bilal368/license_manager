const util = require('util');
const db = require('../config/dbconnection')
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Promisify the db.query function
const dbQueryPromise = util.promisify(db.query).bind(db);

class dealercreate {
    // Insert dealer details
    static insertdealer = async function (data) {
        try {
            const dealerName = data.dealerName;
            const address1 = data.address1;
            const address2 = data.address2;
            const city = data.city;
            const state = data.state;
            const postalCode = data.postalCode;
            // const country = data.country;
            const country = data.regionId;
            const customerType = data.customerType;
            const contactNum = data.contactNum;
            const alternateContactNum = data.alternateContactNum;
            let emailId = data.emailId;
            const regionId = data.regionId;
            const userId = data.userId;
            let isActive = data.isActive;

            if (emailId != undefined) {
                emailId = emailId.toLowerCase();
            }
            // const fetchemailId = await dbQueryPromise('SELECT emailId, FROM tb_dealers ORDER BY created_on DESC LIMIT 1;');

            const result = await dbQueryPromise('SELECT dealer_id FROM tb_dealers ORDER BY created_on DESC LIMIT 1;');
            let dealer_id = result.length > 0 ? result[0].dealer_id + 1 : 1;
            let dealerCode = `${dealerName}_${dealer_id}`;

            const insertResult = await dbQueryPromise(
                `INSERT INTO tb_dealers(dealerCode,dealerName,address1,address2,address3,city,state,postalCode,
                    country,customerType,contactNum,alternateContactNum,emailId,regionId,isActive,created_on,userId) 
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?)`,
                [
                    dealerCode,
                    dealerName,
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
            console.error('Error inserting dealer data:', error);
            logger.error(error);
        }
    }
    // Update dealer
    static updatedealer = async function (data) {
        try {
            const dealerName = data.dealerName;
            const address1 = data.address1;
            const address2 = data.address2;
            const city = data.city;
            const state = data.state;
            const postalCode = data.postalCode;
            // const country = data.country;
            const country = data.regionId;
            const customerType = data.customerType;
            const contactNum = data.contactNum;
            const alternateContactNum = data.alternateContactNum;
            const emailId = data.emailId;
            const regionId = data.regionId;
            const userId = data.userId;
            const dealerCode = data.dealerCode


            const updateResult = await dbQueryPromise(
                `update tb_dealers set dealerName = ?,address1 = ? , address2 = ?, city = ?, state = ?, postalCode = ?, country = ?,regionId=?,
                customerType = ?, contactNum= ?, alternateContactNum = ?, emailId = ?,userId = ?
                 where dealerCode = ?;`,
                [
                    dealerName,
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
                    dealerCode
                ]
            );
            return updateResult;
        } catch (error) {
            console.error('Error Updating dealer data:', error);
            logger.error(error);
        }
    }
    // Delete dealer
    static deletedealer = async function (dealerCode) {
        try {
            const dealercode = dealerCode;
            const result = await dbQueryPromise("DELETE FROM tb_dealers WHERE dealerCode = ?;", [dealercode]);
            return result
        } catch (error) {
            console.error('Error deleting dealer data:', error);
            logger.error(error);
        }
    }
    // Updating region to tb_region table
    static insertregion = async function (data) {
        try {
            const regionName = data.regionName.toUpperCase();
            if (regionName == '') {
                return -1;
            }
            const result = await dbQueryPromise('SELECT regionName FROM tb_regions where regionName=?', [regionName]);

            if (result.length > 0) {
                let region_name = Object.assign({}, result[0]);
                return [region_name];
            } else {
                const insertResult = await dbQueryPromise(
                    `INSERT INTO tb_regions(regionName) VALUES (?)`,
                    [regionName]
                );

                return insertResult.insertId;
            }
        } catch (error) {
            console.error('Error inserting region data:', error);
            logger.error(error);
        }
    }
    // Fetch dealer details
    static Fetchdealers = async function () {
        try {
            const dealers = await dbQueryPromise(`SELECT dealerCode, dealerName, address1, address2, city, country, contactNum, customerType, postalCode, emailId, alternateContactNum, regionID, state FROM tb_dealers`);
            return dealers;

        } catch (error) {
            console.error('Error fetching dealer data:', error);
            logger.error(error);
            return '';
        }
    }
}

module.exports = { dealercreate: dealercreate }