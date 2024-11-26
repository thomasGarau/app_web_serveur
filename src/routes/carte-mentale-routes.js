const express = require('express');
const router = express.Router();
const { verifyTokenBlacklist, verifyAuthorisation, verifyOwner, verifyVisibility } = require('../middlewares/verifyAuthorisation.js');
const { validateField, handleValidationErrors, validateObjectSchema, exceptionField } = require('../middlewares/sanitizeInput.js');
const {uploadImage} = require('../middlewares/imageCloud');
const {parseMultipartJson} = require('../middlewares/parse-data-middleawre');
 
const {cmConfig, cmVisibilityConfig} = require('../middlewares/objectConfig.js');
const {carteMentaleSchema, updateCarteMentaleSchema } = require('../models_JSON/carteMentaleValidation.js');

const {userCM, allCMChapter, cmInfo, cmDetails, createCM, updateCM, deleteCM, addToCollection, removeFromCollection} = require('../controllers/carte-mentale-controllers');

router.post('/user-cm', [validateField('chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], userCM);
router.post('/all-cm-chapter', [validateField('chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], allCMChapter);
router.post('/cm-info', [validateField('cm'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], cmInfo); //es favorie ou pas
router.post('/cm-details', [validateField('cm'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], cmDetails);

router.post('/create-cm', [uploadImage, parseMultipartJson, validateObjectSchema(carteMentaleSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], createCM);
router.put('/update-cm', [uploadImage, parseMultipartJson, validateObjectSchema(updateCarteMentaleSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(cmConfig, "cm")], updateCM);
router.delete('/delete-cm', [validateField('cm'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(cmConfig, "cm")], deleteCM);

router.post('/add-cm-to-collection', [validateField('cm'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyVisibility(cmVisibilityConfig, "cm")], addToCollection);
router.delete('/remove-cm-from-collection', [validateField('cm'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], removeFromCollection);

module.exports = router;