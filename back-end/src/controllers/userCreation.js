const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const apiSecret = process.env.AUTHORIZATION_USER
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

const { usercreate } = require('../models/userCreation')

// Create user
exports.generate_user = async (req, res) => {
    try {
        const username = req.body.userdetails.userName
        const password = req.body.userdetails.password
        const firstName = req.body.userdetails.firstName
        const lastName = req.body.userdetails.lastName
        const phone = req.body.userdetails.phone
        const email = req.body.userdetails.email

        const scriptTagRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
        const sqlInjectionRegex = /\'|"|;|\*|#|%/gi;
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        // const phoneRegex = /^\d{10,15}$/;

        //Username required
        if (!username) {
            res.status(400).send({ status: false, message: 'username is required.' });
            return;
        }

        //First name required
        if (!firstName) {
            res.status(400).send({ status: false, message: 'First name is required.' });
            return;
        }

        //Last name required
        if (!lastName) {
            res.status(400).send({ status: false, message: 'Last name is required.' });
            return;
        }

        //Phone number required
        if (!phone) {
            res.status(400).send({ status: false, message: 'Phone number is required.' });
            return;
        }

        //Email should be correct format
        if (!emailRegex.test(email)) {
            res.status(400).send({ status: false, message: 'Invalid email format.' });
            return;
        }

        //First name not too long
        if (firstName.length > 50) {
            res.status(400).send({ status: false, message: 'First name is too long.' });
            return;
        }

        //Last name not too long
        if (lastName.length > 50) {
            res.status(400).send({ status: false, message: 'Last name is too long.' });
            return;
        }

        //Phone number should be interger between 10-15
        // if (!phoneRegex.test(phone)) {
        //     res.status(400).send({ status:false, message: 'Phone number must be minimum 10 digits and maximum 15 digits and should only contain integers' });
        //     return;
        // }

        //Password validation
        if (password.length < 8) {
            return res.status(400).send({ status: false, message: 'Password must have at least 8 characters' });
        }

        //Name Does not contain script tags and SQL injection
        if (scriptTagRegex.test(firstName) || scriptTagRegex.test(lastName)) {
            res.status(400).send({ status: false, message: 'First or last name cannot contain script tags.' });
            return;
        }
        if (sqlInjectionRegex.test(lastName) || sqlInjectionRegex.test(firstName)) {
            res.status(400).send({ status: false, message: 'First or last name cannot contain SQL injection characters.' });
            return;
        }

        // Check for at least 1 letter and 1 number
        if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).send({ status: false, message: 'Password must have at least 1 letter and 1 number' });
        }

        // Check for both uppercase and lowercase characters
        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
            return res.status(400).send({ status: false, message: 'Password must include both uppercase and lowercase characters' });
        }

        // Check for consecutive characters
        if (/(\w)\1{3}/.test(password)) {
            return res.status(400).send({ status: false, message: 'Password must not contain 4 consecutive characters' });
        }

        const token = jwt.sign({ email: email }, apiSecret);
        req.body.userdetails.token = token
        req.body.userdetails.hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        let data = req.body.userdetails
        data.email = email.toLowerCase();

        //Insert user details
        try {
            const result = await usercreate.insertuser(data);
            if (result > 0) {
                res.status(200).json({ status: true, message: "User inserted Successfully" });
            } else {
                logger.error(result);
                console.log("err", result);
                res.status(409).json({ status: false, message: "Duplicate entry" });
            }
        } catch (error) {
            logger.error(error);
            console.error(error);
        }
    } catch (error) {
        logger.error(error)
        console.error(error);
    }
}
// Update user
exports.userupdate = async (req, res) => {
    try {
        const data = req.body.userdetails
        const password = req.body.userdetails.password
        let updateResult
        if (password == undefined) {
            // update user without password details
            updateResult = await usercreate.updateuser(data);
        } else {
            // update user with password details
            data.hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            updateResult = await usercreate.updateuser_withPassword(data);
        }
        logger.info('User Updates')

        if (updateResult.affectedRows > 0) {
            res.status(200).json({ status: true, message: 'The User is updated successfully' });
        } else {
            res.status(400).json({ status: false, message: 'Error in the given data' });
        }
    }
    catch (outerError) {
        logger.error(outerError);
        console.error('Error querying user data:', outerError);
    }
}
// Fetch User
exports.fetchusers = async (req, res) => {
    try {
        const UserId = req.query.UserId
        logger.info('Executed Create User API');

        // Insert user details
        const users = await usercreate.fetchusers(UserId);

        if (users.length > 0) {
            res.status(200).json({ status: true, users });
        } else {
            res.status(400).json({ status: false, message: 'Error fetching customer user data' });
        }
    } catch (outerError) {
        logger.error(outerError);
        console.error('Error Fetching user data:', outerError);
        res.status(400).json({ message: outerError.message || 'Error inserting user data' });
    }
};
// Password Change
exports.passwordChange = async (req, res) => {
    try {
        const userId = req.body.userdetails.UserId;
        const oldpassword = req.body.userdetails.oldPassword;
        const newpassword = req.body.userdetails.newPassword;
        const inputencrpyted = crypto.createHash('sha256').update(oldpassword).digest('hex');
        const newencrpyted = crypto.createHash('sha256').update(newpassword).digest('hex');
        if (userId == null) {
            return res.status(400).json({ message: 'userId id is null' });
        }

        // Check password length
        if (newpassword.length < 8) {
            return res.status(400).json({ message: 'Password must have at least 8 characters' });
        }

        // Check for at least 1 letter and 1 number
        if (!/[a-zA-Z]/.test(newpassword) || !/[0-9]/.test(newpassword)) {
            return res.status(400).json({ message: 'Password must have at least 1 letter and 1 number' });
        }

        // Check for both uppercase and lowercase characters
        if (!/[a-z]/.test(newpassword) || !/[A-Z]/.test(newpassword)) {
            return res.status(400).json({ message: 'Password must include both uppercase and lowercase characters' });
        }

        // Check for consecutive characters
        if (/(\w)\1{3}/.test(newpassword)) {
            return res.status(400).json({ message: 'Password must not contain 4 consecutive characters' });
        }

        const loginUpdateStatus = await usercreate.getpassword_with_userId(userId)
        if (loginUpdateStatus) {
            const encryptedPassword = loginUpdateStatus[0].password;

            if (encryptedPassword == inputencrpyted) {
                if (encryptedPassword == newencrpyted) {
                    res.status(400).json({ status: false, message: "Old password and New password cannot be same" });
                }
                else {
                    const loginUpdateStatus = await usercreate.updatepassword_with_userId(newencrpyted, userId)
                    if (loginUpdateStatus) {
                        res.json({ status: true, message: "The new password  is set. Please re-login." });
                    }
                    else {
                        res.status(400).json({ status: false, message: "User password update failed" });
                    }
                }
            }
            else {
                res.status(400).json({ status: false, message: "Old password is incorrect" });
            }
        }
        else {
            res.status(400).json({ status: false, message: "Password update failed" });
        }
    } catch (error) {
        logger.error(error)
        console.error("Error in passwordchange:", error);
    }
};