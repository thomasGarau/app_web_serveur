const CarteMentaleMOdel = require('../models/carte-mentale-modele');
const db = require('../../config/database');

const userCM = async (utilisateur, chapitre) => {
    try {
        const query = `
            SELECT cm.*
            FROM carte_mentale cm
            LEFT JOIN carte_mentale_collection cmc ON cm.id_carte_mentale = cmc.id_carte_mentale
            WHERE c.chapitre = ? 
            AND (cm.id_utilisateur = ? OR cmc.id_utilisateur = ?);
        `;
        const [rows] = await db.query(query, [chapitre, utilisateur, utilisateur]);
        return rows;
    }
    catch (error) {
        throw new Error('Erreur lors de la récupération des cartes mentales');
    }
};

const allCMChapter = async (chapitre) => {
    try {
        const query = `
            SELECT c.*
            FROM carte_mentale_chapitre c
            WHERE c.chapitre = ?;
        `;
        const [rows] = await db.query(query, [chapitre]);
        return rows;
    }
    catch (error) {
        throw new Error('Erreur lors de la récupération des chapitres de la carte mentale');
    }
}




module.exports = {
    userCM,
    allCMChapter
};