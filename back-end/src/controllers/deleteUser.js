const { deleteUser } = require('../models/deleteUser')
require('../config/env')
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Delete User using Email
exports.delete_User = async (req, res) => {
    try {
        let email = req.body.email;
        email = email.toLowerCase();
        logger.info('Executing User Delete API');

        // Fetching user details using email
        const fetchUser = await deleteUser.fetchuser(email);
        if (fetchUser.length > 0) {
            // Deleting user using email
            const deleteResult = await deleteUser.deleteuser(email);
            if (deleteResult >= 0) {
                if (deleteResult[0] !== 0) {
                    logger.info('Delete User', email);
                    res.status(200).json({ status: true, message: 'User Deleted Successfully' });
                } else {
                    res.status(400).json({ status: false, message: 'Deleting SuperAdmin is not possible' });
                }
            } else {
                res.status(400).json({ status: false, message: 'Error deleting user' });
            }
        } else {
            res.status(400).json({ status: false, message: 'Email not found' });
        }
    } catch (outerError) {
        logger.error(outerError);
        console.error('Error deleting user:', outerError);
    }
};