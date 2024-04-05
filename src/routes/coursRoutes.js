const express = require('express');
const router = express.Router();
const {validate, validateField} = require('../middlewares/sanitizeInput');
const {verifyTokenBlacklist } = require('../middlewares/verifyAuthorisation');
const {verifyRoleAdmin} = require('../middlewares/verifyAuthorisation');
const {verifyOwner} = require('../middlewares/verifyAuthorisation');
const {coursConfig} = require('../middlewares/objectConfig.js');
const { courlist, courById, addcours, updatecours, deletecours } = require('../controllers/cours-controllers');

router.get('/allcours',[verifyTokenBlacklist,validate] , courlist); // les etudiants peuvent voir les cours
router.get('/cours-id',[validateField('id_study'), verifyTokenBlacklist,validate], courById);
router.post('/add-cours', [validateField('id_study','label','contenu','id_chapitre'), verifyRoleAdmin, verifyTokenBlacklist,validate], addcours);
router.post('/update-cours',[validateField('id_study','label','contenu','id_chapitre'),verifyTokenBlacklist,validate], updatecours); // role admin ou reservé au créateur?
router.post('/delete-cours',[validateField('id_study'),verifyTokenBlacklist,validate], deletecours);// role admin ou reservé au créateur?

module.exports = router;
