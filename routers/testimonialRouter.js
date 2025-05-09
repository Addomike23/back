const express = require("express")
const testimonialRouter = express.Router()
const multer = require("multer")
const {userTestimonial, fecthTestimonial} = require("../controllers/userTestimonialController")


// multer storage
const storage = multer.diskStorage({
    destination: "profilePic",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

// upload middleware
const upload = multer({ storage: storage })

// routes
// upload testimonial
testimonialRouter.post("/remarks", upload.single("image"), userTestimonial)

// fetch testimonial
testimonialRouter.get("/testimonial", fecthTestimonial)


module.exports = testimonialRouter