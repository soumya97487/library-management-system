const express = require('express')
const router = express.Router()
const controller = require('../controllers/authorController')

router.post('/', controller.createAuthor)

module.exports = router