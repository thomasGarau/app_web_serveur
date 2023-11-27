const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');

const authenticateUser = async (username, password) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?' , [username]); 
    if(rows.length > 0){
        if(bcrypt.compare(password, rows[0].password)){
            return genToken(rows[0].username, rows[0].role);
        }
    } else {
        throw new Error('Identifiants incorrects');
    }
};

const registerUser = async (username, password, name, firstname) => {
    try{
        await db.query('INSERT INTO USERS(username, password, name, firstname, role) VALUES(?, ?, ?, ?, "eleve")', [username, password, name, firstname]); 
        return genToken(username, "eleve");
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant l inscription');
    }
};

async function userExist(username){
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?' , [username]); 
    if(rows.length > 0){
        return true;
    } else {
        return false;
    }
}

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

module.exports = {
    authenticateUser,
    registerUser,
    userExist,
    verifyToken
};