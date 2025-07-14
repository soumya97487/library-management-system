// backend/routes/books.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const { protect, restrictTo } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const Book = require('../models/Books');

const router = express.Router();

// ------------------------------
// Regular CRUD routes
// ------------------------------
router.get('/', protect, getAllBooks);
router.get('/:id', protect, getBookById);
router.post(
  '/',
  protect, restrictTo('admin', 'librarian'),
  validate(schemas.book),
  createBook
);
router.put(
  '/:id',
  protect, restrictTo('admin', 'librarian'),
  validate(schemas.book),
  updateBook
);
router.delete('/:id', protect, restrictTo('admin', 'librarian'), deleteBook);

// ------------------------------
// PDF upload (GridFS)
// ------------------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/:id/pdf',
  protect,
  restrictTo('admin', 'librarian'),
  upload.single('pdf'),
  async (req, res) => {
    try {
      const bookId = req.params.id;
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'pdfs' });
      const uploadStream = bucket.openUploadStream(
        req.file.originalname,
        {
          contentType: req.file.mimetype,
          metadata: { book: bookId }
        }
      );
      uploadStream.end(req.file.buffer);

      uploadStream.on('finish', async () => {
        const fileId = uploadStream.id;
        await Book.findByIdAndUpdate(bookId, {
          pdf: { fileId, filename: uploadStream.filename }
        });
        res.json({ success: true, fileId });
      });
      uploadStream.on('error', err => res.status(500).json({ error: err.message }));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ------------------------------
// PDF download (GridFS)
// ------------------------------
router.get(
  '/:id/pdf/download',
  protect,
  restrictTo('admin', 'librarian'),
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book.pdf?.fileId) return res.status(404).send('No PDF available');

      const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'pdfs' });
      const downloadStream = bucket.openDownloadStream(book.pdf.fileId);

      res.set('Content-Type', 'application/pdf');
      downloadStream.pipe(res);

      downloadStream.on('error', () => res.sendStatus(404));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
