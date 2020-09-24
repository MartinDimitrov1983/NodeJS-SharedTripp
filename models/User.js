const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const Schema = mongoose.Schema;
const Model = mongoose.model;

const userSchema = new Schema({

    email: {
        type: mongoose.SchemaTypes.String,
        required: [true, "Email is required!"],
        unique: [true, "Email is already taken!"],
        match: [/^[A-Z]*@[A-Z]*\.[A-Z]*$/i, "Email is not valid"]
    },

    password: {
        type: mongoose.SchemaTypes.String,
        required: [true, "Password is required!"],
        minlength: [6, "Password must be at least 6 symbol"]
    },

    trips: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Trips'
    }]

});

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {

            if (err) { next(err); return; }

            bcrypt.hash(this.password, salt, (err, hash) => {

                if (err) { next(err); return; }

                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

module.exports = new Model('User', userSchema);