const jwt = require('jsonwebtoken');
const { user } = require("../../Models/User/User");
const { decryptToken } = require("../../utils/othermethods/Method");


require('dotenv').config({ path: __dirname + '/.env' });

exports.isAdminAuthenticated = async (req, res, next) => {
  try {
 
  

    // Check if authorization header exists
    if (!req.headers.authorization) {
      throw new Error("Invalid Token");
    }

    // Get the token from the authorization header
    const jwtToken = req.headers.authorization;
    const tokenArray = jwtToken.split(" ");
    const decryptedToken = decryptToken(tokenArray[1]);
   

    // Verify the decrypted token
    const data = jwt.verify(decryptedToken, process.env.ADMIN_ACCESS_SECRET);
  
 

  
    const foundUser = await user.findOne({ email: data.email, Role: 2 }).lean();
 


    if (!foundUser) {
      return res.status(401).json({
        isSuccess: false,
        data: {},
        message: "Invalid Token",
      });
    }

    // Add token data to request
    req.email = data.email;
    req.id = data.userId;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    
    return res.status(401).json({
      isSuccess: false,
      data: {},
      message: "Invalid Token",
    });
  }
};
