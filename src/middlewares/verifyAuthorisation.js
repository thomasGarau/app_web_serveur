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

const verifyOwner = (config, idParamName) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id_utilisateur;

        const objectId = req.body[idParamName];

        const { tableName, userIdColumn, objectIdColumn } = config;

        const query = `SELECT * FROM ${tableName} WHERE ${objectIdColumn} = ? AND ${userIdColumn} = ? LIMIT 1`;
        const [rows] = await db.query(query, [objectId, userId]);

        if (rows.length > 0) {
            next();
        } else {
            return res.status(403).send('Accès non autorisé.');
        }
    } catch (error) {
        return res.status(401).send('Token invalide ou problème d\'authentification.');
    }
};



module.exports = {
    verifyAuthorisation,
    verifyTokenBlacklist,
    verifyOwner
}