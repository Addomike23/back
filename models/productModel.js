const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
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



const productModel = mongoose.model("product", productSchema)
module.exports = productModel