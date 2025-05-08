const express = require('express')
const subscribeRoute = express.Router()
const subscribeMails = require('../controllers/userSubscriptionController')
const contactUs = require('../controllers/customerFeedBackController')


subscribeRoute.post('/subscribe', subscribeMails)
subscribeRoute.post('/contact', contactUs)

module.exports = subscribeRoute