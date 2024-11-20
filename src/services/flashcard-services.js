const db = require('../../config/database.js');
const AnswerService = require('./answer-service');
const OwnFlashcardError = require('../constants/errors');

const allFlashcard = async (chapitre) => {
    try{
        const query = 'SELECT * FROM flashcard WHERE id_chapitre = ?';
        const [rows] = await db.query(query, [chapitre]);
        if (rows.length > 0){
            return rows;
        }
        else {
            return 'Aucune flashcard disponible';
        }
    }
    catch(error){
        throw new Error('erreur dans la récupération des flashcards');
    }
};

const userFlashcard = async (utilisateur, chapitre) => {
    try{
        const query = `
            SELECT f.*
            FROM flashcard f
            LEFT JOIN flashcard_collection fc ON f.id_flashcard = fc.id_flashcard
            WHERE f.id_chapitre = ? 
            AND (f.id_utilisateur = ? OR fc.id_utilisateur = ?);
        `;
        const [rows] = await db.query(query, [chapitre, utilisateur, utilisateur]);
        if (rows.length > 0){
            return rows;
        }
        else {
            return 'Aucune flashcard disponible';
        }
    }catch(error){
        throw new Error('erreur dans la récupération des flashcards');
    }
};

const dailyFlashcard = async (utilisateur) => {
    try{
        const query = `
            SELECT f.*
            FROM flashcard f
            JOIN flashcard_du_jour fdj ON f.id_flashcard = fdj.id_flashcard
            WHERE fdj.id_utilisateur = ?;
            AND fdj.date_flashcard_du_jour = CURDATE();
        `;
        const [rows] = await db.query(query, [utilisateur, utilisateur]);
        if (rows.length > 0){
            return rows;
        }
        else {
            return 'Aucune flashcard disponible';
        }
    }catch(err){
        throw new Error('erreur dans la récupération des flashcards');
    }
};

const flashcardAnswer = async(utilisateur, flashcard, date, userAnswer) => {
    try{
        //récupére la réponse type de la flashcard
        const flashcardAnswerQuery = 'SELECT reponse FROM flashcard WHERE id_flashcard = ?';
        const flashcardAnswer = (await db.query(flashcardAnswerQuery, [flashcard]))[0][0].reponse;
        //annalyse la corrélation entre la réponse de l'utilisateur et la réponse de la flashcard
        const answerType = await AnswerService.analyse(flashcardAnswer, userAnswer);
        //enregistre le résultat de la réponse de la flashcard
        const query = 'INSERT INTO reponse_flashcard (id_utilisateur, id_flashcard, date_reponse, etat_reponse) VALUES (?, ?, ?, ?)';
        const [rows] = await db.query(query, [utilisateur, flashcard, date, answerType]);
        return rows;
    }catch(err){
        throw new Error('erreur dans la récupération de la réponse de la flashcard');
    }
};

const addToCollection = async (utilisateur, flashcard) => {
    try {
        const query = `
            INSERT INTO flashcard_collection (id_utilisateur, id_flashcard)
            SELECT ?, ?
            FROM flashcard
            WHERE id_flashcard = ? AND id_utilisateur != ?;
        `;
        const [rows] = await db.query(query, [utilisateur, flashcard, flashcard, utilisateur]);

        if (rows.affectedRows === 0) {
            throw new OwnFlashcardError();
        }

        return rows;
    } catch (err) {
        console.error('Erreur dans addToCollection :', err);
        throw err;
    }
};

const removeFromCollection = async (utilisateur, flashcard) => {
    try{
        const query = 'DELETE FROM flashcard_collection WHERE id_utilisateur = ? AND id_flashcard = ?';
        const [rows] = await db.query(query, [utilisateur, flashcard]);
        return rows;
    }catch(err){
        throw new Error('erreur dans le retrait de la flashcard de la collection');
    }
};

const createFlashcard = async (utilisateur, flashcard) => {
    try{
        const query = 'INSERT INTO flashcard (id_utilisateur, id_chapitre, question, reponse, visibilite) VALUES (?, ?, ?, ?, ?)';
        const [rows] = await db.query(query, [utilisateur, flashcard.chapitre, flashcard.question, flashcard.reponse, flashcard.visibilite]);
        return rows;
    }catch(err){
        throw new Error('erreur dans la création de la flashcard');
    }
};

const updateFlashcard = async (flashcard) => {
    try {
        const query = `update flashcard set question = ?, reponse = ? where id_flashcard = ?`;	
        await db.query(query, [flashcard.question, flashcard.reponse, flashcard.flashcard]);
        return 'Flashcard mise à jour';
    }catch(err){
        console.error(err);
        throw new Error('erreur dans la mise à jour de la flashcard');
    }
};

const deleteFlashcard = async (flashcard) => {
    try{
        const query = `
            UPDATE flashcard
            SET id_utilisateur = NULL, visibilite = 'orphelin'
            WHERE id_flashcard = ?;
        `;
        const [rows] = await db.query(query, [flashcard]);
        return rows;
    }catch(err){
        throw new Error('erreur dans la suppression de la flashcard');
    }
};

module.exports = {
    allFlashcard,
    userFlashcard,
    dailyFlashcard,
    flashcardAnswer,
    addToCollection,
    removeFromCollection,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
}