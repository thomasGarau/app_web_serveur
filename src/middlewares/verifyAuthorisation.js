const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../services/user-service');

const verifyAuthorisation = (req, res, next) => {   
    const token = req.headers['token'];
    const authorisation = req.headers['authorization'];
    if (!token) {
        return res.status(403).send("Vous n'êtes pas autorisé à accéder à cette ressource");
    }

    try {
        const bearer = token.split(' '); // Supposer que le token est envoyé comme "Bearer <token>"
        const bearerToken = bearer[1];
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Token invalide');
    }

    return next();
};

const verifyTokenBlacklist = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        console.log(token," aa");
        if (await isTokenBlacklisted(token)) {
            console.log("invalide")
            return res.status(401).send('Token invalide');
        }
    }catch(err){
        console.error(err);
        return res.status(401).send('Token invalide');
    }
    console.log("valide")
    next();
};

module.exports = {
    verifyAuthorisation,
    verifyTokenBlacklist
}