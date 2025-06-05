
const express = require('express');
const {
  getAllBorrowers,
  getBorrowersById,      
  createBorrower,
  updateBorrower,
  deleteBorrower
} = require('../controllers/borrowerController');
const { protect, restrictTo } = require('../Middlewares/auth');

const router = express.Router();

router.get('/', protect, getAllBorrowers);
router.get('/:id', protect, getBorrowersById);
router.post('/', protect, restrictTo('admin', 'librarian'), createBorrower);
router.put('/:id', protect, restrictTo('admin', 'librarian'), updateBorrower);
router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteBorrower);

module.exports = router;
