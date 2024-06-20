const {user} = require("../../Models/User/User");
const jwt = require("jsonwebtoken");
const { encryptToken  } = require(".././../utils/othermethods/Method")
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname + "./../../.env") });


const {isAdminAuthenticated} = require("../../Middleware/Admin/Auth");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
   

    // Find user
    const userData = await user.findOne({ email: email, Role: 2 }).lean();
  
    console.log(userData);
    // If user does not exist
    if (!userData) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: "Admin not found",
      });
    }

    // Verify password
    // const isPasswordValid = await verifyPassword(password, userData.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({
    //     isSuccess: false,
    //     data: {},
    //     message: "Invalid Email or password",
    //   });
    // }

    const tokenPayload = {
      email: userData.email,
      Role: userData.Role,
    };


    const accessSecret = process.env.ADMIN_ACCESS_SECRET;

    console.log(accessSecret);
    const accessToken = encryptToken(
      jwt.sign(tokenPayload, accessSecret)
    );

    return res.status(200).json({
      isSuccess: true,
      data: {
        accessToken: accessToken,
        Role: userData.Role,
      },
      message: "Login successful",
    });
  } catch (error) {
   
    return res.status(500).json({
      isSuccess: false,
      data: {},
      message: "Internal Server Error Occurred",
    });
  }
};
