const mongoose = require("mongoose")

const subscribeSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    }
}, { timestamps: true })

const subscribeModel = new mongoose.model("subscription", subscribeSchema)

module.exports = subscribeModel;