const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        Unique: true,

    },
    email: {
        type: String,
        required: true,

    },
    firstName: {
        type: String,
        required: true,

    },
    lastName: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,

    },

    passphrase: {
        type: String,
        required: true
      },

    Role: {
        type : Number,
        enum:[1,2],
        default: 1,
        required: true
       
    },
    changePassword: {
        type: Boolean,
        default: true,
        required: true
    },
    passwordUpdatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted : {
        type: Boolean,
        default: false,
        required: true
    },
    isSuspended :{
        type: Boolean,
        default: false,
        required: true
    },
    deletedTime: {
        type: Date,
        
    },
    suspendedTime : {
        type: Date
    },
        
    isUsernameSet:{

        type: Boolean,
        default: false,
        required: true

    },
    mobileNumber:{
        type: String,
        required: true,
    },
   
    
    isMFA:{
        type: Boolean,
        default: false,
        required: true
    },
    isNotification :{
        type: Boolean,
        default: false,
        required: true

    },
    salt : {
        type: String,
        required: true
    },
    otp : {
        type: String,
        // required: true,  
        
            

        
    },
    expiresAt: {
        type: Date,
        default: null,
      },
    isVerified : {
        type : Boolean,
        default: false,
    }
   
}, {collection: 'user'});

var user = mongoose.model('user', userSchema);
module.exports = { user }