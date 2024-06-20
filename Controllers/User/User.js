const { user } = require("../../Models/User/User");

const validator = require("email-validator");

const { extractUserIdFromToken } = require("../../utils/othermethods/Password");
const {
  encryptToken,
  decryptToken,
} = require("../../utils/othermethods/Method");

const {
  Authentication,
  SecurePassword,
} = require("../../utils/othermethods/Password");

const { v4: uuidv4 } = require("uuid");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "./../../.env") });

const { UserInvestment } = require("../../Models/User/UserInvestment");
const { Document } = require("../../Models/User/Documents");
const { SendEmailWithConfirmation } = require("../../utils/aws");

// const { info, warn } = require("../../utils/logger/logger");

var jwt = require("jsonwebtoken");

// ...
const randomstring = require("randomstring");

const { Property } = require("../../Models/User/Property");

const statePostalCodeMap = require("../../utils/othermethods/statesPostalMap")

const send = require("send");

exports.CreateUser = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      mobileNumber,
      firstName,
      lastName,
      passphrase,
    } = req.body;

    console.log(req.body);

    if (!username) {
      req.body.username = req.body.email;
    }

    if (!email) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Email is empty",
      });
    }
    if (!password) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Password is empty",
      });
    }
    if (!mobileNumber) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "MobileNumber is empty",
      });
    }
    if (!firstName) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "FirstName is empty",
      });
    }
    if (!lastName) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "LastName is empty",
      });
    }
    if (!passphrase) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Passphrase is empty",
      });
    }

    let verifiedUser = await user
      .findOne({
        $and: [{ email: email }, { isVerified: true }],
      })
      .lean();

    if (verifiedUser) {
      return res.status(400).json({
        isSuccess: false,
        message: "User already exist",
      });
    }

    let existingUser = await user.findOne({ email: email }).lean();

    if (existingUser) {
      const salt = uuidv4();
      const passwordHash = SecurePassword(password, salt);
      const code = randomstring.generate({
        length: 6,
        charset: "alphanumeric",
      });

      // Update user details
      await user.findOneAndUpdate(
        { email: email },
        {
          $set: {
            mobileNumber: mobileNumber,
            firstName: firstName,
            lastName: lastName,
            passphrase: passphrase,
            otp: code,
          },
        }
      );

      const accessSecret = process.env.ACCESS_SECRET;
      const refreshSecret = process.env.REFRESH_SECRET;

      const tokenPayload = {
        email: existingUser.email,
        id: existingUser._id,
      };

      const accessToken = encryptToken(
        jwt.sign(tokenPayload, accessSecret, { expiresIn: "48h" })
      );

      // Generate Refresh Token
      const refreshToken = encryptToken(
        jwt.sign(tokenPayload, refreshSecret, { expiresIn: "7d" })
      );

      // Send confirmation email
      /*await SendEmailWithConfirmation(
        existingUser.email,
        `your otp is ${existingUser.otp}`,
        "Verify your email"
      );*/

      return res.status(200).json({
        isSuccess: true,
        // accessToken: accessToken,
        // refreshToken: refreshToken,
        // userDetails: {
        //   userId: existingUser._id,
        //   email: existingUser.email,
        //   username: existingUser.username,
        //   mobileNumber: existingUser.mobileNumber,
        //   firstName: existingUser.firstName,
        //   lastName: existingUser.lastName,
        //   role: existingUser.Role,
        //   isVerified: existingUser.isVerified,
        // },
        message: "ok",
      });
    } else {
      const salt = uuidv4();
      const passwordHash = SecurePassword(password, salt);
      const code = randomstring.generate({
        length: 6,
        charset: "alphanumeric",
      });

      const newUser = await user.create({
        username: username,
        email: email,
        mobileNumber: mobileNumber,
        firstName: firstName,
        lastName: lastName,
        passphrase: passphrase,
        salt: salt,
        Role: 1,
        password: passwordHash,
        otp: code,
        expiresAt : new Date(Date.now() + 30000),
      });

      const accessSecret = process.env.ACCESS_SECRET;
      const refreshSecret = process.env.REFRESH_SECRET;

      const tokenPayload = {
        email: newUser.email,
        id: newUser._id,
      };

      const accessToken = encryptToken(
        jwt.sign(tokenPayload, accessSecret, { expiresIn: "48h" })
      );

      // Generate Refresh Token
      const refreshToken = encryptToken(
        jwt.sign(tokenPayload, refreshSecret, { expiresIn: "7d" })
      );

      // Send confirmation email
      /*await SendEmailWithConfirmation(
        newUser.email,
        newUser.otp,
        "Verify your email"
      );*/

      return res.status(200).json({
        isSuccess: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        userDetails: {
          userId: newUser._id,
          email: newUser.email,
          username: newUser.username,
          mobileNumber: newUser.mobileNumber,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.Role,
          isVerified: newUser.isVerified,
        },
        message: "ok",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
  

    if (!email) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Email is empty",
      });
    }

    if (!password) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Password is empty",
      });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Enter valid email",
      });
    }

    // Find user
    const data = await user.findOne({ email: email });
   

    // If user does not exist
    if (!data) {
      return res.status(401).json({
        isSuccess: false,
        data: {},
        message: "User not found",
      });
    }

    // If user is not verified
    if (data.isVerified === false) {
      return res.status(400).json({
        isSuccess: false,
        data: {
          isVerified: false,
        },
        message: "Email not verified",
      });
    }

    if (Authentication(password, data.salt, data.password) === false) {
      return res.status(401).json({
        isSuccess: false,
        data: {},
        message: "Invalid Email or password",
      });
    } else {
      const tokenPayload = {
        email: data.email,
        id: data._id,
      };

      const accessSecret = process.env.ACCESS_SECRET;
      const refreshSecret = process.env.REFRESH_SECRET;

      const accessToken = encryptToken(
        jwt.sign(tokenPayload, accessSecret, { expiresIn: "48h" })
      );

      // Generate Refresh Token
      const refreshToken = encryptToken(
        jwt.sign(tokenPayload, refreshSecret, { expiresIn: "7d" })
      );

      return res.status(200).json({
        isSuccess: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        userDetails: {
          userId: data._id,
          email: data.email,
          username: data.username,
          mobileNumber: data.mobileNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.Role,
        },
        message: "OK",
      });
    }
  } catch (error) {
  
    return res.status(500).json({
      isSuccess: false,
      data: {},
      message: "Internal Server Error Occurred",
    });
  }
};

