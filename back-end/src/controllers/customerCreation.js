const { Logger } = require('../utils/logger');
const logger = Logger.logger;

const { usercreate } = require('../models/customerCreation')

// Inserting endUser details
exports.customercreation = async (req, res) => {
    try {
        
        
        const email = req.body.dealerdetails.emailId;
        const data = req.body.dealerdetails;
        if (data.emailId != undefined) {
            data.emailId = email.toLowerCase();
            // if (!emailRegex.test(email)) {
            //     res.status(400).send({ status: false, message: 'Invalid email format.' });
            //     return;
            // }
        }
        

        logger.info('Executed Create Customer API');

        // Insert user details
        const insertResult = await usercreate.insertcustomer(data);

        if (insertResult > 0) {
            res.status(200).json({ status: true, message: 'The new customer is added successfully' });
        } else {
            res.status(400).json({ status:false, message: 'Error in the given data' });
        }
    } catch (outerError) {
        logger.error(outerError);
        console.error('Error querying Customer data:', outerError);
    }
};
// Updating endUser details
exports.customerupdate = async (req, res) => {
    try {
        const email = req.body.dealerdetails.emailId;
        const data = req.body.dealerdetails;
        data.emailId = email.toLowerCase();

        logger.info('Executed Create Customer API');

        // Insert user details
        const updateResult = await usercreate.updatecustomer(data);

        if (updateResult.affectedRows > 0) {
            res.status(200).json({ status: true, message: 'The customer updated successfully' });
        } else {
            res.status(400).json({ status:false, message: 'Error in the given data' });
        }
    } catch (outerError) {
        logger.error(outerError);
        console.error('Error querying Customer data:', outerError);
    }
};
// Deleting EndUser
exports.customerdelete = async (req, res) => {
    try {
        const customerCode = req.body.customerCode
        logger.info('Delete EndUser')

        // Deleting EndUser using customerCode
        const deleteCustomer = await usercreate.deletecustomer(customerCode);

        if (deleteCustomer.affectedRows > 0) {
            res.status(200).json({ status: true, message: 'Customer deleted successfully' });
        } else {
            res.status(400).json({ status:false, message: 'Error No data' });
        }
    }
    catch (outerError) {
        logger.error(outerError);
        console.error('Error querying EndUser data:', outerError);
    }
}
// Fetching EndUser Details
exports.fetchcustomers = async (req, res) => {
    try {

        logger.info('Executed Customer details API');

        // Fetching EndUser Details
        const customers = await usercreate.fetchcustomer();

        if (customers.length > 0) {
            res.status(200).json({ status: true,customers });
        } else {
            res.status(400).json({ status:false, message: 'Error fetching customer user data' });
        }
    } catch (outerError) {
        logger.error(outerError);
        console.error('Error querying user data:', outerError);
    }
};

