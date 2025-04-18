const { Logger } = require('../../utils/logger');
const logger = Logger.logger;

const { moduleCount } = require('../../models/license/moduleCount')

// License System count
exports.moduleCount = async (req, res) => {
    try {
        const dateRange = req.query.dateRange
        const modulecount = await moduleCount.fetchtype(dateRange);
        res.status(200).json({status:true,modulecount})
    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}