const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {formatDate} = require('../services/utils.js');

const authenticateUser = async (num_etudiant, password) => {
    const [rows] = await db.query('SELECT * FROM utilisateur NATURAL JOIN utilisateur_valide WHERE num_etudiant = ?' , [num_etudiant]); 
    if(rows.length > 0 && await bcrypt.compare(password, rows[0].mdp)){
        return genToken(rows[0].num_etudiant, rows[0].id_utilisateur, rows[0].role);
    } else {
        throw new Error('Identifiants incorrects');
    }
};

const registerUser = async (email, mdp) => {
    const query = `
    SELECT uv.num_etudiant, uv.role
    FROM utilisateur_valide uv
    WHERE uv.mail_utilisateur = ?
    AND uv.num_etudiant NOT IN (SELECT num_etudiant FROM utilisateur);
    `;
    const [result] = await db.query(query, [email]);

    if (result.length > 0) {
        const insert = await db.query('INSERT INTO utilisateur (num_etudiant, mdp) VALUES (?, ?)', [result[0].num_etudiant, mdp]);
        return genToken(result[0].num_etudiant, insert[0].insertId, result[0].role);
    } else {
        throw new Error('Vous n\'êtes pas autorisé à vous inscrire ou un compte avec ce numéro d\'étudiant existe déjà.');
    }
};



function genToken(num_etudiant, id_etudiant, role){
    const token = jwt.sign(
        { 
            num_etudiant: num_etudiant,
            id_etudiant: id_etudiant,
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
    return rows.length > 0;
}

async function invalidateToken(token){
    try {
        //test si le token est belle est bien valide
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        db.query('INSERT INTO token_liste_noire(token, date) VALUES(?, "12-12-23")', [token]);
        return decoded;
    } catch (err) {
        console.error(err);
        throw new Error('Token invalide');
    }
}

async function getIdUtilisateurFromToken(token){
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id_etudiant;
}

async function getRoleUtilisateurFromToken(token){
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role;
}

async function getUserInfo(id_utilisateur) {
    try {
        // Requête pour obtenir les informations de base et la formation
        const userInfoQuery = `
        SELECT uv.nom, uv.prenom, uv.date_naissance, uv.role, f.label as formation
        FROM utilisateur u
        LEFT JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
        LEFT JOIN promotion p ON u.id_utilisateur = p.id_utilisateur
        LEFT JOIN formation f ON p.id_formation = f.id_formation
        WHERE u.id_utilisateur = ?;`;

        const [userRows] = await db.query(userInfoQuery, [id_utilisateur]);

        // Requête pour obtenir les UEs associées à un enseignant
        const ueQuery = `
        SELECT ue.label, ue.id_ue, ue.path
        FROM enseignants_ue eu
        JOIN ue ON eu.id_ue = ue.id_ue
        WHERE eu.id_utilisateur = ?;`;

        const [ueRows] = await db.query(ueQuery, [id_utilisateur]);

        if (userRows.length > 0) {
            const user = userRows[0];
            const anniversaire = formatDate(user.date_naissance);
            const info = {
                nom: user.nom,
                prenom: user.prenom,
                anniversaire: anniversaire,
                role: user.role,
                formation: user.formation, // uniquement élève
                ue: ueRows.map(ue => ({
                    id_ue: ue.id_ue,
                    label: ue.label,
                    path: ue.path
                }))
            };
            return info;
        } else {
            throw new Error('Utilisateur non trouvé');
        }
    } catch (err) {
        throw new Error('Erreur lors de la récupération des informations de l\'utilisateur');
    }
}

const updateUser = async (id_utilisateur, nom, prenom, date_naissance, mdp, mail_utilisateur) => {
    try {
        const fieldsToUpdate = {
            nom,
            prenom,
            date_naissance,
            mail_utilisateur
        };

        const queryParams = [];
        const updates = [];

        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (value !== null && value !== undefined) {
                updates.push(`${key} = ?`);
                queryParams.push(value);
            }
        }

        if (updates.length > 0) {
            queryParams.push(id_utilisateur);
            const query = `UPDATE utilisateur_valide SET ${updates.join(', ')} WHERE num_etudiant = (SELECT num_etudiant FROM utilisateur WHERE id_utilisateur = ?)`;
            const [result] = await db.query(query, queryParams);
            console.log('Mise à jour de utilisateur_valide réussie:', result);
        }

        if (mdp !== null && mdp !== undefined) {
            const mdpQuery = 'UPDATE utilisateur SET mdp = ? WHERE id_utilisateur = ?';
            const [mdpResult] = await db.query(mdpQuery, [mdp, id_utilisateur]);
            console.log('Mise à jour du mot de passe réussie:', mdpResult);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
    }
};

module.exports = {
    authenticateUser,
    registerUser,
    updateUser,
    userExist,
    verifyToken,
    isTokenBlacklisted,
    invalidateToken,
    getUserInfo
};

module.exports.getIdUtilisateurFromToken = getIdUtilisateurFromToken;
module.exports.getRoleUtilisateurFromToken = getRoleUtilisateurFromToken;
