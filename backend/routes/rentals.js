// backend/routes/rentals.js
const express = require('express');
const Joi    = require('joi');
const { protect } = require('../middlewares/auth');
const validate     = require('../middlewares/validate').validate;
const ctrl         = require('../controllers/rentalController');

const router = express.Router();
router.use(protect);

router.post('/',  validate(Joi.object({
  bookId: Joi.string().hex().length(24).required(),
  months: Joi.number().integer().min(1).max(12).required()
})), ctrl.createRental);

router.get('/', ctrl.listRentals);

router.put('/:id', validate(Joi.object({ months:Joi.number().integer().min(1).max(12).required() })), ctrl.updateRental);

router.delete('/:id', ctrl.cancelRental);

// Mark all pending rentals paid
router.patch('/pay-all', ctrl.payAllRentals);

module.exports = router;
