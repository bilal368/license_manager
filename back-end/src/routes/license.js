const express = require('express');
const router = express.Router();
const auth = require('../auth/middleware');
const { UserAuth, constauth } = auth;

const licenseCount = require('../controllers/license/licenseCount')
const licenseType = require('../controllers/license/licenseType')
const customeType = require('../controllers/license/customerType')
const moduleCount = require('../controllers/license/moduleCount')
const licenselist = require('../controllers/license/licenseList')
const decryptionController = require('../controllers/encryption')



// Routes

// Fetching the total count license
router.get("/fetchlicense", UserAuth, licenseCount.fetchlicense);
// License System count
router.get("/modulecount", UserAuth, moduleCount.moduleCount);
// Customers Dashboard count
router.get("/custometype", UserAuth, customeType.customertype);
// License Types Count
router.get("/licensetype", UserAuth, licenseType.licensetype);
// Fetching License internal features
router.get("/projectFeature", UserAuth, licenseType.projectFeature);
// Listing license in given date range
router.get("/licenselist", UserAuth, licenselist.licenselist);
// Dealers Details
router.get("/dealerlist", UserAuth, licenselist.dealerlist);
// Customer Details
router.get("/customerlist", UserAuth, licenselist.customerlist);
// Resellers Details
router.get("/resellerslist", UserAuth, licenselist.resellerslist);
// Fetch region
router.get("/region", UserAuth, licenselist.region);
// Fetch flagregion
router.get("/flagregion", UserAuth, licenselist.flagregion);
// delete region
router.delete("/deleteregion", UserAuth, licenselist.deleteregion);
//Fetch version
router.get("/version", UserAuth, licenselist.version);
//Fetch License details
// router.post("/SearchLicense", UserAuth, licenselist.fetchLicense);
router.post("/SearchLicense", UserAuth, licenselist.decryption);
// New Token Decryption
router.post("/newTokenDecryption", UserAuth, licenselist.newTokenDecryption);

module.exports = router;