const subscribeModel = require("../models/subscriptionModel")
const transporter = require("../middlewares/sendMail")
const { verifyEmail } = require('../middlewares/validator')


// subscribe email controller

const subscribeMails = async (req, res) => {
    // get email from request body
    const { email } = req.body
    try {
        // validate email from client side
        const { error } = verifyEmail.validate({ email })
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Check if email already exists
        const alreadySubscribed = await subscribeModel.findOne({ email });
        if (alreadySubscribed) {
            return res.status(409).json({ success: false, message: 'Email already subscribed.' });
        }


        // send news email to client
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Latest news from Michael's App",
            html: `<!DOCTYPE html>
  <html lang="en">
    <head>
  <meta charset="UTF-8">
  <title>Thank You for Subscribing!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin: 40px auto; border-radius: 10px; overflow: hidden;">
          <!-- Header Image -->
          <tr>
            <td>
<img src="https://yourcdn.com/images/news-banner.jpg" alt="News Banner" width="600" style="display: block; width: 100%; max-width: 600px;">
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding: 30px 20px 10px;">
              <h1 style="color: #333333; font-size: 24px; margin: 0;">Thank You for Subscribing!</h1>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td align="center" style="padding: 10px 30px 20px;">
              <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0;">
                You’ve successfully subscribed to <strong>Myke-Bern</strong> updates. We’ll send you our latest products, discounts, and exclusive deals straight to your inbox.
              </p>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td align="center" style="padding: 20px;">
              <a href="https://yourwebsite.com/shop" style="background-color: #ff7f50; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Explore New Arrivals
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f4f4f4; padding: 20px; color: #999999; font-size: 12px;">
              <p style="margin: 0;">
                &copy; 2025 Myke-Bern. All rights reserved.<br>
                <a href="https://yourwebsite.com/unsubscribe" style="color: #999999; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

        })

        // create new email object
        const newSubscriber = new subscribeModel({
            email
        })

        await newSubscriber.save()
        res.status(201).json({ sucess: "true", message: 'Thanks for subscribing.' })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" });

    }
}

module.exports = subscribeMails