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

const productCategorySchema = new mongoose.Schema({
    image: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    }
},{timestamps: true})

const product = mongoose.model("product", productSchema)
const productCategory = mongoose.model("category", productCategorySchema)
module.exports = {productCategory, product}