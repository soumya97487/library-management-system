const express = require('express')
const router = express.Router()
const controller = require('../controllers/borrowerController')

router.get('/', controller.getAllBorrowers)
router.get('/:id', controller.getBorrowersById)
router.post('/', controller.createBorrower)
router.put('/:id', controller.updateBorrower)
router.delete('/:id', controller.deleteBorrower)

module.exports = router

















