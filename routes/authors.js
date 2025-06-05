// routes/authors.js
const express = require('express');
const {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor
} = require('../controllers/authorController');
const { protect, restrictTo } = require('../Middlewares/auth');

const router = express.Router();

// Any authenticated user (including “member”) can view authors:
router.get('/', protect, getAllAuthors);
router.get('/:id', protect, getAuthorById);

// Only “admin” or “librarian” can create, update, delete authors:
router.post('/', protect, restrictTo('admin', 'librarian'), createAuthor);
router.put('/:id', protect, restrictTo('admin', 'librarian'), updateAuthor);
router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteAuthor);

module.exports = router;
