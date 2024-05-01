const express = require('express')
const router = express.Router()
const { validateField, validate } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist, verifyAuthorisation, verifyIsAdministration } = require('../middlewares/verifyAuthorisation.js');
const {verifyIsTeacher} = require('../middlewares/verifyAuthorisation.js');
const {verifyIsTeacherOrAdmin} = require('../middlewares/verifyAuthorisation.js');
const { useruelist, uelist, addue, deleteue, updateue, formationuelist, deleteformation, updateformation,addformation,chapitreuelist,addchapitre,updatechapitre,deletechapitre,ue } = require('../controllers/ue-controllers.js') 
const {uploadImage} = require('../middlewares/imageCloud');


router.get('/ue-user', [verifyAuthorisation,verifyTokenBlacklist,validate], useruelist);
router.get('/allue', [verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacherOrAdmin], uelist);
router.get('/allue-formation', [validateField('id_formation'),verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacherOrAdmin], formationuelist);
router.post('/allchapitre-ue', [validateField('id_ue'),verifyAuthorisation, verifyTokenBlacklist], chapitreuelist);

router.post('/add-formation', [validateField('id_formation', 'label', 'id_universite'),verifyAuthorisation, verifyTokenBlacklist,verifyIsAdministration], addformation);
router.post('/add-ue', [validateField('label', 'id_formation'),verifyAuthorisation, verifyTokenBlacklist,verifyIsAdministration, uploadImage], addue);
router.post('/add-chapitre', [validateField('label', 'id_ue'),verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacher], addchapitre);

router.post('/delete-ue', [validateField('id_ue'),verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], deleteue); // role admin 
router.post('/delete-formation', [validateField('id_formation'),verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], deleteformation); // role admin
router.post('/delete-chapitre', [validateField('id_chapitre'),verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacher], deletechapitre); // role enseignant

router.post('/update-ue', [validateField('id_ue', 'label'),verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration, uploadImage], updateue); // role admin
router.post('/update-formation', [validateField('id_formation', 'label'),verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], updateformation); // role admin
router.post('/update-chapitre', [validateField('id_chapitre', 'label'),verifyAuthorisation, verifyTokenBlacklist, verifyIsTeacher], updatechapitre); // role enseignant
module.exports = router;

