const { required } = require('joi');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        lowercase: true,
        maxLength: [30, 'Name should not exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        trim: true,
        unique: [true, 'Email already exists'],
        minLength: [5, 'Email must be at least 5 characters long'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [8, 'Password must be at least 8 characters long'],
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        select: false,
    },
    verificationCodeValidation: {
        type: Number,
        select: false
    },
    forgotPasswordCode: {
        type: String,
        select: false
    },
    forgotPasswordCodeValidation: {
        type: Number,
        select: false
    }
}, { timestamps: true });


const userModel = mongoose.model("User", userSchema)

module.exports = userModel