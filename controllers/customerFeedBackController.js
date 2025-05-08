const transporter = require('../middlewares/sendMail')
const { contactMessage } = require("../models/customerMessageSchema")
const { contactusMessage } = require("../middlewares/validator")


// contact us 
const contactUs = async (req, res) => {
    // get user message, name and email from req body
    const { name, email, message } = req.body
    // console.log(name, email, message);

    try {
        // verify email,message and name from client
        const { error } = contactusMessage.validate({ name, email, message })
        // send response 
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // receive mail from the client
        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL,
            subject: `Message from ${name}!!`,
            html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Client Message</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f2f2f2; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td align="center" style="background-color: #ff6b00; padding: 30px 20px;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">📩 New Message Received</h1>
                      </td>
                    </tr>
          
                    <!-- Name -->
                    <tr>
                      <td style="padding: 20px 30px;">
                        <p style="font-size: 16px; color: #333333; margin: 0;">
                          <strong>Client Name:</strong> ${name}
                        </p>
                      </td>
                    </tr>
          
                    <!-- Email -->
                    <tr>
                      <td style="padding: 0 30px 20px;">
                        <p style="font-size: 16px; color: #333333; margin: 0;">
                          <strong>Email:</strong> ${email}
                        </p>
                      </td>
                    </tr>
          
                    <!-- Message -->
                    <tr>
                      <td style="padding: 0 30px 30px;">
                        <p style="font-size: 16px; color: #444444; line-height: 1.6; white-space: pre-wrap;">
                          <strong>Message:</strong><br>${message}
                        </p>
                      </td>
                    </tr>
          
                    <!-- Button -->
                    <tr>
                      <td align="center" style="padding-bottom: 40px;">
                        <a href="mailto:${email}" style="display: inline-block; background-color: #ff6b00; color: #ffffff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                          Reply Now
                        </a>
                      </td>
                    </tr>
          
                    <!-- Footer -->
                    <tr>
                      <td align="center" style="background-color: #f2f2f2; padding: 20px; font-size: 12px; color: #888888;">
                        &copy; 2025 <strong>Myke-Bern</strong>. All rights reserved.
                      </td>
                    </tr>
          
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>`
        });


        // save contactmessage in database
        const newContactMessage = new contactMessage({
            name: name,
            email: email,
            message: message
        })

        // save message object
        await newContactMessage.save()
        // send response message
        res.status(201).json({ sucess: "true", message: 'Thanks you, message sent.' })

    } catch (error) {
        // send error message
        console.log(error);
        
        res.status(500).json({ message: "Internal server error" });

    }


}

module.exports = contactUs