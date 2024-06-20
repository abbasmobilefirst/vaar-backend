const express = require('express');
const app = express();
const router = express.Router();
const {getUsers,getUserById} = require("../../Controllers/Admin/UserInfo");
const {isAuthenticated,isAdminAuthenticated} = require("../../Middleware/Admin/Auth");


router.get('/allusers',isAdminAuthenticated,getUsers);
router.get('/user/:userId',isAdminAuthenticated,getUserById);

module.exports = router;