// routes/categories.js
const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, restrictTo } = require('../Middlewares/auth');

const router = express.Router();

router.get('/', protect, getAllCategories);

router.get('/:id', protect, getCategoryById);

router.post('/', protect, restrictTo('admin', 'librarian'), createCategory);

router.put('/:id', protect, restrictTo('admin', 'librarian'), updateCategory);

router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteCategory);

module.exports = router;
