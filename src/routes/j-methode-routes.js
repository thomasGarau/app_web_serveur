const express = require('express');
const router = express.Router();
const { validateField} = require('../middlewares/sanitizeInput');
const {verifyTokenBlacklist, verifyAuthorisation } = require('../middlewares/verifyAuthorisation');
const { verifyIsStuddent } = require('../middlewares/verifyAuthorisation');
const {jMethode} = require('../middlewares/sanitizeInput');
const {validateJtrackingType} = jMethode;
const {ajouterSuivisActivite, makePrediction} = require('../controllers/j-methode-controller');

router.post('/recolteInteraction', [validateJtrackingType, verifyAuthorisation, verifyTokenBlacklist, verifyIsStuddent], ajouterSuivisActivite);
router.get('/prediction', [verifyAuthorisation, verifyTokenBlacklist, verifyIsStuddent], makePrediction);

module.exports = router;