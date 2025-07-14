const express = require('express');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate').validate;
const Joi = require('joi');
const {
  createRental,
  listRentals,
  updateRental,
  cancelRental
} = require('../controllers/rentalController');

const router = express.Router();
router.use(protect);

const rentalSchema = Joi.object({ bookId: Joi.string().hex().length(24).required(), months: Joi.number().integer().min(1).max(12).required() });
const monthsSchema = Joi.object({ months: Joi.number().integer().min(1).max(12).required() });

router.post('/', validate(rentalSchema), createRental);
router.get('/', listRentals);
router.put('/:id', validate(monthsSchema), updateRental);
router.delete('/:id', cancelRental);

module.exports = router;
