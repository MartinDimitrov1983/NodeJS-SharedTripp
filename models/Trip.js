const mongoose = require('mongoose');
const User = require('./User');

const Schema = mongoose.Schema;
const Model = mongoose.model;

const tripSchema = new Schema({

    startPoint: {
        type: mongoose.SchemaTypes.String,
        required: [true, "Start point reqiured"],
        minlength:[4, "Start point must be at least 4 symbols"]

    },

    endPoint: {
        type: mongoose.SchemaTypes.String,
        required: [true, "End point reqiured"],
        minlength:[4, "End point  must be at least 4 symbols"]
    },

    date:{
        type: mongoose.SchemaTypes.String,
        required: [true, "Date point reqiured"],
        minlength:[6, "Date must be at least 6 symbols"]
    },

    time:{
        type: mongoose.SchemaTypes.String,
        required: [true, "Time reqiured"],
        minlength:[6, "Time must be at least 6 symbols"]
    },

    seats:{
        type: mongoose.SchemaTypes.Number,
        required: [true, "Seats reqiured"],
    },

    description:{
        type: mongoose.SchemaTypes.String,
        required: [true, "Description reqiured"],
        validate: {
            validator: function(v) {
              return !v.startsWith("https://")
            },
            message: props => `$Is not a valid url!`
          }
    },

    carImage:{
        type: mongoose.SchemaTypes.String,
        required: [true, "carImage reqiured"],
    },

    buddies:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: User,
        required: [true, "Creator reqiured"],
    }],

    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: User,
    }

    

});


module.exports = new Model('Trip', tripSchema);