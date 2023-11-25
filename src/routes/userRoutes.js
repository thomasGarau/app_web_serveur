const express = require('express')
const router = express.Router()
const  {verifyToken,Authenticate,register} = require('../controllers/user-controller.js')

router.get('/login', Authenticate);
router.get('/verify-token', verifyToken);
router.post('/register', register);

module.exports = router;