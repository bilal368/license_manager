const { dealercreate } = require('../models/dealerCreation')
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Create new dealer
exports.dealercreation = async (req, res) => {
    try {
        const data = req.body.dealer_details
        logger.info('Create Dealer')
        const email = req.body.dealer_details.emailId
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        //Email should be correct format
        if (email != undefined) {
            if (!emailRegex.test(email)) {
                res.status(400).send({ status: false, message: 'Invalid email format.' });
                return;
            }
        }
        
        // Insert dealer details
        const insertResult = await dealercreate.insertdealer(data);

        if (insertResult > 0) {
            res.status(200).json({ status: true, message: 'The new dealer is added successfully' });
        } else {
            res.status(400).json({ status: false, message: 'Error in the given data' });
        }
    }
    catch (outerError) {
        logger.error(outerError);
        console.error('Error querying dealer data:', outerError);
    }
}
// Update dealer
exports.dealerupdate = async (req, res) => {
    try {
        const data = req.body.dealer_details
        logger.info('Create Dealer')

        // update dealer details
        const updateResult = await dealercreate.updatedealer(data);

        if (updateResult.affectedRows > 0) {
            res.status(200).json({ status: true, message: 'The dealer is updated successfully' });
        } else {
            res.status(400).json({ status: false, message: 'Error in the given data' });
        }
    }
    catch (outerError) {
        logger.error(outerError);
        console.error('Error querying updating dealer data:', outerError);
    }
}
// Delete dealer
exports.dealerdelete = async (req, res) => {
    try {
        const dealerCode = req.body.dealerCode
        logger.info('Deleting Dealer')

        // Insert dealer details
        const deleteDealer = await dealercreate.deletedealer(dealerCode);

        if (deleteDealer.affectedRows > 0) {
            res.status(200).json({ status: true, message: 'Dealer deleted successfully' });
        } else {
            res.status(400).json({ status: false, message: 'Error No data' });
        }
    }
    catch (outerError) {
        logger.error(outerError);
        console.error('Error querying deleting dealer data:', outerError);
    }
}
// Region Update
exports.regionupdate = async (req, res) => {
    try {
        const data = req.body;
        // Inserting RegionName 
        const insertResult = await dealercreate.insertregion(data);
        if (insertResult > 0) {
            res.status(200).json({ status: true, message: 'Region Inserted Successfully' });
        } else if (insertResult == -1) {
            res.status(400).json({ status: false, message: `Any region should be selected` });
        }
        else {
            res.status(400).json({ status: false, message: `${data.regionName} is already inserted` });
        }
    }
    catch (outerError) {
        logger.error(outerError);
        console.error('Error querying region update', outerError);
    }
}
// Fetch dealer details
exports.fetchdealers = async (req, res) => {
    try {
        logger.info('fetch Dealer')
        // fetch dealer details
        const dealers = await dealercreate.Fetchdealers();
        if (dealers.length > 0) {
            res.status(200).json({ status: true, message: 'Fetchdealers', dealers });
        } else {
            res.status(400).json({ status: false, message: 'Error fetching dealers data' });
        }
    }
    catch (outerError) {
        logger.error(outerError);
        console.error('Error querying dealer data:', outerError);
    }
}