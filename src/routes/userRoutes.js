const express = require('express')
const router = express.Router()
const {verifyToken,Authenticate,register, invalidateToken, getUserInfo} = require('../controllers/user-controller.js')
const { validateField, validateEmail, validatePassword, validate, hashPassword } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist, verifyAuthorisation, verifyOwner } = require('../middlewares/verifyAuthorisation.js');
const { userConfig } = require('../middlewares/objectConfig.js');

router.get('/getUserInfo', [verifyAuthorisation, verifyTokenBlacklist, verifyOwner(userConfig, "user")], getUserInfo);
router.get('/verify-token',verifyTokenBlacklist ,verifyToken);

router.post('/login', [validateField('num_etudiant'), validatePassword(), validate], Authenticate);
router.post('/register', [validatePassword(), validateEmail(), hashPassword(), validate], register);
router.post('/logout', invalidateToken)

router.put('/update', [verifyAuthorisation, verifyTokenBlacklist, validatePassword, validateEmail, hashPassword, verifyOwner(userConfig) ], updateUser);

module.exports = router;