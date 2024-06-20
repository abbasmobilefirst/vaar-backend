
const express = require('express');
const app = express();

const router = express.Router();

const {login} = require("../../Controllers/Admin/Admin");

router.post('/login',login);

module.exports = router;