const db = require('../../config/database.js');

const getQuizzProfesseurForUe = async (ue) => {
    const query = `
        SELECT q.*, AVG(ndq.note) AS note_moyenne
        FROM quizz q
        JOIN chapitre c ON q.id_chapitre = c.id_chapitre
        JOIN utilisateur u ON q.id_utilisateur = u.id_utilisateur
        JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
        LEFT JOIN note_du_quizz ndq ON q.id_quizz = ndq.id_quizz
        WHERE c.id_ue = ? AND uv.role = 'professeur'
        GROUP BY q.id_quizz
    `;
    try {
        const [rows] = await db.query(query, [ue]);
        if (rows.length > 0) {
            return rows.map(row => ({
                ...row,
                note: row.note_moyenne ? parseFloat(row.note_moyenne).toFixed(1) : 'Pas de note'
            }));
        } else {
            throw new Error('Aucun quizz pour cette UE créé par des professeurs');
        }
    } catch (error) {
        throw error;
    }
};


const getQuizzEleveForUe = async (ue) => {
    const query = `
        SELECT q.*, AVG(ndq.note) AS note_moyenne
        FROM quizz q
        JOIN chapitre c ON q.id_chapitre = c.id_chapitre
        JOIN utilisateur u ON q.id_utilisateur = u.id_utilisateur
        JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
        LEFT JOIN note_du_quizz ndq ON q.id_quizz = ndq.id_quizz
        WHERE c.id_ue = ? AND uv.role = 'etudiant'
        GROUP BY q.id_quizz
    `;
    try {
        const [rows] = await db.query(query, [ue]);
        if (rows.length > 0) {
            return rows.map(row => ({
                ...row,
                note: row.note_moyenne ? parseFloat(row.note_moyenne).toFixed(1) : 'Pas de note'
            }));
        } else {
            throw new Error('Aucun quizz pour cette UE créé par des élèves');
        }
    } catch (error) {
        throw error;
    }
};

const getNoteUtilisateurQuizz = async (id_quizz, id_utilisateur) => {
    const query = `
        SELECT MAX(note) AS meilleure_note
        FROM note_quizz
        WHERE id_quizz = ? AND id_utilisateur = ?
    `;
    try {
        const [rows] = await db.query(query, [id_quizz, id_utilisateur]);
        if (rows.length > 0 && rows[0].meilleure_note !== null) {
            return rows[0].meilleure_note;
        } else {
            throw new Error("Aucune note pour cet utilisateur sur ce quizz");
        }
    } catch (error) {
        throw error;
    }
};

const addNoteUtilisateurQuizz = async (id_quizz, id_utilisateur, note, date) => {
    const query = `
        INSERT INTO note_quizz (date, note, id_quizz, id_utilisateur)
        VALUES (?, ?, ?, ?)
    `;
    try {
        await db.query(query, [date, note, id_quizz, id_utilisateur]);
        return { success: true, message: 'Note ajoutée avec succès.' };
    } catch (error) {
        throw new Error('Impossible d\'ajouter la note.');
    }
};

const addNoteUtilisateurAuQuizz = async (id_quizz, id_utilisateur, note, date) => {
    const query = `INSERT INTO note_du_quizz (date, note, id_quizz, id_utilisateur) VALUES (?, ?, ?, ?)`;
    try {
        await db.query(query, [date, note, id_quizz, id_utilisateur]);
        return { success: true, message: 'Note ajoutée avec succès.' };
    } catch (error) {
        throw new Error('Impossible d\'ajouter la note.');
    }
};


const getNoteMoyenneQuiz = async (id_quizz) => {
    const query = `
        SELECT AVG(note) AS note_moyenne
        FROM note_quizz
        WHERE id_quizz = ?
    `;
    try {
        const [rows] = await db.query(query, [id_quizz]);
        if (rows.length > 0 && rows[0].note_moyenne !== null) {
            return parseFloat(rows[0].note_moyenne.toFixed(2));
        } else {
            return null;
        }
    } catch (error) {
        throw new Error("Impossible de récupérer la note moyenne du quizz.");
    }
};

const getQuestionsPourQuizz = async (id_quizz) => {
    const query = `SELECT * FROM question WHERE id_quizz = ?`;
    try {
        const [rows] = await db.query(query, [id_quizz]);
        return rows;
    } catch (error) {
        throw error;
    }
};

const getReponsesPourQuestion = async (id_question) => {
    const query = `SELECT * FROM reponse WHERE id_question = ?`;
    try {
        const [rows] = await db.query(query, [id_question]);
        return rows;
    } catch (error) {
        throw error;
    }
};

const getReponsesUtilisateurPourQuestion = async (id_question, id_utilisateur, id_quizz) => {
    const query = `
        SELECT r.* FROM reponse_utilisateur ru
        JOIN reponse r ON ru.id_reponse = r.id_reponse
        WHERE ru.id_utilisateur = ? AND r.id_question = ? AND EXISTS (
            SELECT 1 FROM question q WHERE q.id_question = r.id_question AND q.id_quizz = ?
        )
    `;
    try {
        const [rows] = await db.query(query, [id_utilisateur, id_question, id_quizz]);
        return rows;
    } catch (error) {
        throw error;
    }
};

const getAnnotationsPourQuestion = async (id_question, id_quizz) => {
    const query = `
        SELECT a.* FROM annotation a
        JOIN question q ON a.id_question = q.id_question
        WHERE a.id_question = ? AND q.id_quizz = ?
    `;
    try {
        const [rows] = await db.query(query, [id_question, id_quizz]);
        return rows;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getQuizzProfesseurForUe,
    getQuizzEleveForUe,
    getNoteUtilisateurQuizz,
    addNoteUtilisateurQuizz,
    addNoteUtilisateurAuQuizz,
    getNoteMoyenneQuiz,
    getQuestionsPourQuizz,
    getReponsesPourQuestion,
    getReponsesUtilisateurPourQuestion,
    getAnnotationsPourQuestion
};