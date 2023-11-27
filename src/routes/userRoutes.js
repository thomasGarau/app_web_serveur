const express = require('express')
const router = express.Router()
const {verifyToken,Authenticate,register} = require('../controllers/user-controller.js')
const { validateField, validateEmail, validatePassword, validate, hashPassword } = require('../middlewares/sanitizeInput.js');

router.post('/login', [validateField('username'), validatePassword(), validate], Authenticate);
router.get('/verify-token', verifyToken);
router.post('/register', [...validateField('username', 'name', 'firstname'), validatePassword(), hashPassword(), validate], register);

module.exports = router;