const crypto = require('crypto');
const db = require('../../config/database.js');

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    let day = date.getDate();
    let month = date.getMonth() + 1; // Les mois sont indexés à partir de 0
    const year = date.getFullYear();

    // Ajoute un zéro devant les jours et les mois si nécessaire
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${day}/${month}/${year}`;
}

const generateResetCode = async () => {
    return crypto.randomBytes(3).toString('hex');
};


const storeVerificationCode = async (num_etudiant, code) => {
    const date_creation = new Date();
    const date_expiration = new Date(date_creation.getTime() + (1000 * 60 * 10)); // Valide pour 10minutes
    const query = `INSERT INTO verification_codes (num_etudiant, code, date_creation, date_expiration) VALUES (?, ?, ?, ?)
                   ON DUPLICATE KEY UPDATE code = ?, date_creation = ?, date_expiration = ?;`;
    await db.query(query, [num_etudiant, code, date_creation, date_expiration, code, date_creation, date_expiration]);
};

module.exports = {
    formatDate,
    code: {
        generateResetCode,
        storeVerificationCode
    },
};
