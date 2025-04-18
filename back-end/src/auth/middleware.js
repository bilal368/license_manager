const jwt = require('jsonwebtoken');
const auth = {};
require('../config/env')
const userApiSecret = process.env.AUTHORIZATION_USER;

auth.UserAuth = async (req, res, next) => {
    try {
        const authheader = req.headers.authorization;
        token = authheader.replace("Bearer ", "");
        // Verify the JWT
        jwt.verify(token, userApiSecret, (err, decoded) => {
            if (err) {
                console.error('JWT verification failed:', err.message);
                res.status(401).json({ status: "Bearer Token used invalid", message: "Invalid Token ID" });
            } else {
                // console.log('Decoded JWT:', decoded);
                next()
            }
        });
    } catch (e) {
        console.log('error: ' + e);
        res.status(401).json({ message: 'Invalid Token ID' });
    }
};


auth.constauth = async (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        constSecret = process.env.AUTHORIZATION_CONSTSECRET
        token = token.replace("Bearer ", "");

        if (token == constSecret) {
            next()
        } else {
            res.status(401).json({ message: 'Invalid Bearer Token' });
        }
    };
}

module.exports = auth;