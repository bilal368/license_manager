const { Logger } = require('../../utils/logger');
const logger = Logger.logger;

const { customertype } = require('../../models/license/customerType')

// Customer Dashboard count
exports.customertype = async (req, res) => {
    try {
        const dateRange = req.query.dateRange
        const customerType = await customertype.fetchCount(dateRange);
        res.status(200).json({status:true,customerType})
    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}