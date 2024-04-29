const express = require('express')
const router = express.Router()
const { validateField, validate } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist, verifyAuthorisation, verifyIsAdministration } = require('../middlewares/verifyAuthorisation.js');
const {verifyIsTeacher} = require('../middlewares/verifyAuthorisation.js');
const { useruelist, uelist, addue, deleteue, updateue, formationuelist, deleteformation, updateformation,addformation } = require('../controllers/ue-controllers.js') 

router.get('/ue-user', [verifyAuthorisation,verifyTokenBlacklist,validate], useruelist);
router.get('/allue', [verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacher], uelist);
router.get('/allue-formation', [validateField('id_formation'),verifyAuthorisation, verifyTokenBlacklist,verifyIsTeacher], formationuelist);

router.post('/add-formation', [validateField('id_formation', 'label', 'id_universite'),verifyAuthorisation, verifyTokenBlacklist,verifyIsAdministration], addformation);
router.post('/add-ue', [validateField('label', 'id_formation'),verifyAuthorisation, verifyTokenBlacklist], addue);

router.post('/delete-ue', [validateField('id_ue'),verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], deleteue); // role admin 
router.post('/delete-formation', [validateField('id_formation'),verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], deleteformation); // role admin

router.post('/update-ue', [validateField('id_ue', 'label'),verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], updateue); // role admin
router.post('/update-formation', [validateField('id_formation', 'label'),verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], updateformation); // role admin
module.exports = router;

