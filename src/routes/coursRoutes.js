const express = require('express');
const router = express.Router();
const {handleValidationErrors, validateField, exceptionField} = require('../middlewares/sanitizeInput');
const {verifyTokenBlacklist, verifyAuthorisation, verifyIsTeacher } = require('../middlewares/verifyAuthorisation');
const {verifyOwner} = require('../middlewares/verifyAuthorisation');
const {ueConfig} = require('../middlewares/objectConfig.js');
const { courlist, courById, addcours, updatecours, deletecours, ChapitreById } = require('../controllers/cours-controllers');
const { uploadCoursFile, fetchIdUe, determineCourseType } = require('../middlewares/cours-middleware');

router.post('/allcours-chapitre',[validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist] , courlist);
router.post('/cours-id',[validateField('id_study'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], courById); // plus renvoyer le cours mais la ressources  // ajouter la progression
router.post('/getChapitreById', [validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], ChapitreById);

router.post('/add-cours', [exceptionField('label'), validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation,verifyTokenBlacklist, verifyIsTeacher, determineCourseType, fetchIdUe, uploadCoursFile], addcours);
router.post('/update-cours',[exceptionField('contenu', 'label'), validateField('id_study'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyIsTeacher, verifyOwner(ueConfig,"id_study")], updatecours);
router.post('/delete-cours',[validateField('id_study'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyIsTeacher, verifyOwner(ueConfig,"id_study")], deletecours); //supprimer la ressources

//update progression cours

module.exports = router;
