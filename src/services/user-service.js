const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authenticateUser = async (username, password) => {
    console.log("entrer authenticateuser");
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?' , [username]); 
    if(rows.length > 0){
        if(bcrypt.compare(password, rows[0].password)){
            return genToken(username);
        }
    } else {
        throw new Error('Identifiants incorrects');
    }
};

function genToken(username){
    const token = jwt.sign(
        { userName: username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    return token;
}

async function userExist(username){
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?' , [username]); 
    if(rows.length > 0){
        return true;
    } else {
        return false;
    }
}

const registerUser = async (username, password, name, firstname) => {
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO USERS(username, password, name, firstname) VALUES(?, ?, ?, ?)', [username, hashedPassword, name, firstname]); 
        return genToken(username);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant l inscription');
    }
};

module.exports = {
    authenticateUser,
    registerUser,
    userExist
};