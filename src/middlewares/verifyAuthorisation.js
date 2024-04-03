const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../services/user-service');

const verifyAuthorisation = (req, res, next) => {   
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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