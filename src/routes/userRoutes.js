const express = require('express')
const router = express.Router()
const {verifyToken,Authenticate,register, invalidateToken, getUserInfo, updateUser} = require('../controllers/user-controller.js')
const { validateField, validateEmail, validatePassword, validate, hashPassword, validateRegistrationFields } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist, verifyAuthorisation, verifyOwner } = require('../middlewares/verifyAuthorisation.js');
const { userConfig } = require('../middlewares/objectConfig.js');
const { userValidation } = require('../middlewares/sanitizeInput.js');
const { updateUserType } = userValidation;

router.get('/getUserInfo', [verifyAuthorisation, verifyTokenBlacklist, verifyOwner(userConfig, "user")], getUserInfo);
router.get('/verify-token',verifyTokenBlacklist ,verifyToken);

router.post('/login', [validateField('num_etudiant'), validatePassword(), validate], Authenticate);
router.post('/register', [validateRegistrationFields, validatePassword(), validateEmail(), hashPassword(), validate], register);
router.post('/logout', invalidateToken)

router.put('/updateUser', [updateUserType, verifyAuthorisation, verifyTokenBlacklist, validatePassword(), validateEmail(), hashPassword(), verifyOwner(userConfig, "user")], updateUser);

module.exports = router;