const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authenticateUser = async (username, password) => {
    const [rows] = await db.query('SELECT * FROM utilisateur WHERE num_etudiant = ?' , [username]); 
    if(rows.length > 0){
        if(bcrypt.compare(password, rows[0].mdp)){
            const [user] = await db.query('SELECT * FROM utilisateur_valide where num_etudiant = ?', [rows[0].num_etudiant]);
            return genToken(rows[0].num_etudiant, user[0].role);
        }
    } else {
        throw new Error('Identifiants incorrects');
    }
};

const registerUser = async (num_etudiant,mdp) => {
    const valideUser = await db.query('SELECT * FROM utilisateur_valide WHERE num_etudiant = ?', [num_etudiant]);
    if(valideUser.length > 0){
        await db.query('INSERT INTO utilisateur(num_etudiant,mdp) VALUES(?, ?)', [num_etudiant,mdp]); 
        return genToken(num_etudiant, "eleve");
    } else {
        throw new Error('Vous n\'êtes pas autorisé à vous inscrire');
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
    const [rows] = await db.query('SELECT * FROM utilisateur WHERE num_etudiant = ?' , [username]); 
    return rows.length > 0;
}

async function isTokenBlacklisted(token){
    const [rows] = await db.query('SELECT * FROM token_liste_noire WHERE token = ?', [token]);
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
        db.query('INSERT INTO liste_noire(token, date) VALUES(?, "12-12-23")', [token]);
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