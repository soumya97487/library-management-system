// backend/routes/payment.js
const express = require('express');
const { protect } = require('../middlewares/auth');
const { createOrder } = require('../controllers/paymentController');
const router = express.Router();

router.post('/create-order', protect, createOrder);

module.exports = router;
