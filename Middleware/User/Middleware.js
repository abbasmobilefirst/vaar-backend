const jwt = require('jsonwebtoken');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + './../../.env') });


//utils


const { decryptToken } = require("../../utils/othermethods/Method");




exports.isAuthenticated = async (req, res, next) => {
    try {

        //id no authorization header
        if (req.headers.authorization == undefined) {
            throw Error('Invalid Token');
        }
        else {

            //taking token from header
            let jwtToken = req.headers.authorization;
            let tokenArray = jwtToken.split(" ");

            //decrypting token 
            let decrypt = decryptToken(tokenArray[1]);

            //verifying it
            var data = jwt.verify(decrypt, process.env.ACCESS_SECRET);

            //adding data came from token to request
            //will be used in controllers
            req.email = data.email;
            req.id = data.userId;

            //moving ahead
            next();
        }
    }
    catch (err) {
        
        res.status(401).json({
            "isSuccess": false,
            "message": "Invalid Token"
        });
    }
}


exports.isRefreshAuthenticated = async (req, res, next) => {
    try {

        //id no authorization header
        if (req.headers.authorization == undefined) {
            throw Error('Invalid Token');
        }
        else {

            //taking token from header
            let jwtToken = req.headers.authorization;
            let tokenArray = jwtToken.split(" ");

            //decrypting token 
            let decrypt = decryptToken(tokenArray[1]);

            //verifying it
            var data = jwt.verify(decrypt, process.env.REFRESH_SECRET);

            //adding data came from token to request
            //will be used in controllers
            req.email = data.email;
            req.id = data.userId;

            //moving ahead
            next();
        }
    }

    //General Error Handling
    catch (error) {
        warn("Invalid Token", null, 401, "Error from middleWare", "223.226.216.174");

        return res.status(401).json({
            "isSuccess": false,
            "data": {},
            "message": "Invalid Token"
        });
    }
}

exports.decryptionToken = (req,res, next) => {
    try {
        
        let jwtToken = req.headers.authorization;
        
        let tokenArray = jwtToken.split(" ");
        

        //decrypting token 
        let decrypt = decryptToken(tokenArray[1]);

        //verifying it
        var data = jwt.verify(decrypt, process.env.ACCESS_SECRET);
         req.id = data.id;
        
        next()
        //moving ahead
        // res.status(200).json({
        //     "isSuccess": true,
        //     "message": "OK"
        // });
    }
    catch (err) {
       
        res.status(401).json({
            "isSuccess": false,
            "message": "Invalid Token"
        });
    }   
}