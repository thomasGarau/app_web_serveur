const userService = require('../services/user-service');

exports.verifyToken = ((req,res) => {
    try {
        const token = req.query.token;
        if(!token || token == 'undefined' || token == 'null'){
            throw new Error('Token invalide');
        }else{
            const decoded = userService.verifyToken(token);
            res.status(200).send({valide:true, information:decoded});
        }
    } catch (err) {
        console.error(err);
        res.status(401).send('Token invalide');
    }
})

exports.Authenticate = (async (req,res) => {
    try {
        const {username, password} = req.body;
        const token = await userService.authenticateUser(username, password);
        res.status(200).send({username: username, token: token, days: 7});
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de l authentification');
    }
})

 exports.register = (async (req,res) => {
    try {
        const { username, password, name, firstname } = req.body;
        if(!await userService.userExist(username)){
            const token = await userService.registerUser(username, password, name, firstname);
            res.status(200).send({username: username, token: token, days: 7});
        }else{
            res.status(401).send("Nom d utilisateur déjà utilisé");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Échec de l\'inscription');
    }

})

