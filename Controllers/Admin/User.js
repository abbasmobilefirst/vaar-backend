
const {user} = require("../../Models/User/User");
const {UserInvestment} = require("../../Models/User/UserInvestment");
const { use } = require("../../Routes/User/User");


exports.getUsers = async (req, res) => {
    try{
        console.log("hi");
        const users = await user.find();
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
            users:userData ,
            message: "Ok"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
    }
}


exports.getUserById = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId);
      const user1 = await user.findOne({ _id: userId });
      res.status(200).json({
        isSuccess: true,
        user1,
        message: "Ok",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        isSuccess: false,
        message: "Internal Server Error",
      });
    }
  };

