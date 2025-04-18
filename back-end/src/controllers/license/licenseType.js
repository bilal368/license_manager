const { Logger } = require('../../utils/logger');
const logger = Logger.logger;

const { licensetype } = require('../../models/license/licenseType')

// License Types Count
exports.licensetype = async (req, res) => {
    try {
        const dateRange = req.query.dateRange
        const licensecount = await licensetype.fetchtype(dateRange);
        res.status(200).json({status:true,licensecount})
    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}

// License internal features
exports.projectFeature = async (req, res) => {
    try {
        const BasicFeatures = await licensetype.fetchFeatures();
        const Features = BasicFeatures[0]
        res.status(200).json({status:true,Features})
    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}