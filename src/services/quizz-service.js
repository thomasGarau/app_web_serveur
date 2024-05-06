const db = require('../../config/database.js');

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

async function getQuizzId(note_quizz) {
    const [rows] = await db.query(
        `SELECT id_quizz FROM note_quizz WHERE id_note_quizz = ?`,
        [note_quizz]
    );
    if (rows.length > 0) {
        return rows[0].id_quizz;
    }else {
        return "Aucun quizz pour cette note";
    }
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

async function getTypeQuizz(idQuizz) {
    const [result] = await db.query(`
        SELECT type FROM quizz WHERE id_quizz = ?
    `, [idQuizz]);
    if (result.length > 0) {
        return result[0].type;
    }else {
        return "Info de quizz introuvable";
    }
}

async function preparerDetailsQuizz(idNoteQuizz) {
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

const listQuizzPasser = async (id_utilisateur) => {
    try {
        const query = `
        SELECT * 
        FROM note_quizz 
        JOIN quizz ON note_quizz.id_quizz = quizz.id_quizz
        WHERE note_quizz.id_utilisateur = ?`;
        const [rows] = await db.query(query, [id_utilisateur]);
        return rows;
    }
    catch (error) {
        throw error;
    }
};

const listQuizzCreer = async (id_utilisateur) => {
    try {
        const query = `
        SELECT q.*, COALESCE(AVG(n.note), 0) as moyenne_note
        FROM quizz q
        LEFT JOIN note_du_quizz n ON q.id_quizz = n.id_quizz
        WHERE q.id_utilisateur = ?
        GROUP BY q.id_quizz;
        `;
        const [rows] = await db.query(query, [id_utilisateur]);
        if(rows.length > 0){
            return rows;
        }else {
            return []
        }
    } catch (error) {
        throw error;
    }
};

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
        WHERE c.id_ue = ? AND uv.role = 'enseignant'
        GROUP BY q.id_quizz
    `;
    try {
        const [rows] = await db.query(query, [ue]);
        if (rows.length > 0) {
            return rows.map(row => ({
                ...row,
                note: row.note_moyenne ? parseFloat(row.note_moyenne).toFixed(1) : 0
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
                note: row.note_moyenne ? parseFloat(row.note_moyenne).toFixed(1) : 0
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
        WHERE c.id_chapitre = ? AND uv.role = 'enseignant'
        GROUP BY q.id_quizz
    `;
    try {
        const [rows] = await db.query(query, [id_chapitre]);

        if (rows.length > 0) {
            return rows.map(row => ({
                ...row,
                note: row.note_moyenne ? parseFloat(row.note_moyenne).toFixed(1) : 0
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
                note: row.note_moyenne ? parseFloat(row.note_moyenne).toFixed(1) : 0
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
            return [];
        }
    } catch (error) {
        throw error;
    }
};

const addNoteUtilisateurPourQuizz = async (id_quizz, id_utilisateur, note) => {
    try {
        const query = `
        INSERT INTO note_du_quizz (note, id_quizz, id_utilisateur)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE note = VALUES(note)
        `;
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
            return [];
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


const ajouterReponsesUtilisateurAuQuizz = async (date, idQuizz, idUtilisateur, reponses) => {
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction();
        const [noteQuizz] = await connection.query(
            `INSERT INTO note_quizz (date, note, id_quizz, id_utilisateur) VALUES (?, 0, ?, ?)`,
            [date, idQuizz, idUtilisateur]
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

const createResultatQuizz =  async (idQuizz, idNoteQuizz) => {
    const quizzType = await getTypeQuizz(idQuizz);
    const { questionsQuizz, reponsesUtilisateur, bonnesReponses } = await preparerDetailsQuizz(idNoteQuizz);
    let resultat;
    if (quizzType === "normal") {
        resultat = calculScoreNormal(questionsQuizz, reponsesUtilisateur, bonnesReponses);
    } else if (quizzType === "negatif") {
        resultat = calculScoreNegatif(questionsQuizz, reponsesUtilisateur, bonnesReponses);
    }
    noteFinal = resultat ? resultat.noteFinale : undefined;
    details = resultat ? resultat.details : undefined;
    return {
        idNoteQuizz,
        noteFinale: noteFinal,
        details: details
    };
};

const enregistrerResultatQuizz = async (idNoteQuizz, noteFinale) => {
    try{
        await db.query(
            `UPDATE note_quizz set note = ? WHERE id_note_quizz = ?`,
            [noteFinale, idNoteQuizz]
        );
        return true;
    }catch(error){
        throw new Error("Impossible d'enregistrer le résultat du quizz");
    }
};


const getResultatQuizz = async (note_quizz) => {
    try{
        resultat = null;
        const [rows] = await db.query(
            `SELECT * FROM note_quizz JOIN quizz on note_quizz.id_quizz = quizz.id_quizz WHERE id_note_quizz = ?`,
            [note_quizz]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            throw new Error("Aucun résultat pour ce quizz");
        }
    
    }catch (error) {
        throw new Error("Impossible de récupérer le résultat du quizz");
    }
};

const createQuizz = async (label, type, chapitre, utilisateur, questions) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            `INSERT INTO quizz (label, type, id_chapitre, id_utilisateur) VALUES (?, ?, ?, ?)`,
            [label, type, chapitre, utilisateur]
        );

        const idQuizz = result.insertId;
        for (const question of questions) {
            const [resultQuestion] = await connection.query(
                `INSERT INTO question (label, nombre_bonne_reponse, type, id_quizz) VALUES (?, ?, ?, ?)`,
                [question.label, question.nombre_bonne_reponse, question.type, idQuizz]
            );

            const idQuestion = resultQuestion.insertId;

            for (const reponse of question.reponses) {
                await connection.query(
                    `INSERT INTO reponse (contenu, est_bonne_reponse, id_question) VALUES (?, ?, ?)`,
                    [reponse.contenu, reponse.est_bonne_reponse, idQuestion]
                );
            }
        }

        await connection.commit();

        return true;
    } catch (error) {
        if (connection) await connection.rollback();
        throw new Error("Impossible de créer le quizz");
    } finally {
        if (connection) await connection.release();
    }
};

const deleteQuizz = async (idQuizz) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            `DELETE FROM note_quizz WHERE id_quizz = ?`,
            [idQuizz]
        );

        await connection.query(
            `DELETE FROM reponse_utilisateur WHERE id_note_quizz IN (SELECT id_note_quizz FROM note_quizz WHERE id_quizz = ?)`,
            [idQuizz]
        );


        await connection.query(
            `DELETE FROM reponse WHERE id_question IN (SELECT id_question FROM question WHERE id_quizz = ?)`,
            [idQuizz]
        );

        await connection.query(
            `DELETE FROM question WHERE id_quizz = ?`,
            [idQuizz]
        );

        await connection.query(
            `DELETE FROM quizz WHERE id_quizz = ?`,
            [idQuizz]
        );

        await connection.commit();

        return true;
    } catch (error) {
        if (conenction) await connection.rollback();
        throw new Error("Impossible de supprimer le quizz");
    } finally {
       if(connection) await connection.release();
    }
};

const ajouterQuestionAuQuizz = async (quizz, data) => {
    let connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            `INSERT INTO question (label, nombre_bonne_reponse, type, id_quizz) VALUES (?, ?, ?, ?)`,
            [data.label, data.nombre_bonne_reponse, data.type, quizz]
        );

        const idQuestion = result.insertId;

        for (const reponse of data.reponses) {
            await connection.query(
                `INSERT INTO reponse (contenu, est_bonne_reponse, id_question) VALUES (?, ?, ?)`,
                [reponse.contenu, reponse.est_bonne_reponse, idQuestion]
            );
        }

        await connection.commit();

        return true;
    } catch (error) {
        if (connection) await connection.rollback();
        throw new Error("Impossible d'ajouter la question");
    } finally {
        if (connection) connection.release();
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
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            `DELETE FROM reponse WHERE id_question = ?`,
            [question]
        );

        await connection.query(
            `DELETE FROM question WHERE id_question = ?`,
            [question]
        );

        await connection.commit();

        return true;
    } catch (error) {
        if (connection) await connection.rollback();
        throw new Error("Impossible de supprimer la question");
    } finally {
        if (connection) connection.release();
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

const updateQuestionAndReponses = async (questionId, data) => {
    await updateQuestion(questionId, data);
    if (data.reponses) {
        await updateReponses(questionId, data.reponses);
    }
};

async function updateQuestion(questionId, { label, nombre_bonne_reponse, type }) {
    const updates = {};
    if (label) updates.label = label;
    if (nombre_bonne_reponse) updates.nombre_bonne_reponse = nombre_bonne_reponse;
    if (type) updates.type = type;

    const keys = Object.keys(updates);
    const values = Object.values(updates);
    
    if (keys.length > 0) {
        let sql = `UPDATE question SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id_question = ?`;
        await db.query(sql, [...values, questionId]);
    }
};

async function updateReponses(questionId, reponses) {
    for (let reponse of reponses) {
        if (reponse.delete && reponse.reponse) {
            await deleteReponse(reponse.reponse);
        } else if (reponse.reponse) {
            await updateReponse(reponse.reponse, reponse.data);
        } else {
            await ajouterReponseAQuestion(questionId, reponse.data);
        }
    }
};

async function updateReponse(reponseId, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    let sql = `UPDATE reponse SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id_reponse = ?`;
    await db.query(sql, [...values, reponseId]);
};

const getNoteQuizzInfo = async (note_quizz) => {
    try{
        const quizz = await getQuizzId(note_quizz);
        const {details} = await createResultatQuizz(quizz, note_quizz);
        const resultat = await getResultatQuizz(note_quizz);
        return { details, resultat };

    }catch(error){
        throw error;
    }
};

const getLastNoteForQuizz = async (id_quizz, id_utilisateur) => {
    try {
        const query = `
        SELECT *
        FROM note_quizz
        WHERE id_quizz = ? AND id_utilisateur = ?
        ORDER BY date DESC
        LIMIT 1`;

        const [rows] = await db.query(query, [id_quizz, id_utilisateur]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return "aucune note pour ce quizz";
        }
    } catch (error) {
        throw error;
    }
};

const getNoteUtilisateurDonneeAuQuizz = async (id_quizz, id_utilisateur) => {
    try{
        const query = `
        SELECT note
        FROM note_du_quizz
        WHERE id_quizz = ? AND id_utilisateur = ?`;

        const [rows] = await db.query(query, [id_quizz, id_utilisateur]);
        if (rows.length > 0) {
            return rows[0].note;
        } else {
            return [];
        }
    }catch(error) {
        throw error;
    }
};

module.exports = {
    listQuizzPasser,
    listQuizzCreer,
    getQuizzInfo,
    getNoteQuizzInfo,
    getNoteUtilisateurDonneeAuQuizz,
    getQuizzProfesseurForUe,
    getQuizzEleveForUe,
    getQuizzProfesseurForChapitre,
    getQuizzEleveForChapitre,
    getNoteUtilisateurQuizz,
    getLastNoteForQuizz,
    addNoteUtilisateurPourQuizz,
    getNoteMoyenneQuiz,
    getQuestionsPourQuizz,
    getReponsesPourQuestion,
    getReponsesUtilisateurPourQuestion,
    getAnnotationsPourQuestion,
    ajouterReponsesUtilisateurAuQuizz,
    getResultatQuizz,
    enregistrerResultatQuizz,
    createResultatQuizz,
    createQuizz,
    deleteQuizz,
    ajouterQuestionAuQuizz,
    ajouterReponseAQuestion,
    addNoteUtilisateurAuQuizz,
    deleteQuestion,
    deleteReponse,
    updateQuizz,
    updateQuestionAndReponses,
    updateReponse,
};