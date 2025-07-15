// backend/routes/books.js

const express    = require('express');
const mongoose   = require('mongoose');
const multer     = require('multer');
const { GridFSBucket } = require('mongodb');
const { protect, restrictTo } = require('../middlewares/auth');
const { validate, schemas }   = require('../middlewares/validate');
const bookCtrl   = require('../controllers/bookController');
const Rental     = require('../models/Rental');
const Book       = require('../models/Books');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ---------- CRUD routes ----------
router.get('/',    protect, bookCtrl.getAllBooks);
router.get('/:id', protect, bookCtrl.getBookById);

router.post(
  '/',
  protect,
  restrictTo('admin', 'librarian'),
  validate(schemas.book),
  bookCtrl.createBook
);

router.put(
  '/:id',
  protect,
  restrictTo('admin', 'librarian'),
  validate(schemas.book),
  bookCtrl.updateBook
);

router.delete(
  '/:id',
  protect,
  restrictTo('admin', 'librarian'),
  bookCtrl.deleteBook
);

// ---------- PDF Upload (admins/librarians) ----------
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
      const stream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: { book: bookId }
      });

      stream.end(req.file.buffer);

      stream.on('finish', async () => {
        await Book.findByIdAndUpdate(bookId, {
          pdf: { fileId: stream.id, filename: stream.filename }
        });
        res.json({ success: true, fileId: stream.id });
      });

      stream.on('error', err => res.status(500).json({ error: err.message }));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ---------- PDF Download (admins/librarians & paid members) ----------
router.get(
  '/:id/pdf/download',
  protect,
  async (req, res) => {
    try {
      const bookId = req.params.id;
      const user  = req.user; // { _id, role, ... }

      // Fetch the Book to get its fileId
      const book = await Book.findById(bookId);
      if (!book?.pdf?.fileId) {
        return res.status(404).send('No PDF available');
      }

      // If member, verify they have a PAID rental for this book
      if (user.role === 'member') {
        const paidRental = await Rental.findOne({
          book:   bookId,
          user:   user._id,
          status: 'paid'
        });
        if (!paidRental) {
          return res.status(403).send('You have not paid for this book');
        }
      }

      // Stream the PDF from GridFS
      const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'pdfs' });
      const downloadStream = bucket.openDownloadStream(book.pdf.fileId);

      res.set('Content-Type', 'application/pdf');
      downloadStream.pipe(res);

      downloadStream.on('error', () => res.sendStatus(404));
    } catch (err) {
      console.error('PDF download error:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
