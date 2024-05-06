const express = require('express')
const router = express.Router()
const {verifyToken,Authenticate,register, invalidateToken, getUserInfo, updateUser, sendResetEmail, updatePassword} = require('../controllers/user-controller.js')
const { validateField, validateEmail, validatePassword, handleValidationErrors, hashPassword, validateRegistrationFields } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist, verifyAuthorisation, verifyOwner } = require('../middlewares/verifyAuthorisation.js');
const { userConfig } = require('../middlewares/objectConfig.js');
const { userValidation } = require('../middlewares/sanitizeInput.js');
const { updateUserType } = userValidation;

router.get('/getUserInfo', [verifyAuthorisation, verifyTokenBlacklist, verifyOwner(userConfig, "user")], getUserInfo);
router.get('/verify-token',verifyTokenBlacklist ,verifyToken);

router.post('/login', [validateField('num_etudiant'), handleValidationErrors, validatePassword()], Authenticate);
router.post('/register', [validateRegistrationFields, validatePassword(), validateEmail(), hashPassword()], register);
router.post('/logout', invalidateToken)

router.put('/updateUser', [updateUserType, verifyAuthorisation, verifyTokenBlacklist, validatePassword(), validateEmail(), hashPassword(), verifyOwner(userConfig, "user")], updateUser);
router.post('/forgetPassword', [validateField('num_etudiant'), handleValidationErrors], sendResetEmail)
router.post('/updatePassword', [validateField('num_etudiant', 'verif_code'), handleValidationErrors, validatePassword(), hashPassword()], updatePassword)

module.exports = router;