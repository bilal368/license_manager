const { forgotpassword } = require('../models/forgotPassword')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const apiSecret = process.env.AUTHORIZATION_USER
const { Logger } = require('../utils/logger');
const logger = Logger.logger;

// Forget Password
exports.forgotpassword = async (req, res) => {
    try {
        logger.info('Executing forgotpassword API')
        let useremail = req.body.email;
        email = useremail.toLowerCase();

        // Fetching user details using email
        const mailData = await forgotpassword.validateMail(email);

        if (mailData.length > 0) {
            let userId = mailData[0].userId;
            let userName = mailData[0].userName
            // Generate the token with a 30-minute expiration time
            const expirationTime = Math.floor(Date.now() / 1000) + 1800;
            const token = jwt.sign({ userId, exp: expirationTime }, apiSecret);

            // Updating forgetToken
            const updateResult = await forgotpassword.updatetoken(userId, token);

            // Mail send to user
            try {
                const mailResult = await sentMail(userName, useremail, token);

                if (mailResult === true) {
                    res.status(200).send({ status: true, message: 'Mail sent successfully' });
                } else {
                    res.status(400).send({ status: false, message: 'An unexpected error occurred while sending the email.' });
                }
            } catch (error) {
                console.error('Error:', error);
                logger.error(error);
                res.status(400).send({ status: false, message: 'An unexpected error occurred while sending the email(catch).' });
            }
        } else {
            res.status(404).send({ status: false, message: 'Username does not exist' });
        }
    } catch (error) {
        logger.error(error);
        console.error('Error:', error);
    }
}

// Mail send to set password
async function sentMail(userName, email, token) {
    try {
        let fieldheader = "<p>https://dglicensetracker.xlogix.ca/resetPassword/" + token + "</p><br>";
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use the Gmail service
            auth: {
                user: 'speechlogixemailalert@gmail.com',
                pass: 'wedc rtlv xwtg ywva',  // Your Gmail password or an application-specific password if you have 2-factor authentication enabled
            },
        });

        try {
            let info = await transporter.sendMail({
                from: '"License Tracker" <speechlogixemailalert@gmail.com>',
                to: email,
                subject: 'Reset password',
                text: 'Reset password',
                html: `
                <p><strong>Hi ${userName},</strong></p>
                <p>We have received a request to regenerate your password for License Tracker.</p>
                <p>To proceed with the password regeneration process, please click on the following link:</p>

                ${fieldheader}

                <p>Once you click the link, you will be directed to a page where you can reset your new password.</p>
                <p><strong>Note: If you did not initiate this request or believe it was a mistake, you can safely ignore this email.</strong></p>
                <p>If you have any questions or need further assistance, please feel free to reach out to us.</p>
                <p>Thanks,</p>
                <p>Speechlogix Team</p>
                `,
            });

            console.log('Message sent: %s', info);
            return true;
        } catch (error) {
            logger.error(error);
            console.error('Error sending email:', error);
            return false;
        }
    } catch (error) {
        logger.error(error);
        console.error(error);
    }
}

//Reset password using Token API
exports.generatepassword = async (req, res) => {

    try {
        logger.info('GeneratePassword')
        let password = req.body.password;

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must have at least 8 characters' });
        }

        // Check for at least 1 letter and 1 number
        if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ message: 'Password must have at least 1 letter and 1 number' });
        }

        // Check for both uppercase and lowercase characters
        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
            return res.status(400).json({ message: 'Password must include both uppercase and lowercase characters' });
        }

        // Check for consecutive characters
        if (/(\w)\1{3}/.test(password)) {
            return res.status(400).json({ message: 'Password must not contain 4 consecutive characters' });
        }

        // password = utils.sha256(password);
        password = crypto.createHash('sha256').update(password).digest('hex');

        let token = req.body.token;
        //Jwt verification
        const decodedToken = jwt.verify(token, apiSecret);
        const { loginId, exp } = decodedToken;
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp > currentTime) {
            // Token is not expired
            console.log('Token is not expired.');
            // Fetch user details using token
            const autheticateUserStatus = await forgotpassword.fetchuserdetails(token);

            if (autheticateUserStatus[0] !== undefined) {
                let userId = autheticateUserStatus[0].userId;
                let email = autheticateUserStatus[0].emailId;

                if (autheticateUserStatus.length !== 0) {
                    const updatetoken = jwt.sign({ email: email, userId: userId }, apiSecret);

                    // Update password using token
                    const loginUpdateStatus = await forgotpassword.Updatepassword(password, updatetoken, token);

                    if (loginUpdateStatus) {
                        res.status(200).json({ status: true, message: 'User updated successfully' });
                    } else {
                        res.status(404).json({ status: false, message: 'User update failed' });
                    }
                } else {
                    res.status(400).json({ status: false, message: 'User not found' });
                    console.log('User not found');
                }
            } else {
                console.log('Token has expired as a new token created');
                res.status(401).json({ status: false, message: 'Token has expired as a new token created' });
            }
        } else {
            // Token is expired
            console.log('Token has expired.');
            res.status(401).json({ status: false, message: 'Token has expired.' });
        }
    } catch (e) {
        console.log('error: ' + e);
        logger.error(e);
    }
}