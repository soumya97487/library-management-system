// backend/services/bookService.js
const Book   = require('../models/Books');
const Rental = require('../models/Rental');

/**
 * List books, with per‑user rental status.
 */
exports.getAllBooks = async (userId, role) => {
  let q = Book.find().populate('authors').populate('categories');
  if (role === 'member') {
    q = q.populate({
      path:  'rental',
      match: { user: userId },
      select:'status'
    });
  } else {
    q = q.populate({ path: 'rental', select: 'user status' });
  }
  return q.exec();
};

/**
 * Get one book, with per‑user rental status.
 */
exports.getBookById = async (id, userId, role) => {
  let q = Book.findById(id).populate('authors').populate('categories');
  if (role === 'member') {
    q = q.populate({
      path:  'rental',
      match: { user: userId },
      select:'status'
    });
  } else {
    q = q.populate({ path: 'rental', select: 'user status' });
  }
  const book = await q.exec();
  if (!book) throw new Error('Book not found');
  return book;
};

exports.createBook = data => new Book(data).save();

exports.updateBook = async (id, data) => {
  const b = await Book.findByIdAndUpdate(id, data, { new: true })
    .populate('authors').populate('categories');
  if (!b) throw new Error('Book not found');
  return b;
};

exports.deleteBook = async id => {
  const b = await Book.findByIdAndDelete(id);
  if (!b) throw new Error('Book not found');
  return b;
};
