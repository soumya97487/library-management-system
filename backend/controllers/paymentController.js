// backend/controllers/paymentController.js
const paymentService = require('../services/paymentService');

exports.createOrder = async (req, res) => {
  try {
    const { total } = req.body;
    if (!total) return res.status(400).json({ error: 'Total amount required' });

    const order = await paymentService.createOrder(total);
    res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID, amount: order.amount });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: 'Could not create order' });
  }
};
