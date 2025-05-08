const express = require('express');
const router = express.Router();
const { signup,
    signin,
    signout,
    sendVerificationCode,
    verifyUser,
    changePassword,
    sendForgotPasswordCode,
    verifyForgotPasswordCode } = require('../controllers/authController');

const identifyUser = require('../middlewares/identifyUser');
// define the routes

// signup route
router.post("/signup", signup)

// signin route
router.post("/signin", signin)

// signout route
router.post('/signout', identifyUser, signout)

// send verification code route
router.patch("/send-verification-code",identifyUser, sendVerificationCode)

// verify code route
router.patch("/verify-code", verifyUser);

// change password route
router.patch("/change-password", identifyUser, changePassword);

router.patch('/send-forgot-password-code', identifyUser, sendForgotPasswordCode)

router.patch('/verify-forgot-password-code',identifyUser, verifyForgotPasswordCode)



module.exports = router;