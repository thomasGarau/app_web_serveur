const express = require('express')
const router = express.Router()
const {verifyToken,Authenticate,register, invalidateToken} = require('../controllers/user-controller.js')
const { validateField, validateEmail, validatePassword, validate, hashPassword } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist } = require('../middlewares/verifyAuthorisation.js');

router.post('/login', [validateField('username'), validatePassword(), validate], Authenticate);
router.get('/verify-token',verifyTokenBlacklist ,verifyToken);
router.post('/register', [...validateField('username', 'name', 'firstname'), validatePassword(), hashPassword(), validate], register);
router.post('/Logout', invalidateToken)

module.exports = router;