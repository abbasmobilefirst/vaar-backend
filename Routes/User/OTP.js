
const {sendOTPs,resendOTP,verifyOTP,verifyEmail} = require("../../Controllers/User/OTP");
const express = require("express");

const router = express.Router();

router.post("/sendOTP", sendOTPs);
router.post("/resendOTP", resendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/verifyEmail", verifyEmail);

module.exports = router;