const express = require('express');
const router = express.Router();
const {validate, validateField} = require('../middlewares/sanitizeInput');
const {verifyTokenBlacklist } = require('../middlewares/verifyAuthorisation');
const { courlist, courById, addcours, updatecours, deletecours } = require('../controllers/cours-controllers');

router.get('/allcours',[verifyTokenBlacklist,validate], courlist);
router.get('/cours-id',[validateField('id_study'), verifyTokenBlacklist,validate], courById);
router.post('/add-cours', [validateField('id_study','label','contenu','id_chapitre'), verifyTokenBlacklist,validate], addcours);
router.post('/update-cours',[validateField('id_study','label','contenu','id_chapitre'),verifyTokenBlacklist,validate], updatecours);
router.post('/delete-cours',[validateField('id_study'),verifyTokenBlacklist,validate], deletecours);

module.exports = router;
