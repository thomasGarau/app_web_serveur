const express = require('express');
const router = express.Router();
const {verifyTokenBlacklist, verifyAuthorisation } = require('../middlewares/verifyAuthorisation');
const { verifyIsStuddent } = require('../middlewares/verifyAuthorisation');
const {validateObjectSchema} = require('../middlewares/sanitizeInput');
const {schemaInteraction} = require('../models_JSON/trackingDataValidation');
const {ajouterSuivisActivite, makePrediction, ajoutCalendrier, getCalendrier} = require('../controllers/j-methode-controller');

router.post('/recolteInteraction', [validateObjectSchema(schemaInteraction), verifyAuthorisation, verifyTokenBlacklist, verifyIsStuddent], ajouterSuivisActivite);
router.get('/prediction', [verifyAuthorisation, verifyTokenBlacklist, verifyIsStuddent], makePrediction);
router.post('/ajouterCalendrier', [verifyAuthorisation, verifyTokenBlacklist, verifyIsStuddent], ajoutCalendrier);
router.post('/getCalendrier', [verifyAuthorisation, verifyTokenBlacklist, verifyIsStuddent], getCalendrier);

module.exports = router;