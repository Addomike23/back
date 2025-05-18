const express = require("express")
const payStackRouter = express.Router()
const {  orderPaystack,
    paystackWebhookHandler,} = require("../controllers/payStackController")
const identifyUser = require("../middlewares/identifyUser")

payStackRouter.post('/paystack/verify/:reference', orderPaystack)
payStackRouter.post('/paystack/webhook/', paystackWebhookHandler);



module.exports = payStackRouter