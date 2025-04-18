const apiKey = process.env.API_KEY;
const apiSecret = process.env.AUTHORIZATION_USER;
const jwt = require('jsonwebtoken');

class JwtToken {
  // JWT Token Generation Function
  static genToken(tokenDetails) {
    const days = tokenDetails.ed; // expiry_days
    const payload = {
      amc: tokenDetails.amc,
      ad: tokenDetails.ad, // ActiveDirectory
      dg: tokenDetails.dg, // DGvox
      sb: tokenDetails.sb, // Speechbill
      if: tokenDetails.if, // internalFeatures
      od: tokenDetails.od, // orderDetails
      iss: apiKey,
      sk: tokenDetails.sk // serialKey
    };
    if (tokenDetails.ed != 0) {
      const expiry_days = days;
      const expTimestamp = new Date().getTime() + (expiry_days * 24 * 60 * 60 * 1000);
      payload.exp = expTimestamp / 1000;
    }
    const token = jwt.sign(payload, apiSecret);
    return token;
  }

  static userlogin(data) {
    // Set the expiration time to 1 hour (60 minutes)
    const expiresIn = 60 * 60;

    const payload = {
      Details: data,
      iss: apiKey,
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    };

    const token = jwt.sign(payload, apiSecret);
    return token;
  }
}

module.exports = { JwtToken: JwtToken }