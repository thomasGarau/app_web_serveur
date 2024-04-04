const express = require('express')
const router = express.Router()
const { validateField, validate } = require('../middlewares/sanitizeInput.js');
const { verifyTokenBlacklist } = require('../middlewares/verifyAuthorisation.js');
const { useruelist, addue, deleteue, updateue } = require('../controllers/ue-controllers.js') 

router.get('/ue-user', [validateField('token'),verifyTokenBlacklist,validate], useruelist);
router.post('/add-ue', [validateField('id_ue', 'label'),verifyTokenBlacklist,validate], addue);
router.post('/delete-ue', [validateField('id_ue'),verifyTokenBlacklist, validate], deleteue);
router.post('/update-ue', [validateField('id_ue', 'label'),verifyTokenBlacklist, validate], updateue);
module.exports = router;

