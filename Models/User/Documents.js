const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

var documentSchema = new mongoose.Schema({
    documentTitle : {
        type: String,
        required: true,
        Unique: true,

    },
    url : {
        type: String,
        required: true,

    },
    documentType : {
        type: String,
        required: true,

    },
    isDeleted : {
        type: Boolean,
        default: false,
        required: true
    },
    uploadedBy : {
        type : ObjectId,
        ref: "User"

    },
    deletedBy : {
        type : ObjectId,
        ref: "User"
    },
    size : {
        type: Number,
        required: true
    },
    
},  { timestamps: true });


const Document = mongoose.model('Document', documentSchema);
module.exports = { Document }
