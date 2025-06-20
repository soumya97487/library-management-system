const Author = require('../models/Author');

exports.getAllAuthors = async () => {
  return await Author.find();
};

exports.getAuthorById = async (id) => {
  const author = await Author.findById(id);
  if (!author) throw new Error('Author not found');
  return author;
};

exports.createAuthor = async (data) => {
  const author = new Author(data);
  return await author.save();
};

exports.updateAuthor = async (id, data) => {
  const updated = await Author.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error('Author not found');
  return updated;
};

exports.deleteAuthor = async (id) => {
  const deleted = await Author.findByIdAndDelete(id);
  if (!deleted) throw new Error('Author not found');
  return deleted;
};
