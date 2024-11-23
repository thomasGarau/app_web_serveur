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

const flashcardAnswer = async (utilisateur, flashcard, date, userAnswer) => {
    try {
        // Récupérer la réponse type de la flashcard
        const flashcardAnswerQuery = 'SELECT reponse FROM flashcard WHERE id_flashcard = ?';
        const flashcardAnswer = (await db.query(flashcardAnswerQuery, [flashcard]))[0][0].reponse;

        // Analyse la corrélation entre la réponse utilisateur et la réponse de la flashcard
        const analysis = await AnswerService.analyse(flashcardAnswer, userAnswer);

        // Vérifier si la réponse du serveur Flask est valide
        if (!analysis || typeof analysis.correct !== 'number' || typeof analysis.explication !== 'string') {
            console.error("Erreur : Réponse du serveur Flask invalide ou modèle défaillant");
            return {
                error: "Erreur dans le traitement par le modèle. Veuillez réessayer.",
            };
        }

        const { correct, explication } = analysis;

        // Déterminer si la réponse est juste ou fausse
        const answer = correct > 70 ? 'juste' : 'faux';

        // Enregistrer dans la base de données seulement si correct > 70
        if (correct > 70) {
            const query = 'INSERT INTO reponse_flashcard (id_utilisateur, id_flashcard, date_reponse, etat_reponse) VALUES (?, ?, ?, ?)';
            await db.query(query, [utilisateur, flashcard, date, answer]);
        }

        // Retourner un objet JSON avec le résultat
        return {
            correcte: answer,
            explication: explication,
        };
    } catch (err) {
        console.error("Erreur dans flashcardAnswer :", err.message || err);
        return {
            error: "Une erreur interne s'est produite. Veuillez réessayer plus tard.",
        };
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

function calculateFlashcardScore(flashcard, recentFlashcards, incorrectResponses, recentChapters, weights) {
    let score = 0;

    // Éviter les flashcards récemment utilisées
    if (recentFlashcards.includes(flashcard.id_flashcard)) {
        score -= weights.recentPenalty;
    }

    // Prioriser les mauvaises réponses
    if (incorrectResponses.includes(flashcard.id_flashcard)) {
        score += weights.incorrectResponseBonus;
    }

    // Prioriser les chapitres récemment consultés
    if (recentChapters.includes(flashcard.id_chapitre)) {
        score += weights.recentChapterBonus;
    }

    // Ajouter une pondération aléatoire pour diversité
    score += Math.random() * weights.randomFactor;

    return score;
};

const GenerateDailyFlashcard = async () => {
    try {
        // Étape 1 : Récupérer les utilisateurs avec au moins 3 flashcards
        const [users] = await db.query(`
            SELECT DISTINCT id_utilisateur
            FROM (
                SELECT id_utilisateur
                FROM flashcard
                WHERE id_utilisateur IS NOT NULL
        
                UNION
        
                SELECT id_utilisateur
                FROM flashcard_collection
            ) AS combined
            GROUP BY id_utilisateur
            HAVING COUNT(*) >= 3;
        `);

        // Poids des critères
        const weights = {
            recentPenalty: 10,           // Pénalité pour les flashcards récemment utilisées
            incorrectResponseBonus: 20, // Bonus pour les flashcards avec réponses incorrectes
            recentChapterBonus: 15,     // Bonus pour les flashcards de chapitres récemment consultés
            randomFactor: 5             // Diversité aléatoire
        };
        for (const user of users) {
            const userId = user.id_utilisateur;

            // Étape 2 : Récupérer toutes les flashcards de l'utilisateur
            const [flashcards] = await db.query(`
                SELECT f.id_flashcard, f.id_chapitre
                FROM flashcard_collection fc
                JOIN flashcard f ON fc.id_flashcard = f.id_flashcard
                WHERE fc.id_utilisateur = ?;
            `, [userId]);

            // Étape 3 : Obtenir les flashcards récemment utilisées
            const [recentFlashcardsData] = await db.query(`
                SELECT id_flashcard
                FROM flashcard_du_jour
                WHERE id_utilisateur = ?
                  AND date_flashcard_du_jour >= CURDATE() - INTERVAL 7 DAY;
            `, [userId]);
            const recentFlashcards = recentFlashcardsData.map(f => f.id_flashcard);

            // Étape 4 : Obtenir les flashcards avec mauvaises réponses
            const [incorrectResponsesData] = await db.query(`
                SELECT id_flashcard
                FROM reponse_flashcard
                WHERE id_utilisateur = ?
                  AND etat_reponse = 'faux'
                  AND date_reponse >= CURDATE() - INTERVAL 30 DAY;
            `, [userId]);
            const incorrectResponses = incorrectResponsesData.map(f => f.id_flashcard);

            // Étape 5 : Obtenir les chapitres récents (via quizz)
            const [recentChaptersData] = await db.query(`
                SELECT DISTINCT q.id_chapitre
                FROM note_quizz nq
                JOIN quizz q ON nq.id_quizz = q.id_quizz
                WHERE nq.id_utilisateur = ?
                  AND nq.date >= CURDATE() - INTERVAL 30 DAY
                  AND nq.note < 10;
            `, [userId]);
            const recentChapters = recentChaptersData.map(c => c.id_chapitre);

            // Étape 6 : Appliquer une heuristique pour calculer le score de chaque flashcard
            const scoredFlashcards = flashcards.map(flashcard => ({
                ...flashcard,
                score: calculateFlashcardScore(
                    flashcard,
                    recentFlashcards,
                    incorrectResponses,
                    recentChapters,
                    weights
                )
            }));

            // Étape 7 : Sélectionner la flashcard avec le meilleur score
            const bestFlashcard = scoredFlashcards.sort((a, b) => b.score - a.score)[0];
            console.log("bestFlashcard", bestFlashcard);
            if (bestFlashcard) {
                // Étape 8 : Insérer la flashcard sélectionnée dans `flashcard_du_jour`
                await db.query(`
                    INSERT INTO flashcard_du_jour (id_utilisateur, id_flashcard, date_flashcard_du_jour)
                    VALUES (?, ?, CURDATE())
                    ON DUPLICATE KEY UPDATE id_flashcard = VALUES(id_flashcard);
                `, [userId, bestFlashcard.id_flashcard]);
            } else {
                console.log(`Aucune flashcard disponible pour l'utilisateur ${userId}`);
            }
        }

        console.log("Flashcards du jour générées avec succès !");
    } catch (error) {
        console.error("Erreur lors de la génération des flashcards du jour :", error);
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
    deleteFlashcard,
    GenerateDailyFlashcard
}