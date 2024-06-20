const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

var userInvestmentSchema = new mongoose.Schema({
    user : {
        type : ObjectId,
        ref: "User"

    },
    propertyId : {
        type : ObjectId,
        ref: "Property"

    },
    investedAmount : {
        type: Number,
        required: true

    },
    paymentTransactionId : {
        type: String,
        required: true

    },
    investedAt : {
        type: Date,
        required: true

    },
    investmentStatus : {
        type: Number,
        enum : [1,2,3,4]

    },

},  { timestamps: true });


const UserInvestment = mongoose.model('UserInvestment', userInvestmentSchema);
module.exports = { UserInvestment }