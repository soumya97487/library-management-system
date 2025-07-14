const Book = require('../models/Books');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// Initialize GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('pdfs');
});

// ------------------------------
// GET all books
// ------------------------------
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('authors categories');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
// GET book by ID
// ------------------------------
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('authors categories');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
// CREATE book
// ------------------------------
exports.createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ------------------------------
// UPDATE book
// ------------------------------
exports.updateBook = async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Book not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ------------------------------
// DELETE book
// ------------------------------
exports.deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
// DOWNLOAD PDF for Book
// ------------------------------
exports.downloadPdf = async (req, res) => {
  try {
    const { id } = req.params; // Book ID

    // TODO: Verify user has rented the book (optional for now)

    const book = await Book.findById(id);
    if (!book || !book.pdf?.fileId) {
      return res.status(404).send('No PDF available for this book');
    }

    const readStream = gfs.createReadStream({ _id: book.pdf.fileId });
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="${book.pdf.filename}"`);
    readStream.pipe(res);

    readStream.on('error', (err) => {
      res.status(500).json({ error: 'Error reading PDF file' });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
