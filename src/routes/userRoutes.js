const express = require('express')
const router = express.Router()
const  {verifyTokenAndAuthorization,Authenticate,register} = require('../controllers/user-controller.js')

router.get('/login', Authenticate);
router.get('/verify-token', verifyTokenAndAuthorization);
router.post('/register', register);

module.exports = router;