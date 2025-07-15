// backend/services/paymentService.js
const Razorpay = require('razorpay');

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (amountInRupees, currency = 'INR') => {
  const options = {
    amount: amountInRupees * 100, // Razorpay amount is in paise
    currency,
    receipt: `rcpt_${Date.now()}`,
  };
  const order = await razor.orders.create(options);
  return order;
};
