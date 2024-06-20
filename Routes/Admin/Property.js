const {AddProperty,UpdateProperty,DeleteProperty} = require("../../Controllers/Admin/Property")
const express = require("express");
const app = express();

const router = express.Router();

const {getAllproperties,getPropertyById}= require("../../Controllers/User/Property");
const {isAdminAuthenticated} = require("../../Middleware/Admin/Auth")
const {AddDocument} = require("../../Controllers/Admin/Documents")
const {uploadPDFMiddleware}= require("../../Middleware/Admin/Document")
const {uploadImage} = require("../../Middleware/Admin/Image")
app.use(uploadPDFMiddleware)
router.post('/addproperty',isAdminAuthenticated,AddProperty);
router.get('/properties',isAdminAuthenticated,getAllproperties)
router.put('/updateproperty/:propertyId',isAdminAuthenticated,UpdateProperty)
router.get('/properties/:propertyId',isAdminAuthenticated,getPropertyById)
router.delete('/deleteproperty/:propertyId',isAdminAuthenticated,DeleteProperty)
router.post('/uploadDocument',isAdminAuthenticated,uploadPDFMiddleware,AddDocument)
router.post("/uploadImage",isAdminAuthenticated,uploadImage)


module.exports = router;


