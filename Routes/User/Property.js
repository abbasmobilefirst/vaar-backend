
const express = require("express");

const { getAllproperties, getPropertyById ,InvestInProperty} = require("../../Controllers/User/Property");
const { decryptionToken } = require("../../Middleware/User/Middleware");


const router = express.Router();

router.get("/properties", getAllproperties);
router.get("/properties/:propertyId", getPropertyById);
router.post("/Invest", decryptionToken, InvestInProperty)



module.exports = router;