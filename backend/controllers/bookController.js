// backend/controllers/bookController.js
const bookService = require('../services/bookService');

exports.getAllBooks = async (req, res) => {
  try {
    const { _id:userId, role } = req.user;
    const books = await bookService.getAllBooks(userId, role);
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { _id:userId, role } = req.user;
    const book = await bookService.getBookById(req.params.id, userId, role);
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updated = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(200).json({ message: 'Book deleted' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
