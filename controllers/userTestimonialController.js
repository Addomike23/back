const testimonialModel = require("../models/testimonialModel")


// user experience remark controller

const userTestimonial = async (req, res) => {
    // destruct user data from req body

    const { image, name, message } = req.body;


    try {
        // validate user data
        if (!image || !name || !message) {
            return res.status(401).json({ message: "Please fill all inputs" })
        }

        // create new remark object
        const remark = new remarkModel({
            image: image,
            name: name,
            message: message
        })

        // save remark objectin database
        await remark.save();
        res.status(201).json({ success: true, message: "Thanks for sharing your experience" })
    } catch (error) {
        res.status(401).json({success: false, message: "Internal error"})
    }
}

// FETCH ALL TESTIMONIALS
const fecthTestimonial = async (req,res)=>{

    // try catch block
    try {
        // fetch testimonials from DB
        const testimonial = await testimonialModel.find({});
        res.status(201).json({success: true, message: "testimonial fetched", data: testimonial})

        
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, message: "Internal error, try again"})
        
    }
}


module.exports = {userTestimonial, fecthTestimonial}