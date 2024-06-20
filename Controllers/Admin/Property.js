const { Property } = require("../../Models/User/Property");
const { deleteImage } = require("../../Middleware/Admin/DeleteImages");
const bucketName = "discreit-staging";
const { AddDocument } = require("../../Controllers/Admin/Documents");
const mongoose = require("mongoose");

exports.AddProperty = async (req, res) => {
  try {
    let {
      propertyTitle,
      addressStreet1,
      addressStreet2,
      city,
      state,
      zipCode,
      totalValuation,
      historicValueAppreciation,
      currentValuation,
      Status,
      sold,
      rentalYield,
      rentalPerMonth,
      rational,
      historicalValueChart,
      colorCode,
      lattitude,
      longitude,
      offering_circular,
      SEC_circular,
      sliderImages,
    } = req.body;

    if (
      sold == null ||
      sold == undefined ||
      sold == "" ||
      sold == NaN ||
      sold < 0 ||
      sold > 100
    ) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: "Please enter a valid sold value",
      });
    }

    const property = new Property({
      propertyTitle: propertyTitle,
      addressStreet1: addressStreet1,
      addressStreet2: addressStreet2,
      city: city,
      state: state,
      zipcode: zipCode,
      totalValuation: totalValuation,
      historicValueAppreciation: historicValueAppreciation,
      currentValuation: currentValuation,
      Status: Status,
      rentalYield: rentalYield,
      rentalPerMonth: rentalPerMonth,
      rational: rational,
      createdAt: new Date(),
      documents: {
        offering_circular: new mongoose.Types.ObjectId(offering_circular),
        SEC_circular: new mongoose.Types.ObjectId(SEC_circular),
      },

      sold: sold,
      // sliderImages: req.files.sliderImages,
      colorCode: colorCode,
      lattitude: lattitude,
      longitude: longitude,
      sliderImages: sliderImages,
      historicalValueChart: historicalValueChart,
    });
    await property.save();
    await property.populate("documents.offering_circular");
    await property.populate("documents.SEC_circular");

    return res.status(200).json({
      isSuccess: true,
      property: property,
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

exports.UpdateProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const {
      propertyTitle,
      addressStreet1,
      addressStreet2,
      city,
      state,
      zipCode,
      totalValuation,
      historicValueAppreciation,
      currentValuation,
      Status,
      rentalYield,
      rentalPerMonth,
      rational,
      historicalValueChart,
      colorCode,
      lattitude,
      longitude,
      sliderImages,
      sold,
      SEC_circular,
      offering_circular,
    } = req.body;

    const property = await Property.findOne({ _id: propertyId });
    if (!property) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: "Property not found",
      });
    }

    if (propertyTitle) {
      property.propertyTitle = propertyTitle;
    }
    if (addressStreet1 || addressStreet1==="") {
      property.addressStreet1 = addressStreet1;
    }
    if (addressStreet2) {
      property.addressStreet2 = addressStreet2;
    }
    if (city) {
      property.city = city;
    }
    if (state) {
      property.state = state;
    }
    if (zipCode) {
      property.zipcode = zipCode;
    }
    if (totalValuation) {
      property.totalValuation = totalValuation;
    }
    if (historicValueAppreciation) {
      property.historicValueAppreciation = historicValueAppreciation;
    }
    if (Status) {
      property.Status = Status;
    }
    if (rentalYield) {
      property.rentalYield = rentalYield;
    }
    if (rentalPerMonth) {
      property.rentalPerMonth = rentalPerMonth;
    }
    if (rational) {
      property.rational = rational;
    }
    if (historicalValueChart) {
      property.historicalValueChart = historicalValueChart;
    }
    if (colorCode) {
      property.colorCode = colorCode;
    }
    if (lattitude) {
      property.lattitude = lattitude;
    }
    if (longitude) {
      property.longitude = longitude;
    }
    if (sliderImages) {
      property.sliderImages = sliderImages;
    }

    if (sold >= 0 && sold <= 100) {
      property.sold = sold;
    }
   if(offering_circular){
    property.documents.offering_circular = new mongoose.Types.ObjectId(
      offering_circular
    );
    }
    if(SEC_circular){
    property.documents.SEC_circular = new mongoose.Types.ObjectId(SEC_circular);
    }
    
    // Assign the new slider image URL to the specified index in the array

    // Save the updated property
    await property.save();

    return res.status(200).json({
      isSuccess: true,
      property: property,
      message: "Property updated successfully",
    });
  } catch (error) {
   
    return res.status(500).json({
      isSuccess: false,
      data: {},
      message: "Internal Server Error Occurred",
    });
  }
};

exports.DeleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params; // Extract the propertyId from req.params

    const property = await Property.findByIdAndDelete(propertyId); // Use findByIdAndDelete to delete the property by its ID

    if (!property) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: "Property not found",
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Property deleted successfully",
    });
  } catch (err) {
    
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};
