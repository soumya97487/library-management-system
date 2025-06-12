
const express = require('express');
const {
  getAllBorrowers,
  getBorrowersById,      
  createBorrower,
  updateBorrower,
  deleteBorrower
} = require('../controllers/borrowerController');
const { protect, restrictTo } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');

const router = express.Router();

router.get('/', protect, getAllBorrowers);
router.get('/:id', protect, getBorrowersById);
router.post('/', protect, restrictTo('admin', 'librarian'),validate(schemas.borrower), createBorrower);
router.put('/:id', protect, restrictTo('admin', 'librarian'),validate(schemas.borrower), updateBorrower);
router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteBorrower);

module.exports = router;
