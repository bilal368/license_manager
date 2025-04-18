const { Logger } = require('../../utils/logger');
const logger = Logger.logger;

const { license } = require('../../models/license/licenseCount')

// Fetching the total count license
exports.fetchlicense = async (req, res) => {
    try {
        const dateRange = req.query.dateRange
        const licensecount = await license.fetchCount(dateRange);
        res.status(200).json({status:true,licensecount})
    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}