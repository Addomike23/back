const joi = require('joi');

// signup validator
const signupSchema = joi.object({
    name: joi.string().max(30).required().messages({
        "string length": "max characters is 30",
        "string required": "Please provide your name"
    }),
    email: joi.string().min(6).max(60).email({
        tlds: { allow: ['com', 'net'] }
    }).required(),

    password: joi
        .string()
        .min(8)
        .max(60)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,60}$"))
        .required()
        .messages({
            "string.pattern.base":
                "Password must be 8-60 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
            "string.min": "Password must be at least 8 characters long.",
            "string.max": "Password cannot be longer than 60 characters.",
            "any.required": "Password is required.",
        })

})


// signin validator

const signinSchema = joi.object({
    email: joi.string().min(6).max(60).email({
        tlds: { allow: ['com', 'net'] }
    }).required(),

    password: joi
        .string()
        .min(8)
        .max(60)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,60}$"))
        .required()
        .messages({
            "string.pattern.base":
                "Incorrect Password.",
            "string.min": "Password must be at least 8 characters long.",
            "string.max": "Password cannot be longer than 60 characters.",
            "any.required": "Password is required.",
        })

})

// subscribed emails
const verifyEmail = joi.object({
    email: joi.string().min(6).max(60).email({
        tlds: { allow: ['com', 'net'] }
    }).required(),
})

// verify email and code validator
const verifyCodeSchema = joi.object({
    email: joi.string().min(6).max(60).email({
        tlds: { allow: ['com', 'net'] }
    }).required(),

    // Ensures the verification code is a 6-digit number
    providedCode: joi.string()
        .length(6) // Assuming a 6-digit verification code
        .pattern(/^\d+$/) // Ensures only digits are allowed
        .required()
        .messages({
            "string.base": "Verification code must be a string",
            "string.length": "Verification code must be exactly 6 digits",
            "string.pattern.base": "Verification code must contain only numbers"
        })
})

// change email validator
const changeEmailSchema = joi.object({
    email: joi.string().min(6).max(60).email({
        tlds: { allow: ['com', 'net'] }
    }).required(),
})

const changePasswordSchema = joi.object({
    // email: joi.string().min(6).max(60).email({
    oldPassword: joi.string().min(6).max(60).
        pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$')).
        required(),

    newPassword: joi.string().min(6).max(60).
        pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$')).
        required(),
})

exports.verifyForgotPasswordSchema = joi.object({
    email: joi.string().min(6).max(60).email({
        tlds: { allow: ['com', 'net'] }
    }).required(),

    // Ensures the verification code is a 6-digit number
    providedCode: joi.string()
        .length(6) // Assuming a 6-digit verification code
        .pattern(/^\d+$/) // Ensures only digits are allowed
        .required()
        .messages({
            "string.base": "Verification code must be a string",
            "string.length": "Verification code must be exactly 6 digits",
            "string.pattern.base": "Verification code must contain only numbers"
        }),
    newPassword: joi.string().min(6).max(60).
        pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$')).
        required(),

})



const contactusMessage = joi.object({
    name: joi.string().required().messages({
        "string.empty": "Please provide your name",
        "any.required": "Name is required"
    }),
    email: joi.string()
        .min(6)
        .max(60)
        .email({ tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
            "string.empty": "Please provide your email",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required"
        }),
    message: joi.string().required().messages({
        "string.empty": "Please provide your message",
        "any.required": "Message is required"
    }),
});





module.exports = { contactusMessage, verifyEmail, signupSchema, signinSchema, verifyCodeSchema, changePasswordSchema, changeEmailSchema };