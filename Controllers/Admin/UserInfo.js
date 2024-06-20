const { user } = require("../../Models/User/User");
const { UserInvestment } = require("../../Models/User/UserInvestment");

exports.getUsers = async (req, res) => {
  try {
  
    const users = await user.find({ Role: 1});
    
    const userData = [];

    for (let i = 0; i < users.length; i++) {
      const UserInvestments = await UserInvestment.find({ user: users[i]._id });
      let totalAmount = 0;

      UserInvestments.forEach((UserInvestment) => {
        totalAmount += UserInvestment.investedAmount;
      });

      userData.push({
        userId: users[i]._id,
        name: users[i].firstName,
        email: users[i].email,
        phone: users[i].mobileNumber,
        role: users[i].Role,
        totalAmount: totalAmount,
      });
    }

    res.status(200).json({
      isSuccess: true,
      users: userData,
      message: "Ok",
    });
  } catch (err) {
  
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const User = await user.findById(userId);
    if (!User) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: "User not found",
      });
    }

    let totalAmount = 0;
    let property = [];

    const UserInvestments = await UserInvestment.find({
      user: userId,
    }).populate("propertyId");

    if (UserInvestments.length > 0) {
      UserInvestments.forEach((UserInvestment) => {
        totalAmount += UserInvestment.investedAmount;
        
        if (UserInvestment.propertyId) {
        
          property.push({
            propertyId: UserInvestment.propertyId,
            propertyTitle: UserInvestment.propertyId.propertyTitle,
            sliderImage: UserInvestment.propertyId.sliderImages,
          });
        }
      });
    }

    const userData = { ...User._doc, property, totalAmount };

    res.status(200).json({
      isSuccess: true,
      userData,
      message: "Ok",
    });
  } catch (err) {

    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};


