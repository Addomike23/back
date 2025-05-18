const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/paystackOrderModel');
const {product} = require('../models/productModel');
const PAYSTACK_LIVE_SECRET_KEY = process.env.PAYSTACK_LIVE_SECRET_KEY;

// ============ Payment Verification Endpoint ============
const orderPaystack = async (req, res) => {
  const { reference } = req.params;
  const {
    fullName,
    email,
    phone,
    address,
    city,
    region,
    town,
    country,
    cartItems,
    totalAmount,
  } = req.body;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_LIVE_SECRET_KEY}`,
      },
    });

    const data = response.data.data;

    if (data.status !== 'success') {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    for (const item of cartItems) {
      const Product = await product.findById(item._id);

      if (!Product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (Product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${item.name}` });
      }

      Product.stock -= item.quantity;
      await Product.save();
    }

    const order = new Order({
      fullName,
      email,
      phone,
      address,
      city,
      region,
      town,
      country,
      cartItems,
      amount: totalAmount,
      reference: data.reference,
      status: data.status,
    });

    await order.save();

    res.status(200).json({ message: 'Payment verified,', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ============ Webhook Handler ============
const paystackWebhookHandler = async (req, res) => {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_LIVE_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;

  if (event.event === 'charge.success') {
    const data = event.data;
    const { cartItems, shipping } = data.metadata;

    try {
      for (const item of cartItems) {
        const Product = await product.findById(item._id);
        if (Product) {
          Product.stock = Math.max(0, Product.stock - item.quantity);
          await Product.save();
        }
      }

      const order = new Order({
        fullName: shipping.fullName,
        email: data.customer.email,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        region: shipping.region,
        town: shipping.town,
        country: shipping.country,
        cartItems,
        amount: data.amount / 100,
        reference: data.reference,
        status: data.status,
      });

      await order.save();
      res.status(200).send('Webhook processed');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(200).send('Event ignored');
  }
};

module.exports = {
  orderPaystack,
  paystackWebhookHandler,
};
