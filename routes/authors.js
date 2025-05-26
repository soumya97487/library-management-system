const express = require('express')
const router = express.Router()
const controller = require('../controllers/authorController')

router.post('/', controller.createAuthor)
router.get('/', controller.getAllAuthors);
router.get('/:id', controller.getAuthorById);
router.put('/:id', controller.updateAuthor);
router.delete('/:id', controller.deleteAuthor);

module.exports = router