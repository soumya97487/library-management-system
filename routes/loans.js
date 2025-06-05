
const express = require('express');
const {
  getAllLoans,    
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan
} = require('../controllers/loanController');
const { protect, restrictTo } = require('../Middlewares/auth');

const router = express.Router();

router.get('/', protect, getAllLoans);
router.get('/:id', protect, getLoanById);

router.post('/', protect, restrictTo('admin', 'librarian'), createLoan);
router.put('/:id', protect, restrictTo('admin', 'librarian'), updateLoan);
router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteLoan);

module.exports = router;
