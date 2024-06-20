const { user } = require("../../Models/User/User");
const randomstring = require("randomstring");
const path = require("path");
const fs = require("fs");
const { SendEmailWithConfirmation } = require("../../utils/aws");
const { use } = require("../../Routes/User/OTP");
const e = require("express");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mailchimpClient = require("@mailchimp/mailchimp_transactional")(
  process.env.MY_API_KEY
);

// Function to update the OTP with expiration time
async function updateOTP(email, code) {

  const expirationTime = new Date(Date.now() + 30000); 
  

  // Update the user document with the new OTP and expiration time
  await user.findOneAndUpdate(
    { email: email },
    { otp: code, expiresAt: expirationTime },
    { upsert: true }
  );
}

  // Update the user document with the new OTP and expiration time
 
exports.sendOTPs = async (req, res) => {
  try {
    const { email } = req.body;
   
    const user1 = await user.findOne({ email }).lean();
    if (!user1) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
    }

    // if (user1) {
    const code = randomstring.generate({
      length: 6,
      charset: "alphanumeric",
    });

    await updateOTP(email, code);

    await user.findOneAndUpdate({ email: email }, { otp: code });

    // const run = async () => {
    //   const response = await mailchimpClient.messages.send({ message: {
    //     from_email: "first@discreit.com",
    //     subject: "OTP Email",
    //     to: [
    //       {
    //         email,

    //       },
    //     ],
    //     merge_vars: [
    //       {
    //         rcpt: email,
    //         vars: [
    //           {
    //             name: "OTP",
    //             content: code,
    //           },
    //         ],
    //       },
    //     ],
    //     global_merge_vars: [
    //       {
    //         name: "OTP",
    //         content: code,
    //       },
    //     ],

    //   } });
    //   console.log(response);
    // };

    // run();
    // console.log("OTP email sent successfully:", response);

    

    await SendEmailWithConfirmation(email, `Your OTP is ${code}`, "OTP Email");

    // await user.findOneAndUpdate({ email }, { otp: code });

    res.status(200).json({
      isSuccess: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

// async function sendOTP(email, otp) {
//   const templateName =  'Discreit Test Template'; // Replace with your actual template name

//   const templateContent = [
//     {
//       name: "OTP",
//       content: otp,
//     },
//   ];

//   const message = {
//     from_email: "first@discreit.com",
//     subject: "OTP Email",
//     to: [
//       {
//         email,
//         type: "to",
//       },
//     ],
//     merge_vars: [
//       {
//         rcpt: email,
//         vars: [
//           {
//             name: "OTP",
//             content: otp,
//           },
//         ],
//       },
//     ],
//     global_merge_vars: [
//       {
//         name: "OTP",
//         content: otp,
//       },
//     ],
//   };

//   try {
//     const response = await mailchimpClient.messages.sendTemplate({
//       template_name: templateName,
//       template_content: templateContent,
//       message,
//     });

//     console.log("OTP email sent successfully:", response);
//   } catch (error) {
//     console.error("Error sending OTP email:", error);
//   }
// }

exports.verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user1 = await user.findOne({ email }).lean();
    if (!user1) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
    }

    if (user1.expiresAt && user1.expiresAt < new Date()) {
      return res.status(400).json({
        isSuccess: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }
 
    const otp1 = user1.otp;

    if (otp1 === otp) {
      res.status(200).json({
        isSuccess: true,
        message: "OTP verified successfully",
      });
    } else {
      res.status(400).json({
        isSuccess: false,
        message: "Invalid OTP",
      });
    }
  } catch (err) {
    
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const id = req.id;
    const user1 = await user.find({ _id: id }).lean();
    const email = user1.email;
    const code = randomstring.generate({
      length: 6,
      charset: "alphanumeric",
    });

    

    await user.findOneAndUpdate({ email: email }, { otp: code });
    // const run = async () => {
    //   const response = await mailchimpClient.messages.send({ message: {
    //     from_email: "first@discreit.com",
    //     subject: "OTP Email",
    //     to: [
    //       {
    //         email,

    //       },
    //     ],
    //     merge_vars: [
    //       {
    //         rcpt: email,
    //         vars: [
    //           {
    //             name: "OTP",
    //             content: code,
    //           },
    //         ],
    //       },
    //     ],
    //     global_merge_vars: [
    //       {
    //         name: "OTP",
    //         content: code,
    //       },
    //     ],

    //   } });
    //   console.log(response);
    // };

    // run();

    await SendEmailWithConfirmation(
      email,
      `your otp of resending is ${code}`,
      "resend otp"
    );
  } catch (err) {
  
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
   

    const user1 = await user.findOne({ email }).lean();

    if (!user1) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
    }

    if (user1.expiresAt && user1.expiresAt < new Date()) {
      return res.status(400).json({
        isSuccess: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }true
   

    const otp1 = user1.otp;

    if (otp1 === otp) {
      if (user1.isVerified) {
        return res.status(400).json({
          isSuccess: false,
          message: "Email already verified",
        });
      } else {
        const user2 = await user.findOneAndUpdate(
          { email },
          { isVerified: true },
          { new: true }
        );

        return res.status(200).json({
          isSuccess: true,
          message: "Email verified successfully",
          data: {
            email: email,
            isVerified: user2.isVerified,
          },
        });
      }
    } else {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid OTP",
      });
    }
  } catch (err) {
  
    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};