exports.getProfile = async (req, res) => {

  try {
    let User = await user.findOne({ _id: req.id }).lean();
    if (User) {
      res.status(200).json({
        isSuccess: true,

        userDetails: User,

        message: "OK",
      });
    } else {
      res.status(404).json({
        isSuccess: false,
        data: {},
        message: "User Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

// exports.updateProfile = async (req, res) => {
//       try{
//         const { firstName, lastName, mobileNumber } = req.body;

//       }

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, email } = req.body;

    if (firstName) {
      await user.findOneAndUpdate({ _id: req.id }, { firstName: firstName });
    }
    if (lastName) {
      await user.findOneAndUpdate({ _id: req.id }, { lastName: lastName });
    }
    if (mobileNumber) {
      await user.findOneAndUpdate(
        { _id: req.id },
        { mobileNumber: mobileNumber }
      );
    }
    if (email) {
      await user.findOneAndUpdate({ _id: req.id }, { email: email });
    }
    res.status(200).json({
      isSuccess: true,
      message: "Profile Updated Successfully",
    });
  } catch (err) {
    
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.getWallet = async (req, res) => {
  try {
    const id = req.id;


    const lineGraphOne = [
      0, 1, 3, 5, 7, 9, 14, 12, 7, 9, 3, 20, 2, 4, 6, 8, 10,
    ];
    const lineGraphTwo = [
      0, 2, 4, 14, 12, 7, 9, 3, 20, 6, 8, 10, 1, 3, 5, 7, 9,
    ];
    const scatterGraphOne = [
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 3 },
      { x: 4, y: 5 },
      { x: 5, y: 7 },
      { x: 6, y: 9 },
      { x: 7, y: 14 },
      { x: 8, y: 12 },
      { x: 9, y: 7 },
      { x: 10, y: 9 },
      { x: 11, y: 3 },
      { x: 12, y: 20 },
      { x: 13, y: 2 },
      { x: 14, y: 4 },
      { x: 15, y: 6 },
      { x: 16, y: 8 },
      { x: 17, y: 10 },
    ];
    const scatterGraphTwo = [
      { x: 1, y: 0 },
      { x: 2, y: 2 },
      { x: 3, y: 4 },
      { x: 4, y: 14 },
      { x: 5, y: 12 },
      { x: 6, y: 7 },
      { x: 7, y: 9 },
      { x: 8, y: 3 },
      { x: 9, y: 20 },
      { x: 10, y: 6 },
      { x: 11, y: 8 },
      { x: 12, y: 10 },
      { x: 13, y: 1 },
      { x: 14, y: 3 },
      { x: 15, y: 5 },
      { x: 16, y: 7 },
      { x: 17, y: 9 },
    ];

    const userInvestment = await UserInvestment.find({ user: id }).lean();

    const propertiesByState = []; // Array to store properties grouped by state
    const propertiesByCountry = []; // Array to store properties grouped by country
    let totalExpectedRent = 0;
    let totalInvestedAmount = 0;
    let portfolioValue = 0;

    for (let i = 0; i < userInvestment.length; i++) {
      const amount = userInvestment[i].investedAmount;
      portfolioValue += amount; 
      const property = await Property.findOne({
        _id: userInvestment[i].propertyId,
      }).lean();
  
      if (property && property.rentalYield) {
        const rentalYield = property.rentalYield;
        let expectedRent = (amount * rentalYield) / 100; // Calculate the expected rent
        totalExpectedRent += expectedRent;
        totalInvestedAmount += amount;
      } 
      
      // Group properties by state
      if (property && property.state) {
        const filteredProperty = {
          addressStreet1: property.addressStreet1,
          addressStreet2: property.addressStreet2,
          city: property.city,
          state: property.state,
          country: property.country,
          zipcode: property.zipcode,
          totalValuation: property.totalValuation,
          historicValueAppreciation: property.historicValueAppreciation,
          Status: property.Status,
          rentalYield: property.rentalYield,
          sold: property.sold,
          investedAmount: amount,
          _id: property._id,
          colorCode: property.colorCode,
          sliderImage: property.sliderImages,
          rentalPerMonth: property.rentalPerMonth,
          colorCode: property.colorCode,
        };

        let found = false;
        for (let j = 0; j < propertiesByState.length; j++) {
          if (
            propertiesByState[j][0] &&
            propertiesByState[j][0].state === property.state
          ) {
            propertiesByState[j].push(filteredProperty);
            found = true;
            break;
          }
        }
        if (!found) {
          propertiesByState.push([filteredProperty]);
        }
      }

      //Group properties by country
      if (property && property.country) {
        const filteredProperty = {
          addressStreet1: property.addressStreet1,
          addressStreet2: property.addressStreet2,
          city: property.city,
          state: property.state,
          country: property.country,
          zipcode: property.zipcode,
          totalValuation: property.totalValuation,
          historicValueAppreciation: property.historicValueAppreciation,
          Status: property.Status,
          rentalYield: property.rentalYield,
          sold: property.sold,
          investedAmount: amount,
          _id: property._id,
          colorCode: property.colorCode,
          sliderImage: property.sliderImages,
          rentalPerMonth: property.rentalPerMonth,
        };

        let found = false;
        for (let j = 0; j < propertiesByCountry.length; j++) {
          if (
            propertiesByCountry[j][0] &&
            propertiesByCountry[j][0].country === property.country
          ) {
            propertiesByCountry[j].push(filteredProperty);
            found = true;
            break;
          }
        }
        if (!found) {
          propertiesByCountry.push([filteredProperty]);
        }
      }
    }

    let expectedRentPercentage;

    if (totalInvestedAmount !== 0) {
      expectedRentPercentage = ((totalExpectedRent / totalInvestedAmount) * 100).toFixed(1);
    } else {
      expectedRentPercentage = 0;
    }

    const assetsOwned = propertiesByState.length;

    const filteredPropertyPercentageByState = propertiesByState.reduce((result, propertyGroup) => {
      const statePostalCode = propertyGroup[0].state;
      const state = statePostalCodeMap[statePostalCode];
      const totalInvestment = propertyGroup.reduce((acc, property) => acc + property.investedAmount, 0);
      const totalInvestmentAllStates = propertiesByState.flat().reduce((acc, property) => acc + property.investedAmount, 0);
      const percentage = (totalInvestment / totalInvestmentAllStates) * 100;
      const colorCode = propertyGroup[0].colorCode;
      
      result[statePostalCode] = {
        percentage,
        colorCode,
        state
      };
    
      return result;
    }, {});

    function groupPropertiesById(propertiesByState) {
      const groupedProperties = [];
    
      for (const subArray of propertiesByState) {
        const groupedById = {};
    
        for (const property of subArray) {
          const { _id, investedAmount } = property;
    
          if (!groupedById[_id]) {
            groupedById[_id] = {
              ...property,
              investedAmount
            };
          } else {
            groupedById[_id].investedAmount += investedAmount;
          }
        }
    
        groupedProperties.push(Object.values(groupedById));
      }
    
      return groupedProperties;
    }
   
    const groupedProperties = groupPropertiesById(propertiesByState);
    
    console.log(groupedProperties);
    

    res.status(200).json({
      isSuccess: true,
      lineGraphOne: lineGraphOne,
      lineGraphTwo: lineGraphTwo,
      scatterGraphOne: scatterGraphOne,
      scatterGraphTwo: scatterGraphTwo,
      percentageByState: filteredPropertyPercentageByState,
      property: groupedProperties,
      assets: assetsOwned,
      expectedRent: totalExpectedRent,
      expectedRentReturn: expectedRentPercentage,
      portfolioValue: portfolioValue,
      message: "OK",
    });
  } catch (err) {
   
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.getRefreshtoken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
 
    if (!refreshToken) {
      return res.status(401).json({
        isSuccess: false,
        data: {},
        message: "Access Denied",
      });
    }
    const refreshSecret = process.env.REFRESH_SECRET;
    const token = decryptToken(refreshToken);
    const decoded = jwt.verify(token, refreshSecret);
    const User = await user.findOne({ email: decoded.email });
    if (!User) {
      return res.status(401).json({
        isSuccess: false,
        data: {},
        message: "Access Denied",
      });
    }
    const accessSecret = process.env.ACCESS_SECRET;
    const accessToken = encryptToken(
      jwt.sign({ email: User.email, id: User._id }, accessSecret, {
        expiresIn: "48h",
      })
    );
    return res.status(200).json({
      isSuccess: true,

      accessToken: accessToken,

      message: "OK",
    });
  } catch (error) {
   
    return res.status(500).json({
      isSuccess: false,
      data: {},
      message: "Internal Server Error Occurred",
    });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const id = req.id;
 
    const userInvestment = await UserInvestment.find({ user: id }).lean();

    const amount = userInvestment.reduce(
      (acc, curr) => acc + curr.investedAmount,
      0
    );
   

    if (userInvestment) {
      res.status(200).json({
        isSuccess: true,

        amount,

        message: "Ok",
      });
    } else {
      res.status(404).json({
        isSuccess: false,
        data: {},
        message: "User Not Found",
      });
    }
  } catch (err) {
   
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (password == undefined || null || "") {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Password is empty",
      });
    }

    const user2 = await user.findOne({ email }).lean();
    
    await user.findOneAndUpdate(
      { email: email },
      { Role: 1, password: SecurePassword(password, user2.salt) }
    );

    res.status(200).json({
      isSuccess: true,
      message: "Password Updated Successfully",
    });
  } catch (err) {
  
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const Documents = await Document.find();
    res.status(200).json({
      isSuccess: true,
      Documents,
      message: "OK",
    });
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

// exports.location = async (req, res) => {
     
//   try {
//    console.log(req.body)
    

   


//     res.status(200).json({
//       isSuccess: true,
//       message: "OK",
//     });
//   } catch (err) {
//     res.status(500).json({
//       isSuccess: false,
//       message: "Internal Server Error",
//     });

//   }
// };
