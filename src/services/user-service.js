const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authenticateUser = async (num_etudiant, password) => {
    const [rows] = await db.query('SELECT * FROM utilisateur NATURAL JOIN utilisateur_valide WHERE num_etudiant = ?' , [num_etudiant]); 
    console.log(rows, "cc", password);
    if(rows.length > 0 && await bcrypt.compare(password, rows[0].mdp)){
        return genToken(rows[0].num_etudiant, rows[0].role);
    } else {
        throw new Error('Identifiants incorrects');
    }
};

const registerUser = async (email, mdp) => {
    const query = `
        SELECT uv.num_etudiant
        FROM utilisateur_valide uv
        LEFT JOIN utilisateur u ON uv.num_etudiant = u.num_etudiant
        WHERE uv.mail_utilisateur = ? AND u.id_utilisateur IS NULL
    `;

    console.log(email, mdp, "cc");
    const [result] = await db.query(query, [email]);

    if (result.length > 0) {
        await db.query('INSERT INTO utilisateur (num_etudiant, mdp) VALUES (?, ?)', [result[0].num_etudiant, mdp]);
        return genToken(result[0].num_etudiant, "eleve");
    } else {
        throw new Error('Vous n\'êtes pas autorisé à vous inscrire ou un compte avec ce numéro d\'étudiant existe déjà.');
    }
};



function genToken(num_etudiant, role){
    const token = jwt.sign(
        { 
            num_etudiant: num_etudiant,
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
        db.query('INSERT INTO token_liste_noire(token, date) VALUES(?, "12-12-23")', [token]);
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