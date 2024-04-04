const userService = require('../services/user-service');

exports.verifyToken = ((req,res) => {
    try {
         // Check if the Authorization header exists in the request
        if (!req.headers.authorization) {
            throw new Error('Authorization header is missing');
        }

        const token = req.headers.authorization.split(' ')[1];
        console.log(token, "bbb")
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
        const {num_etudiant, password} = req.body;
        const token = await userService.authenticateUser(num_etudiant, password);
        res.status(200).send({token: token, days: 7});
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de l authentification');
    }
})

 exports.register = (async (req,res) => {
    try {
        const { email, password } = req.body;
        const token = await userService.registerUser(email, password);
        res.status(200).send({token: token, days: 7});
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Échec de l\'inscription');
    }
})

exports.invalidateToken = (async (req,res) => {
    try {
        console.log(req.body.headers, "kdi");
        console.log(req.headers.authorization, "xxx")
        const token = req.headers.authorization.split(' ')[1];
        console.log(token, "yyy")
        const decoded = await userService.invalidateToken(token);
        res.status(200).send({username: decoded.userName});
    } catch (err) {
        console.error(err);
        res.status(401).send('Token invalide');
    }
});


