// routes/categories.js
const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');

const router = express.Router();

router.get('/', protect, getAllCategories);

router.get('/:id', protect, getCategoryById);

router.post('/', protect, restrictTo('admin', 'librarian'),validate(schemas.category), createCategory);

router.put('/:id', protect, restrictTo('admin', 'librarian'),validate(schemas.category), updateCategory);

router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteCategory);

module.exports = router;
