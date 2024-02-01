const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authenticateUser = async (username, password) => {
    const [rows] = await db.query('SELECT * FROM utilisateur WHERE mail = ?' , [username]); 
    if(rows.length > 0){
        if(bcrypt.compare(password, rows[0].mdp)){
            return genToken(rows[0].nom_utilisateur, rows[0].role);
        }
    } else {
        throw new Error('Identifiants incorrects');
    }
};

const registerUser = async (username, password, name, firstname) => {
    try{
        await db.query('INSERT INTO utilisateur(mail, mdp, nom, prenom, role) VALUES(?, ?, ?, ?, "eleve")', [username, password, name, firstname]); 
        return genToken(username, "eleve");
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant l inscription');
    }
};

function genToken(username, role){
    const token = jwt.sign(
        { 
            userName: username,
            role: role
        },

        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    return token;
}

function verifyToken(token){
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error(err);
        throw new Error('Token invalide');
    }
}

async function userExist(username){
    const [rows] = await db.query('SELECT * FROM utilisateur WHERE mail = ?' , [username]); 
    return rows.length > 0;
}

async function isTokenBlacklisted(token){
    const [rows] = await db.query('SELECT * FROM liste_noire WHERE valeur = ?', [token]);
    console.log(rows, "cc")
    const a = rows.length > 0;
    console.log(a, "zz")
    return a;
}

async function invalidateToken(token){
    try {
        //test si le token est belle est bien valide
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded, "iii");
        db.query('INSERT INTO liste_noire(valeur, date) VALUES(?, "12-12-23")', [token]);
        return decoded;
    } catch (err) {
        console.error(err);
        throw new Error('Token invalide');
    }

}

module.exports = {
    authenticateUser,
    registerUser,
    userExist,
    verifyToken,
    isTokenBlacklisted,
    invalidateToken
};