const express = require('express');
const router = express.Router();
const { uploadCSVFile } = require('../middlewares/csv-middlewares'); // Assurez-vous que le chemin est correct
const { verifyTokenBlacklist, verifyAuthorisation, verifyIsAdministration } = require('../middlewares/verifyAuthorisation.js');
const { handleValidationErrors, validateField, exceptionField } = require('../middlewares/sanitizeInput');
const {creerUtilisateur, creerFormation} = require('../controllers/administration-controller');

router.post('/ajouter-utilisateur', [verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration, uploadCSVFile], creerUtilisateur);
router.post('ajouter-formation', [verifyAuthorisation, verifyTokenBlacklist, verifyIsAdministration], creerFormation);

module.exports = router;