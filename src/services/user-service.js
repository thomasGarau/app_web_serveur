const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authenticateUser = async (username, password) => {
    console.log("entrer authenticateuser");
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?' , [username]); 
    if(rows.length > 0){
        if(bcrypt.compare(password, row[0].password)){
            return genToken();
        }
    } else {
        throw new Error('Identifiants incorrects');
    }
};

function genToken(){
    const token = jwt.sign(
        { userId: rows[0].id, username: rows[0].username },
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

const registerUser = async (firstname, name, username, password) => {
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO USERS(firstname, name, username, password) VALUES(?, ?, ?, ?)', [firstname, name, username, hashedPassword]); 
        return genToken();
    } catch (err) {
        throw new Error('erreur durant l inscription');
    }
};

module.exports = {
    authenticateUser,
    registerUser,
    userExist
};