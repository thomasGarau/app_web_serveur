const userService = require('../services/user-service');
const inputService = require('../services/input-service');

exports.verifyTokenAndAuthorization = ((req,res) => {
    res.send('verifyTokenAndAuthorization');
})

exports.Authenticate = (async (req,res) => {
    try {
        const {username, password} = req.query;
        const token = await userService.authenticateUser(username, password);
        res.status(200).send({username: username, token: token, days: 7});
    } catch (err) {
        console.error(err);
        res.status(401).send('Echec de l authentification');
    }
})

 exports.register = (async (req,res) => {
    try {
        const {username, password, name, firstName} = req.body.params;
        if(inputService.validInput(username, password, name, firstName) && !await userService.userExist(username)){
            const token = await userService.registerUser(username, password, name, firstName);
            console.log(token);
            res.status(200).send({username: username, token: token, days: 7});
        }else{
            res.status(401).send("Nom d utilisateur déjà utilisé");
        }
    }catch (err) {
        console.error(err);
        res.status(401).send('Echec de l inscription');
    }
})