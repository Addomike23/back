const mongoose = require("mongoose")

const LatestproductSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    datePublished: {
        type: String,
        required: true
    },
},{timestamps: true})



const LatestproductModel = mongoose.model("latestproduct", LatestproductSchema)
module.exports = LatestproductModel