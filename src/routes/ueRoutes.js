const express = require('express')
const router = express.Router()
const { validateField, handleValidationErrors, exceptionField } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist, verifyAuthorisation, verifyIsAdministration } = require('../middlewares/verifyAuthorisation.js');
const {verifyIsTeacher} = require('../middlewares/verifyAuthorisation.js');
const {verifyIsTeacherOrAdmin} = require('../middlewares/verifyAuthorisation.js');
const { useruelist, uelist, addue, deleteue, updateue, formationuelist, deleteformation, updateformation,addformation,chapitreuelist,addchapitre,updatechapitre,deletechapitre,ueInfo, profUeList } = require('../controllers/ue-controllers.js') 
const {uploadImage} = require('../middlewares/imageCloud');


router.get('/ue-user', [verifyAuthorisation,verifyTokenBlacklist], useruelist);
router.get('/allue', [verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacherOrAdmin], uelist);
router.get('/allue-formation', [validateField('id_formation'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacherOrAdmin], formationuelist);
router.post('/allchapitre-ue', [validateField('id_ue'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], chapitreuelist);
router.post('/ueInfo', [validateField('id_ue'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], ueInfo);
router.get('/ue-enseignant', [verifyAuthorisation, verifyTokenBlacklist], profUeList);


router.post('/add-formation', [exceptionField('label'), validateField('id_formation', 'id_universite'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist,verifyIsAdministration], addformation);
router.post('/add-ue', [exceptionField('label'), validateField('id_formation'),handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist,verifyIsAdministration, uploadImage], addue);
router.post('/add-chapitre', [exceptionField('label'), validateField('id_ue'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacher], addchapitre);

router.post('/delete-ue', [validateField('id_ue'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], deleteue); // role admin 
router.post('/delete-formation', [validateField('id_formation'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], deleteformation); // role admin
router.post('/delete-chapitre', [validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacher], deletechapitre); // role enseignant

router.post('/update-ue', [exceptionField('label'), validateField('id_ue'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration, uploadImage], updateue); // role admin
router.post('/update-formation', [exceptionField('label'), validateField('id_formation'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], updateformation); // role admin
router.post('/update-chapitre', [exceptionField('label'), validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyIsTeacher], updatechapitre); // role enseignant
module.exports = router;

