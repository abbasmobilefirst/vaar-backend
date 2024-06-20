const { object } = require('firebase-functions/v1/storage');
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

var propertySchema = new mongoose.Schema({
    // propertyTitle: {
    //     type: String,
    //     // required: true,
    //     // Unique: true,

    // },
    addressStreet1 : {
        type: String,
        required: false
    },
    addressStreet2 : {
        type: String,
        required: true,

    },
    city : {
        type: String,
        required: true,

    },
    state : {
        type: String,
        required: true,

    },
    zipcode : {
        type: Number,
        required: true,

    },

    totalValuation :
    {
        type: Number,
        required: true
    },
    historicValueAppreciation : {
        type: Number,
        required: true
    },
    // currentValuation : {
    //     type: Number,
    //     required: true,
    //     enum : [1,2,3,4]

    // },
    Status : {
        type: Number,
        enum : [1,2]

    },
    rentalYield : {
        type: Number,
        required: true
    },
    rentalPerMonth : {
        type: Number,
        required: true
    },
    rational:{
        type: String,
        
       

    },
    sold : {
        type: Number,
        required: true
    },
    documents: 
        {
          offering_circular: {
            type: ObjectId,
            ref: 'Document'
          },
          SEC_circular: {
            type: ObjectId,
            ref: 'Document'
          }
        }
      ,
    historicalValueChart : {
        type: [Number],
        required: true
    },

    sliderImages : {
         type: [String],
            required: true
    },
    colorCode : {
        type: String,
        required: true
    },
    lattitude : {
        type: Number,
        required: true
    },
    longitude : {
        type: Number,
        required: true
    },
    createdAt : {
        type: Date,
        // required: true

    },
    updatedAt : {
        type: Date,
        // required: true
    },
});

const Property = mongoose.model('Property', propertySchema);
module.exports = {Property};





    
