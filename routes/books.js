const express = require('express')
const router = express.Router()
const controller = require('../controllers/bookController')

router.post('/', controller.createBook)
router.get('/', controller.getAllBooks)

module.exports = router