const mongoose = require('mongoose');
const bcrypt = require("bcrypt");


const UserSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true
        },

        last_name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            allowNull: false,
            unique: true
        },

        phone_number: {
            type: String,
            required: true
        },
    }
);

UserSchema.virtual('products', {
    ref: 'Products', 
    localField: '_id', 
    foreignField: 'userId',
    justOne: false
});

UserSchema.set('toJSON', {
    virtuals: true
});

const User = mongoose.model("User", UserSchema);

module.exports = User;