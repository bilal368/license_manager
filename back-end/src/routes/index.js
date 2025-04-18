const express = require('express');
const router = express.Router();
const auth = require('../auth/middleware');
const { UserAuth, constauth } = auth;

const usercreation = require('../controllers/userCreation')
const userlogin = require('../controllers/userLogin')
const generateLicense = require('../controllers/generateLicense')
const updateLicense = require('../controllers/updateLicense')
const deleteUser = require('../controllers/deleteUser')
const customercreation = require('../controllers/customerCreation')
const dealercreation = require('../controllers/dealerCreation')
const forgotpassword = require('../controllers/forgotPassword')
const encryption = require('../controllers/encryption')

// Routes
// License Users API
router.post("/generate_user", UserAuth, usercreation.generate_user);
router.post("/userupdate",UserAuth, usercreation.userupdate);
router.post("/passwordChange",UserAuth, usercreation.passwordChange);
router.delete("/deleteuser", UserAuth, deleteUser.delete_User);
router.get("/fetchusers", UserAuth, usercreation.fetchusers);
router.post("/forgotpassword", constauth, forgotpassword.forgotpassword);
// EndCustomers API
router.post("/customercreation",UserAuth, customercreation.customercreation);
router.post("/customerupdate",UserAuth, customercreation.customerupdate);
router.delete("/customerdelete",UserAuth, customercreation.customerdelete);
router.get("/fetchcustomers",UserAuth, customercreation.fetchcustomers);
// Dealers API
router.post("/dealercreation",UserAuth, dealercreation.dealercreation);
router.post("/dealerupdate",UserAuth, dealercreation.dealerupdate);
router.delete("/dealerdelete",UserAuth, dealercreation.dealerdelete);
router.get("/fetchdealers",UserAuth, dealercreation.fetchdealers);
// Users Internal API
router.post("/userLogin", constauth, userlogin.userlogin);
router.post("/generateLicense",UserAuth, generateLicense.generateLicense);
router.post("/updateLicense", UserAuth, updateLicense.updateLicense);
router.post("/regionupdate",UserAuth, dealercreation.regionupdate);
router.post("/generatepassword", constauth, forgotpassword.generatepassword);
router.post("/decryption", UserAuth, encryption.encryption);

module.exports = router;