const express = require('express')
const authController = require('../controllers/auth.controller')
const router = express.Router()


router.post('/signin', authController.adminLogin);
router.get('/profile', authController.getProfile)

module.exports = router;