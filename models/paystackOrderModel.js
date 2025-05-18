const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    region: String,
    town: String,
    country: String,
    amount: Number,
    reference: String,
    status: String,
    cartItems: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
      }
    ],
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
