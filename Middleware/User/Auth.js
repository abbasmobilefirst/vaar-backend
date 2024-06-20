const jwt = require('jsonwebtoken');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname + './../../.env') });
// Middleware function to extract _id from access token



exports.isAuthenticated = (req, res, next) => {
      try{

        const { accessToken } = req.cookies;

        if (!accessToken) {
          return res.status(401).json({
            isSuccess: false,
            data: {},
            message: 'Access token not found',
          });
        }

        const accessSecret = process.env.ACCESS_SECRET;

        // Verify the access token
        const decodedToken = jwt.verify(accessToken, accessSecret);

        // Set the _id in the req object
        req.userId = decodedToken.userId;

        next();        

      }
        catch(err){
          
            res.status(500).json({
                isSuccess: false,
                message: "Internal Server Error"
            });
            }
        }

exports.isAdminAuthenticated = (req, res, next) => {
        try{
    
            const { accessToken } = req.cookies;
    
            if (!accessToken) {
            return res.status(401).json({
                isSuccess: false,
                data: {},
                message: 'Access token not found',
            });
            }
    
            const accessSecret = process.env.ACCESS_SECRET;
    
            // Verify the access token
            const decodedToken = jwt.verify(accessToken, accessSecret);
    
            // Set the _id in the req object
            req.userId = decodedToken.userId;
    
            next();        
    
        }
            catch(err){
           
                res.status(500).json({
                    isSuccess: false,
                    message: "Internal Server Error"
                });
                }
            }
            
