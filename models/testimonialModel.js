const mongoose = require("mongoose")

// creating UX schema

const testimonialSchema = new mongoose.Schema({
    image: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true,
        maxLength: [200, "Message should not exceed 200 characters"]
    }
},{timestamps: true})

const testimonialModel = mongoose.model("userTestimonial", testimonialSchema)
module.exports = testimonialModel