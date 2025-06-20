
const express = require('express');
const { validate, schemas } = require('../middlewares/validate');
const {
  getAllBorrowers,
  getBorrowerById,      
  createBorrower,
  updateBorrower,
  deleteBorrower
} = require('../controllers/borrowerController');
const { protect, restrictTo } = require('../middlewares/auth');
const router = express.Router();

router.get('/', protect, getAllBorrowers);
router.get('/:id', protect, getBorrowerById);
router.post('/', protect, restrictTo('admin', 'librarian'),validate(schemas.borrower), createBorrower);
router.put('/:id', protect, restrictTo('admin', 'librarian'),validate(schemas.borrower), updateBorrower);
router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteBorrower);

module.exports = router;
