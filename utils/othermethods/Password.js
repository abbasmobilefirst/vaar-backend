const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + './../../.env') });
const jwt = require('jsonwebtoken');


const SecurePassword = (plainPassword, salt) => {
 
  return crypto.createHmac('sha256', salt)
        .update(plainPassword)
        .digest('hex')
}
const Authentication = (plainPassword, salt, e_password) => {

  let encrypt = crypto.createHmac('sha256', salt)
        .update(plainPassword)
        .digest('hex')
     

  if (encrypt === e_password) {
        return true;
  }
  else {
        return false;
  }
}


function generateAccessSecret() {
  return crypto.randomBytes(32).toString('hex');
}

function generateRefreshSecret() {
  return crypto.randomBytes(32).toString('hex');
}





// Middleware function to extract _id from access token
const extractUserIdFromToken = (req, res, next) => {
  try {
    // Get the access token from the request headers or cookies
    const accessToken = req.headers.authorization || req.cookies.accessToken;
 

    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const accessSecret = process.env.ACCESS_SECRET;

    // Verify the access token
    const decodedToken = jwt.verify(accessToken, accessSecret);

    // Set the _id in the req object
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      isSuccess: false,
      data: {},
      message: 'Invalid access token',
    });
  }
};










module.exports = {
  generateAccessSecret,
  generateRefreshSecret,
  SecurePassword,
  Authentication,
  extractUserIdFromToken
};