
const express = require('express');
const {
  getAllLoans,    
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan
} = require('../controllers/loanController');
const { protect, restrictTo } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');

const router = express.Router();

router.get('/', protect, getAllLoans);
router.get('/:id', protect, getLoanById);

router.post('/', protect, restrictTo('admin', 'librarian'),validate(schemas.loan), createLoan);
router.put('/:id', protect, restrictTo('admin', 'librarian'),validate(schemas.loan), updateLoan);
router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteLoan);

module.exports = router;
