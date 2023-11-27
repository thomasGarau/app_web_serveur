const express = require('express')
const router = express.Router()
const {testSecure} = require('../controllers/secure-page-controller.js');
const {verifyAuthorisation} = require('../middlewares/verifyAuthorisation.js');

router.get('/test-secure', verifyAuthorisation, testSecure);


module.exports = router;