const userService = require('../services/user-service');
const validInput = require('../services/input-service');

exports.verifyTokenAndAuthorization = ((req,res) => {
    res.send('verifyTokenAndAuthorization');
})

exports.Authenticate = (async (req,res) => {
    try {
        const token = await userService.authenticateUser(req.query.username, req.query.password);
        res.json(token);
    } catch (err) {
        console.error(err);
        res.status(401).send('Echec de l authentification');
    }
})

exports.register = ((req,res) => {
    try {
        if(validInput(req.query.username, req.query.password, req.query.name, req.query.firstname) && !userService.userExist()){
            console.log('entrer register if')
            userService.registerUser(req.query.username, req.query.password, req.query.name, req.query.firstName);
            res.status(200).send('Inscription réussie');
        }
    }catch (err) {
        console.error(err);
        res.status(401).send('Echec de l inscription');
    }
})