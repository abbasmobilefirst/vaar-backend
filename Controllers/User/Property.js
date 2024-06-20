const { Property } = require("../../Models/User/Property");
const { UserInvestment } = require("../../Models/User/UserInvestment");
const { user } = require("../../Models/User/User");

const { v4: uuidv4 } = require("uuid");

const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname + "./../../.env") });

const crypto = require("crypto");

var jwt = require("jsonwebtoken");

// ...

// Path: Controllers/User/Property.js

exports.getAllproperties = async (req, res) => {
  try {
    let propertiesList = await Property.find()
      .populate("documents.offering_circular")
      .populate("documents.SEC_circular")
      .lean();

    return res.status(200).json({
      isSuccess: true,
      properties: propertiesList.map((property) => {
        if (property?.documents) {
          return {
            ...property,
            documents: {
              offering_circular: property.documents.offering_circular,
              SEC_circular: property.documents.SEC_circular,
            },
          };
        } else {
          return {
            ...property,
            documents: {
              offering_circular: "",
              SEC_circular: "",
            },
          };
        }
        // return {
        //   ...property,
        //   documents: {
        //     offering_circular: property.documents.offering_circular,
        //     SEC_circular: property.documents.SEC_circular,
        //   },
        // };
      }),
      message: "Ok",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      data: {},
      message: "Internal Server Error Occurred",
    });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    let { propertyId } = req.params;
  

    //all missing data validations
    if (
      propertyId == undefined ||
      propertyId == null ||
      propertyId == "" ||
      !propertyId
    ) {
      throw new Error("enter propertyId");
    }

    //finding user
    let property = await Property.findOne({ _id: propertyId });

    if (!property) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: "Property not Found",
      });
    } else {
      await property.populate("documents.offering_circular");
      await property.populate("documents.SEC_circular");

      //Response
      return res.status(200).json({
        isSuccess: true,
        property: property,
        message: "Ok",
      });
    }
  } catch (error) {
    //General Errors
    
    return res.status(500).json({
      isSuccess: false,
      data: {},
      message: "Internal Server Error Occurred",
    });
  }
};
exports.InvestInProperty = async (req, res) => {
  try {
    const { propertyId, amount } = req.body;

    if (
      propertyId == undefined ||
      propertyId == null ||
      propertyId == "" ||
      !propertyId
    ) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Enter valid propertyId",
      });
    }
    if (amount == undefined || amount == null || amount == "" || amount <= 0) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Enter valid amount",
      });
    }

    //find user
    var data = await user.findOne({ _id: req.id }).lean();
  

    //if user does not exists
    if (data == null || data == undefined || data == "") {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: "User Not Found",
      });
    }

    //find property
    var property = await Property.findOne({ _id: propertyId }).lean();

    
    //if property does not exists
    if (property == null || property == undefined || property == "") {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: "Property Not Found",
      });
    }

    //if property is not active
    if (property.isActive == false) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Property is not active",
      });
    }

    var sold_amount = property.sold;
    const totalValuation = property.totalValuation;
    percentBought = Math.ceil(parseFloat((amount / totalValuation) * 100));
    sold_amount += percentBought;
    // sold_amount = parseFloat(sold_amount.toFixed(0))

    await Property.updateOne({ _id: propertyId }, { $set: { sold: sold_amount } });

    const investment = new UserInvestment();
    investment.propertyId = propertyId;
    investment.user = req.id;

    investment.investedAmount = amount;
    investment.paymentTransactionId = uuidv4();
    investment.investedAt = Date.now();
    investment.investmentStatus = property.Status;

    //saving investment
    await investment.save();

    //Response
    return res.status(200).json({
      isSuccess: true,

      investment: investment,

      sold: sold_amount,

      message: "Ok",
    });
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};
