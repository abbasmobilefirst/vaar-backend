const { CreateUser ,login , getProfile , updateProfile,getWallet,getRefreshtoken,getPortfolio,getDocuments} = require("../../Controllers/User/User");
const { decryptionToken } = require("../../Middleware/User/Middleware");
const { resetPassword } = require("../../Controllers/User/User");
const {isAuthenticated} = require("../../Middleware/User/Middleware");

const router = require("express").Router();

router.post("/signup", CreateUser);
router.post("/login", login);
router.get("/profile",isAuthenticated, decryptionToken, getProfile);
router.put("/updateProfile", isAuthenticated,decryptionToken, updateProfile);
router.get("/wallet", isAuthenticated,decryptionToken, getWallet);
router.post("/getAccessToken",getRefreshtoken);
router.get("/getPortfolio", isAuthenticated,decryptionToken, getPortfolio)
router.post("/resetPassword", resetPassword)
router.get("/getDocument",  getDocuments)





module.exports = router;