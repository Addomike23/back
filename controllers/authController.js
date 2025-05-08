const { signupSchema,
    signinSchema,
    verifyCodeSchema,
    changePasswordSchema,
    verifyForgotPasswordSchema } = require('../middlewares/validator');
const userModel = require('../models/userModel');
const { dohash, verifyPassword, hmacProcess } = require('../util/hashing');
const webToken = require('jsonwebtoken')
const transporter = require('../middlewares/sendMail')
// var nodemailer = require('nodemailer');

// authentication controller

// signup controller

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate user input
        const { error } = signupSchema.validate({ name, email, password });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ success: false, message: "Email already exists" });
        }

        // Hash password
        const hashPassword = await dohash(password, 10);


        // Generate OTP
        const codeValue = Math.floor(100000 + Math.random() * 900000).toString(); // Ensures 6 digits
        // Hash the provided code
        const hashedProvidedCode = hmacProcess(codeValue, process.env.HMAC_KEY);
        // Create user in DB
        const newUser = new userModel({
            name,
            email,
            password: hashPassword,
            verificationCode: hashedProvidedCode,
            verificationCodeValidation: Date.now(),
        });

        const result = await newUser.save();
        result.password = undefined;

        // Generate token
        const signinToken = await webToken.sign(
            { userId: result._id },
            process.env.SECRET_TOKEN,
            { expiresIn: "2d" }
        );

        // Send OTP to user email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verification Code from Michael's App",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; text-align: center;">
                    <h2 style="color: #007bff;">Your Verification Code</h2>
                    <p style="font-size: 18px; color: #333;">Use the code below to verify your account:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #333; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px; margin: 10px 0;">
                        ${codeValue}
                    </div>
                    <p style="font-size: 16px; color: #555;">This code expires in <strong>5 minutes</strong>.</p>
                    <p style="font-size: 14px; color: #888;">If you did not request this code, please ignore this email.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Michael's App. All rights reserved.</p>
                </div>
            `,
        });

        // Send token and success message in a **single response**
        return res
            .cookie("Authorization", "Bearer " + signinToken, {
                expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days,
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
            })
            .status(201)
            .json({
                success: true,
                message: "Your account has been created successfully. OTP sent to email.",
                signinToken,
                data: result,
            });

    } catch (error) {
        
        res.status(500).json({ message: "Internal server error" });
    }
};






// sigin controller
const signin = async (req, res) => {
    // get email and password from the req body
    const { email, password } = req.body;

    try {
        // validate signin crudentials with signinSchema
        const { error, value } = signinSchema.validate({ email, password })

        //    send validate error message object to client
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // find user in database and fetch info without password info
        const existIngUser = await userModel.findOne({ email }).select("+password")

        // send response if user not found
        if (!existIngUser) {
            return res.status(401).
                json({ success: false, message: 'Oops!, User does not exist' });
        }

        // compare user password with bcrypt compare function
        const verifyPass = await verifyPassword(password, existIngUser.password);

        // send response if password does not match
        if (!verifyPass) {

            return res.status(401).
                json({ success: false, message: 'Oops!, Incorrect password' });
        }



        // send signin token to client
        const signinToken = await webToken.sign({
            userId: existIngUser._id,
            email: existIngUser.email,
            verified: existIngUser.verified
        },
            // pass token here
            process.env.SECRET_TOKEN, { expiresIn: '8h' });

        // send token response to client
        res.cookie("Authorization", "Bearer" + signinToken,
            {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production'
            }
        ).json({
            success: true,
            signinToken,
            message: "Logged in successfully"
        })

    } catch (error) {

        // if there is an error, return an error message
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });

    }

}



// logout controller
const signout = async (req, res) => {
    res.clearCookie("Authorization").status(201).json({ success: true, message: "Logged out successfully" });
}



// send verification code to client
const sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    // find user in database
    const existIngUser = await userModel.findOne({ email });
    // send response if user not found
    if (!existIngUser) {
        return res.status(404).
            json({ success: false, message: 'Oops!, User does not exist' });
    }
    // send verification code to user email
    if (existIngUser.verified) {
        return res.status(400).json({ success: false, message: "User is already verified" });

    }
    // generate code for user
    const codeValue = Math.floor(Math.random() * 1000000).toString();

    // send code to user email
    let mailOptions = await transporter.sendMail({
        from: process.env.EMAIL,
        to: existingUser.email,
        subject: "Verification Code from Michael's App",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; text-align: center;">
                <h2 style="color: #007bff;">Your Verification Code</h2>
                <p style="font-size: 18px; color: #333;">Use the code below to verify your account:</p>
                <div style="font-size: 24px; font-weight: bold; color: #333; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px; margin: 10px 0;">
                    ${codeValue}
                </div>
                <p style="font-size: 16px; color: #555;">This code expires in <strong>5 minutes</strong>.</p>
                <p style="font-size: 14px; color: #888;">If you did not request this code, please ignore this email.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Michael's App. All rights reserved.</p>
            </div>
        `,
    });


    // send response if code is sent successfully
    if (mailOptions.accepted[0] === existIngUser.email) {
        const hashCodeValue = hmacProcess(codeValue, process.env.HMAC_KEY);
        existIngUser.verificationCode = hashCodeValue;
        existIngUser.verificationCodeValidation = Date.now()
        await existIngUser.save();
        return res.status(200).json({ success: true, message: "Verification code sent successfully" });
    }

    // send response if code is not sent
    return res.status(400).json({ success: false, message: "Code sent failed" });
}




