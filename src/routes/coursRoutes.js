const express = require('express');
const router = express.Router();
const {handleValidationErrors, validateField, exceptionField} = require('../middlewares/sanitizeInput');
const {verifyTokenBlacklist, verifyAuthorisation, verifyIsTeacher } = require('../middlewares/verifyAuthorisation');
const {verifyOwner} = require('../middlewares/verifyAuthorisation');
const {ueConfig} = require('../middlewares/objectConfig.js');
const { courlist, courById, addcours, updatecours, deletecours, ChapitreById, addProgression } = require('../controllers/cours-controllers');
const { uploadCoursFile, fetchIdUe, determineCourseType } = require('../middlewares/cours-middleware');

router.post('/allcours-chapitre',[validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist] , courlist);
router.post('/cours-id',[validateField('id_study'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], courById);
router.post('/getChapitreById', [validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], ChapitreById);

router.post('/add-cours', [validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation,verifyTokenBlacklist, verifyIsTeacher, uploadCoursFile, fetchIdUe, determineCourseType], addcours);
router.post('/update-cours',[exceptionField('label'), validateField('id_study'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyIsTeacher, verifyOwner(ueConfig,"id_study")], updatecours);
router.post('/delete-cours',[validateField('id_study'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyIsTeacher, verifyOwner(ueConfig,"id_study")], deletecours);

router.post('/add-cours-progression', [validateField('id_study', 'progression'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], addProgression);
module.exports = router;
