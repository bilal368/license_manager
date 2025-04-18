const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { userlogin } = require('../models/userLogin');
const { JwtToken } = require('../utils/jwttoken')
require('../config/env');
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// User Login
exports.userlogin = async (req, res) => {
    try {
        logger.info('Executing userlogin API');
        let email = req.body.email;
        email = email.toLowerCase();
        const password = req.body.password;

        // Fetch user details
        const userdetails = await userlogin.fetchuserdetails(email);

        if (userdetails.length > 0) {
            // Hash input password
            const inputPassword = crypto.createHash('sha256').update(password).digest('hex');
            const Og_password = userdetails[0].password;
            const userName = userdetails[0].userName
            const userId = userdetails[0].userId
            const role = userdetails[0].role
            if (inputPassword === Og_password) {
                // Generate Jwt token
                const data = { email: email, password: password, userName: userName,userId:userId,role:role }
                const token = JwtToken.userlogin(data)

                // Update Token with email
                await userlogin.updatetoken(token, email);
                res.status(200).json({ status: true, message: "User login successful", Token: token });
            } else {
                res.status(400).json({ status: false, message: "Password is incorrect" });
            }
        } else {
            res.status(400).json({ status: false, message: "User email is incorrect" });
        }
    } catch (error) {
        logger.error(error);
        console.error("Error:", error);
    }
};