const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../services/user-service');
const db = require('../../config/database.js');
const {getIdUtilisateurFromToken, getRoleUtilisateurFromToken} = require('../services/user-service');

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

const verifyOwnerOrTeacherOfStudent = (config, idParamName) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id_utilisateur;
        const objectId = req.body[idParamName]
        const studentId = await findOwnerOfResource(config, objectId);

        const { query, params } = config.generateOwnerQuery(userId, objectId);
        const [ownerRows] = await db.query(query, params);
        if (ownerRows.length > 0) {
            return next();
        }

        if (decoded.num_etudiant === "11111111" && await verifyTeacherOfStudent(userId, studentId)) {
            return next();
        } else {
            return res.status(403).send('Accès non autorisé. Vous devez être le propriétaire ou l’enseignant de l’étudiant.');
        }
    } catch (error) {
        return res.status(401).send('Token invalide ou problème d\'authentification.');
    }
};

const verifyOwnerOrAdmin = (config, idParamName) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await getIdUtilisateurFromToken(token);
        const role = await getRoleUtilisateurFromToken(token);
        const objectId = req.body[idParamName];
        const { query, params } = config.generateOwnerQuery(userId, objectId);
        const [rows] = await db.query(query, params);
        if (rows.length > 0 || role === "administration") {
            return next();
        } else {
            return res.status(403).send('Accès non autorisé. Vous devez être le propriétaire ou un administrateur.');
        }
    } catch (error) {
        return res.status(401).send('Token invalide ou problème d\'authentification.');
    }
};



const verifyOwner = (config, idParamName) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await getIdUtilisateurFromToken(token);
        const objectId = req.body[idParamName];
        console.log(userId, objectId, "d")
        const { query, params } = config.generateOwnerQuery(userId, objectId);
        console.log(query, params, "e")

        let [rows] = await db.query(query, params);
        console.log("rows",rows);
        console.log("length",rows[0].count);
        rows.length = rows[0].count;

        if (rows.length > 0) {
            next();
        } else {
            return res.status(403).send('Accès non autorisé.');
        }
    } catch (error) {
        return res.status(401).send('Token invalide ou problème d\'authentification.');
    }
};

const verifyTeacherOfStudent = async (teacherId, studentId) => {
    const currentYearStart = new Date(new Date().getFullYear(), 8, 1); // 1er septembre de l'année courante
    const currentYearEnd = new Date(new Date().getFullYear() + 1, 5, 30); // 30 juin de l'année suivante

    const query = `
        SELECT 1 FROM promotion AS p1
        JOIN promotion AS p2 ON p1.id_formation = p2.id_formation AND p1.annee = p2.annee
        WHERE p1.id_utilisateur = ? AND p2.id_utilisateur = ? 
        AND p1.annee >= ? AND p1.annee <= ? LIMIT 1`;

    const [rows] = await db.query(query, [teacherId, studentId, currentYearStart, currentYearEnd]);
    return rows.length > 0;
};

const verifyIsTeacher = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.num_etudiant === "11111111") {
            return next();
        } else {
            return res.status(403).send('Accès non autorisé. Vous devez être un enseignant.');
        }
    } catch (error) {
        return res.status(401).send('Token invalide ou problème d\'authentification.');
    }
}
const verifyIsAdministration = async (req, res , next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.num_etudiant === "00000000" && decoded.role === "administration") {
            return next();
        } else {
            return res.status(403).send('Accès non autorisé. Vous devez être un administrateur.');
        }
    } catch (error) {
        return res.status(401).send('Token invalide ou problème d\'authentification.');
    }
}

const verifyIsTeacherOrAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.num_etudiant === "11111111" || (decoded.num_etudiant === "00000000" && decoded.role === "administration")) {
            return next();
        } else {
            return res.status(403).send('Accès non autorisé. Vous devez être un enseignant ou un administrateur.');
        }
    } catch (error) {
        return res.status(401).send('Token invalide ou problème d\'authentification.');
    }
}

const findOwnerOfResource = async (config, objectId) => {
    const { query, params } = config.generateFindOwnerQuery(objectId);

    try {
        const [rows] = await db.query(query, params);
        if (rows.length > 0) {
            return rows[0].id_utilisateur;
        }
        return null;
    } catch (error) {
        console.error("Erreur lors de la recherche du propriétaire de la ressource :", error);
        return null;
    }
};

const GetToken = (req) => {
    return req.headers.authorization.split(' ')[1];
};


module.exports = {
    verifyAuthorisation,
    verifyTokenBlacklist,
    verifyOwner,
    GetToken
}

module.exports.verifyOwnerOrTeacherOfStudent = verifyOwnerOrTeacherOfStudent;
module.exports.verifyTeacherOfStudent = verifyTeacherOfStudent;
module.exports.verifyIsTeacher = verifyIsTeacher;
module.exports.verifyIsAdministration = verifyIsAdministration;
module.exports.verifyIsTeacherOrAdmin = verifyIsTeacherOrAdmin;
module.exports.verifyOwnerOrAdmin = verifyOwnerOrAdmin;
