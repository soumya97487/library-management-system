// routes/books.js
const express = require('express');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect, restrictTo } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');

const router = express.Router();

router.get('/', protect, getAllBooks);

router.get('/:id', protect, getBookById);

router.post('/', protect, restrictTo('admin', 'librarian'),validate(schemas.book), createBook);

router.put('/:id', protect, restrictTo('admin', 'librarian'),validate(schemas.book), updateBook);

router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteBook);

module.exports = router;
