const express = require('express')
const {signup, login, verifyEmail} = require('../controllers/authController')
const router = express.Router()
const {validate, schemas} = require('../middlewares/validate')

router.post('/signup',validate(schemas.userSignup), signup);
router.post('/login',validate(schemas.userLogin), login)
router.get('/verify/:token', verifyEmail)

module.exports = router