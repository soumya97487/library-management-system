const authorService = require('../services/authorService');

exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await authorService.getAllAuthors();
    res.status(200).json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await authorService.getAuthorById(req.params.id);
    res.status(200).json(author);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

exports.createAuthor = async (req, res) => {
  try {
    const author = await authorService.createAuthor(req.body);
    res.status(201).json(author);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const updated = await authorService.updateAuthor(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    await authorService.deleteAuthor(req.params.id);
    res.status(200).json({ message: 'Author deleted' });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};
