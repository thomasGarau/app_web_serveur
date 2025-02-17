const express = require('express')
const router = express.Router()
const {verifyToken,Authenticate,register, invalidateToken, getUserInfo, updateUser, sendResetEmail, updatePassword, updateProfilPicture} = require('../controllers/user-controller.js')
const { exceptionField, validateField, validateEmail, validatePassword, handleValidationErrors, hashPassword, validateRegistrationFields, validateObjectSchema } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist, verifyAuthorisation, verifyOwner } = require('../middlewares/verifyAuthorisation.js');
const { userConfig } = require('../middlewares/objectConfig.js');
const { updateUserSchema } = require('../models_JSON/userValidation.js');
const {uploadImage} = require('../middlewares/imageCloud');

router.get('/getUserInfo', [verifyAuthorisation, verifyTokenBlacklist, verifyOwner(userConfig, "user")], getUserInfo);
router.get('/verify-token', verifyTokenBlacklist ,verifyToken);

router.post('/login', [validateField('num_etudiant'), handleValidationErrors, validatePassword()], Authenticate);
router.post('/register', [exceptionField("nom", "prenom"), validateField("consentement"), validateRegistrationFields, validatePassword(), validateEmail(), hashPassword()], register);
router.post('/logout', invalidateToken)

router.put('/updateUser', [exceptionField("nom", "prenom"), validateObjectSchema(updateUserSchema), verifyAuthorisation, verifyTokenBlacklist, validatePassword(), validateEmail(), hashPassword(), verifyOwner(userConfig, "user")], updateUser);
router.put('/updateUserProfilePicture', [verifyAuthorisation, verifyTokenBlacklist, verifyOwner(userConfig, "user"), uploadImage], updateProfilPicture)

router.post('/forgetPassword', [validateField('num_etudiant'), handleValidationErrors], sendResetEmail)
router.post('/updatePassword', [validateField('num_etudiant', 'verif_code'), handleValidationErrors, validatePassword(), hashPassword()], updatePassword)

module.exports = router;