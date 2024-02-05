const express = require('express')
const router = express.Router()
const {getQuizzForUe} = require('../controllers/secure-page-controller.js');
const {verifyAuthorisation} = require('../middlewares/verifyAuthorisation.js');

router.get('/quizzForUe', verifyAuthorisation, getQuizzForUe);


module.exports = router;