const verifyUser = async (req, res) => {
    try {
        const { email, providedCode } = req.body;
        console.log(providedCode);


        // Validate input
        const { error } = verifyCodeSchema.validate({ email, providedCode });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        // Find user in the database (Include hidden fields)
        const user = await userModel.findOne({ email }).select("+verificationCode +verificationCodeValidation");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.verificationCode || !user.verificationCodeValidation) {
            return res.status(401).json({ success: false, message: "Verification code not found" });
        }

        // Check if code has expired (5 min expiration)
        if (Date.now() - user.verificationCodeValidation > 5 * 60 * 1000) {
            return res.status(401).json({ success: false, message: "Verification code has expired" });
        }

        // Hash the provided code
        const hashedProvidedCode = hmacProcess(providedCode, process.env.HMAC_KEY);

        // Compare provided code with stored hashed code
        if (hashedProvidedCode !== user.verificationCode) {
            return res.status(401).json({ success: false, message: "Incorrect verification code" });
        }

        // Update user as verified
        user.verified = true;
        user.verificationCode = undefined;
        user.verificationCodeValidation = undefined;
        await user.save();

        return res.status(200).json({ success: true, message: "User verified successfully" });

    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



// function for changing password
const changePassword = async (req, res) => {
    // get email, verified, oldPassword and newPassword from the request body
    const { userId, verified } = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
        const { error, value } = changePasswordSchema.validate({ oldPassword, newPassword });
        // if there is an error, return the error message
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }
        // find the user in the database
        const existIngUser = await userModel.findOne({ _id: userId }).select("+password");
        // send response if user not found
        if (!existIngUser) {
            return res.status(404).json({ success: false, message: "User does not exist" })
        }
        // compare the old password with the user password
        const verifyOldPassword = await verifyPassword(oldPassword, existIngUser.password);
        // send response if password does not match
        if (!verifyOldPassword) {
            return res.status(401).json({ success: false, message: "Oops!, Incorrect password" })
        }
        // hash the new password
        const hashNewPassword = await dohash(newPassword, 10);
        // update the user password 
        existIngUser.password = hashNewPassword;
        existIngUser.save();
        // return a success message
        return res.status(200).json({ success: true, message: "Password changed successfully" })

    } catch (error) {
        // if there is an error, return an error message
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });

    }
}

// forgot password function

const sendForgotPasswordCode = async (req, res) => {
    const { email } = req.body;
    // find user in database
    const existIngUser = await userModel.findOne({ email });
    // send response if user not found
    if (!existIngUser) {
        return res.status(404).
            json({ success: false, message: 'Oops!, User does not exist' });
    }

    // generate code for user
    const codeValue = Math.floor(Math.random() * 1000000).toString();

    // send code to user email
    let mailOptions = await transporter.sendMail({
        from: process.env.EMAIL,
        to: existIngUser.email,
        subject: "Forgot Password code from Michael's App",
        html: '<h2> Your Forgot Password secret code is </h2>' + codeValue + '<h4> This code expires in 5 minutes </h4>'
    });

    // send response if code is sent successfully
    if (mailOptions.accepted[0] === existIngUser.email) {
        const hashCodeValue = hmacProcess(codeValue, process.env.HMAC_KEY);
        existIngUser.forgotPasswordCode = hashCodeValue;
        existIngUser.forgotPasswordCodeValidation = Date.now()
        await existIngUser.save();
        return res.status(200).json({ success: true, message: "Verification code sent successfully" });
    }

    // send response if code is not sent
    return res.status(400).json({ success: false, message: "Code sent failed" });
}


const verifyForgotPasswordCode = async (req, res) => {
    try {
        const { email, providedCode, newPassword } = req.body;

        const { error } = verifyForgotPasswordSchema.validate({ email, providedCode, newPassword });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });

        }
        // Find user in the database (Include hidden fields)
        const user = await userModel.findOne({ email }).select("+password +forgotPasswordCode +forgotPasswordCodeValidation");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.forgotPasswordCode || !user.forgotPasswordCodeValidation) {
            return res.status(401).json({ success: false, message: "Forgot password code not found" });
        }

        // Check if code has expired (5 min expiration)
        if (Date.now() - user.forgotPasswordCodeValidation > 5 * 60 * 1000) {
            return res.status(401).json({ success: false, message: "Forgot password code has expired" });
        }

        // Hash the provided code
        const hashedProvidedCode = hmacProcess(providedCode, process.env.HMAC_KEY);
        const hashNewPassword = await dohash(newPassword, 10)



        // Compare provided code with stored hashed code
        if (hashedProvidedCode !== user.forgotPasswordCode) {
            return res.status(401).json({ success: false, message: "Incorrect forgot password code" });
        }

        // Update user as verified
        user.password = hashNewPassword;
        user.forgotPasswordCode = undefined;
        user.forgotPasswordCodeValidation = undefined;
        await user.save();

        return res.status(200).json({ success: true, message: "User forgot password code verified successfully" });

    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// export the controller
module.exports = {
    signup,
    signin,
    signout,
    sendVerificationCode,
    verifyUser,
    changePassword,
    sendForgotPasswordCode,
    verifyForgotPasswordCode
};