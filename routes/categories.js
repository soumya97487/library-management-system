const express = require('express')
const router = express.Router()
const controller = require('../controllers/categoryController')

router.post('/', controller.createCategory)

module.exports = router