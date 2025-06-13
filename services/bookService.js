const Book = require('../models/Books');

exports.getAllBooks = async () => {
  return await Book.find().populate('authors').populate('categories');
};

exports.getBookById = async (id) => {
  const book = await Book.findById(id).populate('authors').populate('categories');
  if (!book) throw new Error('Book not found');
  return book;
};

exports.createBook = async (data) => {
  const book = new Book(data);
  return await book.save();
};

exports.updateBook = async (id, data) => {
  const updated = await Book.findByIdAndUpdate(id, data, {
    new: true,
  }).populate('authors').populate('categories');
  if (!updated) throw new Error('Book not found');
  return updated;
};

exports.deleteBook = async (id) => {
  const deleted = await Book.findByIdAndDelete(id);
  if (!deleted) throw new Error('Book not found');
  return deleted;
};
