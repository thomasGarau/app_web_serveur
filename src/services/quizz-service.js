const db = require('../../config/database.js');

const getQuizzInfo = async (quizz) => {
    try{
        const query = `
        SELECT q.*, c.id_ue 
        FROM quizz q
        JOIN chapitre c ON q.id_chapitre = c.id_chapitre 
        WHERE id_quizz = ?;`;
        const [rows] = await db.query(query, [quizz]);
        if(rows.length > 0){
            return rows[0];
        }else{
            return false;
        }
    }catch(error){
        throw error;
    }
}

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
            return false;
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
            return false;
        }
    } catch (error) {
        throw error;
    }
};

const getQuizzProfesseurForChapitre = async (id_chapitre) => {
    const query = `
        SELECT q.*, AVG(ndq.note) AS note_moyenne
        FROM quizz q
        JOIN chapitre c ON q.id_chapitre = c.id_chapitre
        JOIN utilisateur u ON q.id_utilisateur = u.id_utilisateur
        JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
        LEFT JOIN note_du_quizz ndq ON q.id_quizz = ndq.id_quizz
        WHERE c.id_chapitre = ? AND uv.role = 'professeur'
        GROUP BY q.id_quizz
    `;
    try {
        const [rows] = await db.query(query, [id_chapitre]);

        if (rows.length > 0) {
            return rows.map(row => ({
                ...row,
                note: row.note_moyenne ? parseFloat(row.note_moyenne).toFixed(1) : 'Pas de note'
            }));
        } else {
            return false;
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

const getQuizzEleveForChapitre = async (id_chapitre) => {
    const query = `
        SELECT q.*, AVG(ndq.note) AS note_moyenne
        FROM quizz q
        JOIN chapitre c ON q.id_chapitre = c.id_chapitre
        JOIN utilisateur u ON q.id_utilisateur = u.id_utilisateur
        JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
        LEFT JOIN note_du_quizz ndq ON q.id_quizz = ndq.id_quizz
        WHERE c.id_chapitre = ? AND uv.role = 'etudiant'
        GROUP BY q.id_quizz
    `;
    try {
        
        const [rows] = await db.query(query, [id_chapitre]);
        if (rows.length > 0) {
            return rows.map(row => ({
                ...row,
                note: row.note_moyenne ? parseFloat(row.note_moyenne).toFixed(1) : 'Pas de note'
            }));
        } else {
            return false;
        }
    } catch (error) {
        console.error('Database query error:', error);
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

const addNoteUtilisateurPourQuizz = async (id_quizz, id_utilisateur, note) => {
    const query = `
        INSERT INTO note_du_quizz (note, id_quizz, id_utilisateur)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE note = VALUES(note)
    `;
    try {
        await db.query(query, [note, id_quizz, id_utilisateur]);
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
            return parseFloat(rows[0].note_moyenne);
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

const getReponsesUtilisateurPourQuestion = async (id_question, id_utilisateur, id_note_quizz) => {
    const query = `
        SELECT r.* FROM reponse_utilisateur ru
        JOIN reponse r ON ru.id_reponse = r.id_reponse
        JOIN question q ON r.id_question = q.id_question
        JOIN note_quizz nq ON ru.id_note_quizz = nq.id_note_quizz
        WHERE ru.id_utilisateur = ? AND r.id_question = ? AND nq.id_note_quizz = ? AND EXISTS (
            SELECT 1 FROM question q2 WHERE q2.id_question = r.id_question
        )
    `;
    try {
        const [rows] = await db.query(query, [id_utilisateur, id_question, id_note_quizz]);
        return rows;
    } catch (error) {
        throw error;
    }
};

const getAnnotationsPourQuestion = async (id_question) => {
    const query = `
        SELECT a.* FROM annotation a
        JOIN question q ON a.id_question = q.id_question
        WHERE a.id_question = ?
    `;
    try {
        const [rows] = await db.query(query, [id_question]);
        return rows;
    } catch (error) {
        throw error;
    }
};


const ajouterReponsesUtilisateurAuQuizz = async (idQuizz, idUtilisateur, reponses) => {
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction();
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

        return idNoteQuizz;
    } catch(error) {
        if (connection) await connection.rollback();
        throw new Error(error.message);
    } finally {
        if (connection) await connection.release();
    }
};

const createResultatQuizz =  async (idQuizz, idNoteQuizz, reponsesData) => {
    const quizzType = await getTypeQuizz(idQuizz);
    const { questionsQuizz, reponsesUtilisateur, bonnesReponses } = await preparerDetailsQuizz(idNoteQuizz, reponsesData);
    let resultat;
    console.log(questionsQuizz, reponsesUtilisateur, bonnesReponses)
    if (quizzType === "normal") {
        resultat = calculScoreNormal(questionsQuizz, reponsesUtilisateur, bonnesReponses);
    } else if (quizzType === "negatif") {
        resultat = calculScoreNegatif(questionsQuizz, reponsesUtilisateur, bonnesReponses);
    }
    await db.query(
        `UPDATE note_quizz set note = ? WHERE id_note_quizz = ?`,
        [resultat.noteFinale, idNoteQuizz]
    );

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
    console.log(idNoteQuizz)
    const [questionsQuizz] = await db.query(`
        SELECT DISTINCT q.id_question
        FROM question q
        JOIN note_quizz nq ON q.id_quizz = nq.id_quizz
        WHERE nq.id_note_quizz = ?
    `, [idNoteQuizz]);

    const [reponsesUtilisateur] = await db.query(`
        SELECT ru.id_reponse, r.id_question
        FROM reponse_utilisateur ru
        JOIN reponse r ON ru.id_reponse = r.id_reponse
        WHERE ru.id_note_quizz = ?
    `, [idNoteQuizz]);

    const [bonnesReponses] = await db.query(`
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
            `SELECT * FROM note_quizz JOIN quizz on note_quizz.id_quizz = quizz.id_quizz WHERE id_note_quizz = ?`,
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

const createQuizz = async (label, type, chapitre, utilisateur, questions) => {
    try {
        await db.beginTransaction();

        const [result] = await db.query(
            `INSERT INTO quizz (label, type, id_chapitre, id_utilisateur) VALUES (?, ?, ?, ?)`,
            [label, type, chapitre, utilisateur]
        );

        const idQuizz = result.insertId;

        for (const question of questions) {
            const [resultQuestion] = await db.query(
                `INSERT INTO question (label, nombre_bonne_reponse, type, id_quizz) VALUES (?, ?, ?, ?)`,
                [question.label, question.nombre_bonne_reponse, question.type, idQuizz]
            );

            const idQuestion = resultQuestion.insertId;

            for (const reponse of question.reponses) {
                await db.query(
                    `INSERT INTO reponse (contenu, est_bonne_reponse, id_question) VALUES (?, ?, ?)`,
                    [reponse.contenu, reponse.est_bonne_reponse, idQuestion]
                );
            }
        }

        await db.commit();

        return true;
    } catch (error) {
        await db.rollback();
        throw new Error("Impossible de créer le quizz");
    } finally {
        db.release();
    }
};

const deleteQuizz = async (idQuizz) => {
    try {
        await db.beginTransaction();

        await db.query(
            `DELETE FROM note_quizz WHERE id_quizz = ?`,
            [idQuizz]
        );

        await db.query(
            `DELETE FROM reponse_utilisateur WHERE id_note_quizz IN (SELECT id_note_quizz FROM note_quizz WHERE id_quizz = ?)`,
            [idQuizz]
        );


        await db.query(
            `DELETE FROM reponse WHERE id_question IN (SELECT id_question FROM question WHERE id_quizz = ?)`,
            [idQuizz]
        );

        await db.query(
            `DELETE FROM question WHERE id_quizz = ?`,
            [idQuizz]
        );

        await db.query(
            `DELETE FROM quizz WHERE id_quizz = ?`,
            [idQuizz]
        );

        await db.commit();

        return true;
    } catch (error) {
        await db.rollback();
        throw new Error("Impossible de supprimer le quizz");
    } finally {
        db.release();
    }
};

const ajouterQuestionAuQuizz = async (quizz, data) => {
    try {
        await db.beginTransaction();

        const [result] = await db.query(
            `INSERT INTO question (label, nombre_bonne_reponse, type, id_quizz) VALUES (?, ?, ?, ?)`,
            [data.label, data.nombre_bonne_reponse, data.type, quizz]
        );

        const idQuestion = result.insertId;

        for (const reponse of data.reponses) {
            await db.query(
                `INSERT INTO reponse (contenu, est_bonne_reponse, id_question) VALUES (?, ?, ?)`,
                [reponse.contenu, reponse.est_bonne_reponse, idQuestion]
            );
        }

        await db.commit();

        return true;
    } catch (error) {
        await db.rollback();
        throw new Error("Impossible d'ajouter la question");
    } finally {
        db.release();
    }
};

const ajouterReponseAQuestion = async (question, data) => {
    try {
        await db.query(
            `INSERT INTO reponse (contenu, est_bonne_reponse, id_question) VALUES (?, ?, ?)`,
            [data.contenu, data.est_bonne_reponse, question]
        );

        return true;
    } catch (error) {
        throw new Error("Impossible d'ajouter la réponse");
    }
};

const addNoteUtilisateurAuQuizz = async (idQuizz, idUtilisateur, note, date) => {
    try {
        await db.query(
            `INSERT INTO note_quizz (date, note, id_quizz, id_utilisateur) VALUES (?, ?, ?, ?)`,
            [date, note, idQuizz, idUtilisateur]
        );
        return true;
    } catch (error) {
        throw new Error("Impossible d'ajouter la note");
    }
}

const deleteQuestion = async (question) => {
    try {
        await db.beginTransaction();

        await db.query(
            `DELETE FROM reponse WHERE id_question = ?`,
            [question]
        );

        await db.query(
            `DELETE FROM question WHERE id_question = ?`,
            [question]
        );

        await db.commit();

        return true;
    } catch (error) {
        await db.rollback();
        throw new Error("Impossible de supprimer la question");
    } finally {
        db.release();
    }
};

const deleteReponse = async (reponse) => { 
    try {
        await db.query(
            `DELETE FROM reponse WHERE id_reponse = ?`,
            [reponse]
        );

        return true;
    } catch (error) {
        throw new Error("Impossible de supprimer la réponse");
    }
};

const updateQuizz = async (id, data) => {
    const { query, params } = buildUpdateQuery('quizz', data, id, 'id_quizz');
    await db.query(query, params);
};

const updateQuestion = async (id, data) => {
    const { query, params } = buildUpdateQuery('question', data, id, 'id_question');
    await db.query(query, params);
};

const updateReponse = async (id, data) => {
    const { query, params } = buildUpdateQuery('reponse', data, id, 'id_reponse');
    await db.query(query, params);
};

const buildUpdateQuery = (tableName, data, id, primaryKeyColumn) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys.map((key, index) => `${key} = ?`).join(', ');
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${primaryKeyColumn} = ?`;

    return {
        query,
        params: [...values, id]
    };
};


module.exports = {
    getQuizzInfo,
    getQuizzProfesseurForUe,
    getQuizzEleveForUe,
    getQuizzProfesseurForChapitre,
    getQuizzEleveForChapitre,
    getNoteUtilisateurQuizz,
    addNoteUtilisateurPourQuizz,
    getNoteMoyenneQuiz,
    getQuestionsPourQuizz,
    getReponsesPourQuestion,
    getReponsesUtilisateurPourQuestion,
    getAnnotationsPourQuestion,
    ajouterReponsesUtilisateurAuQuizz,
    getResultatQuizz, 
    createResultatQuizz,
    createQuizz,
    deleteQuizz,
    ajouterQuestionAuQuizz,
    ajouterReponseAQuestion,
    addNoteUtilisateurAuQuizz,
    deleteQuestion,
    deleteReponse,
    updateQuizz,
    updateQuestion,
    updateReponse
};