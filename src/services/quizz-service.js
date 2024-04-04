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


const ajouterReponsesAuQuizz = async (idQuizz, idUtilisateur, reponses) => {
    try {
        await db.beginTransaction();

        const [noteQuizz] = await connection.query(
            `INSERT INTO note_quizz (date, note, id_quizz, id_utilisateur) VALUES (CURDATE(), 0, ?, ?)`,
            [idQuizz, idUtilisateur]
        );

        const idNoteQuizz = noteQuizz.insertId;

        for (const reponse of reponses) {
            await connection.query(
                `INSERT INTO reponse_utilisateur (id_reponse, id_utilisateur, id_note_quizz) VALUES (?, ?, ?)`,
                [reponse.idReponse, idUtilisateur, idNoteQuizz]
            );
        }

        await connection.commit();

        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const createResultatQuizz =  async (idQuizz, idUtilisateur, reponsesData) => {
    const quizzType = await getTypeQuizz(idQuizz);
    const { questionsQuizz, reponsesUtilisateur, bonnesReponses } = await preparerDetailsQuizz(idQuizz, reponsesData);
    let resultat;
    if (quizzType === "normal") {
        resultat = calculScoreNormal(questionsQuizz, reponsesUtilisateur, bonnesReponses);
    } else if (quizzType === "negatif") {
        resultat = calculScoreNegatif(questionsQuizz, reponsesUtilisateur, bonnesReponses);
    }
    const [noteQuizzResult] = await db.query(
        `INSERT INTO note_quizz (date, note, id_quizz, id_utilisateur) VALUES (CURDATE(), ?, ?, ?)`,
        [resultat.noteFinale, idQuizz, idUtilisateur]
    );
    const idNoteQuizz = noteQuizzResult.insertId;
    return {
        idNoteQuizz,
        noteFinale: resultat.noteFinale,
        details: resultat.details
    };
};

async function getTypeQuizz(idQuizz) {
    const [result] = await db.query(`
        SELECT type FROM quizz WHERE id_quizz = ?
    `, [idQuizz]);
    return result[0].type;
}

async function preparerDetailsQuizz(idNoteQuizz) {
    const questionsQuizz = await db.query(`
        SELECT DISTINCT q.id_question
        FROM question q
        JOIN note_quizz nq ON q.id_quizz = nq.id_quizz
        WHERE nq.id_note_quizz = ?
    `, [idNoteQuizz]);

    const reponsesUtilisateur = await db.query(`
        SELECT ru.id_reponse, r.id_question
        FROM reponse_utilisateur ru
        JOIN reponse r ON ru.id_reponse = r.id_reponse
        WHERE ru.id_note_quizz = ?
    `, [idNoteQuizz]);

    const bonnesReponses = await db.query(`
        SELECT r.id_reponse, r.id_question
        FROM reponse r
        JOIN question q ON r.id_question = q.id_question
        JOIN note_quizz nq ON q.id_quizz = nq.id_quizz
        WHERE nq.id_note_quizz = ? AND r.est_bonne_reponse = 1
    `, [idNoteQuizz]);

    return { questionsQuizz, reponsesUtilisateur, bonnesReponses };
}

function calculScoreNormal(questionsQuizz, reponsesUtilisateur, bonnesReponses) {
    let scoreTotal = 0;
    let details = [];

    questionsQuizz.forEach(question => {
        const reponsesPourQuestion = reponsesUtilisateur.filter(r => r.id_question === question.id_question).map(r => r.id_reponse);
        const bonnesReponsesPourQuestion = bonnesReponses.filter(r => r.id_question === question.id_question).map(r => r.id_reponse);
        const bonnesReponsesUtilisateur = reponsesPourQuestion.filter(r => bonnesReponsesPourQuestion.includes(r));
        
        const scoreQuestion = bonnesReponsesUtilisateur.length / bonnesReponsesPourQuestion.length;
        scoreTotal += scoreQuestion;

        details.push({
            id_question: question.id_question,
            reponsesUtilisateur: reponsesPourQuestion,
            bonnesReponses: bonnesReponsesPourQuestion,
            scoreQuestion: scoreQuestion.toFixed(2)
        });
    });

    const noteFinale = ((scoreTotal / questionsQuizz.length) * 100).toFixed(2);

    return {
        noteFinale,
        details
    };
}

function calculScoreNegatif(questionsQuizz, reponsesUtilisateur, bonnesReponses) {
    let scoreTotal = 0;
    let details = [];

    questionsQuizz.forEach(question => {
        const reponsesPourQuestion = reponsesUtilisateur.filter(r => r.id_question === question.id_question).map(r => r.id_reponse);
        const bonnesReponsesPourQuestion = bonnesReponses.filter(r => r.id_question === question.id_question).map(r => r.id_reponse);
        const bonnesReponsesUtilisateur = reponsesPourQuestion.filter(r => bonnesReponsesPourQuestion.includes(r));
        const mauvaisesReponses = reponsesPourQuestion.length - bonnesReponsesUtilisateur.length;
        
        const scoreQuestion = bonnesReponsesUtilisateur.length / bonnesReponsesPourQuestion.length - (mauvaisesReponses / bonnesReponsesPourQuestion.length);
        scoreTotal += Math.max(scoreQuestion, -1);

        details.push({
            id_question: question.id_question,
            reponsesUtilisateur: reponsesPourQuestion,
            bonnesReponses: bonnesReponsesPourQuestion,
            scoreQuestion: Math.max(scoreQuestion, -1).toFixed(2)
        });
    });

    const noteFinale = ((scoreTotal / questionsQuizz.length) * 100).toFixed(2);

    return {
        noteFinale,
        details
    };
}

const getResultatQuizz = async (note_quizz) => {
    try{
        resultat = null;
        const [rows] = await db.query(
            `SELECT * FROM note_quizz NATURAL JOIN quizz WHERE id_note_quizz = ?`,
            [note_quizz]
        );
        if (rows.length > 0) {
            if (rows[0].type === "normal") {
                resultat = calculScoreNormal(questionsQuizz, reponsesUtilisateur, bonnesReponses);
            } else if (rows[0].type === "negatif") {
                resultat = calculScoreNormal(questionsQuizz, reponsesUtilisateur, bonnesReponses);
            }
            return resultat;
        } else {
            throw new Error("Aucun résultat pour ce quizz");
        }
    
    }catch (error) {
        throw new Error("Impossible de récupérer le résultat du quizz");
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
    getAnnotationsPourQuestion,
    ajouterReponsesAuQuizz,
    getResultatQuizz, 
    createResultatQuizz
};