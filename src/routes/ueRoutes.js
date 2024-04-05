const express = require('express')
const router = express.Router()
const { validateField, validate } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist } = require('../middlewares/verifyAuthorisation.js');
const {verifyRoleAdmin} = require('../middlewares/verifyAuthorisation.js');
const { useruelist, uelist, addue, deleteue, updateue } = require('../controllers/ue-controllers.js') 

router.get('/ue-user', [validateField('token'),verifyTokenBlacklist,validate], useruelist);
router.get('/allue', [verifyTokenBlacklist], verifyRoleAdmin , uelist);
router.post('/add-ue', [validateField('id_ue', 'label'),verifyTokenBlacklist,verifyRoleAdmin,validate], addue);
router.post('/delete-ue', [validateField('id_ue'),verifyTokenBlacklist, validate], deleteue); // role admin ou seul le createur ?
router.post('/update-ue', [validateField('id_ue', 'label'),verifyTokenBlacklist, validate], updateue); // role admin ou seul le createur
module.exports = router;

