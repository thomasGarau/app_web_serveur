const db = require('../../config/database');


const getAllAnnotationForQuizz = async (quizz) => {
    try {
        const query = `
            SELECT aq.* , a.* , uv.nom, uv.prenom, uv.num_etudiant
            FROM annotation_quizz aq
            JOIN annotation a ON aq.id_annotation = a.id_annotation
            JOIN utilisateur u ON a.id_utilisateur = u.id_utilisateur
            JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
            WHERE aq.id_question IN (
            SELECT q.id_question
            FROM question q
            WHERE q.id_quizz = ?
            );
        `;
        const [rows] = await db.query(query, [quizz]);
        return rows;

    } catch (error) {
        throw new Error('Erreur lors de la récupération des annotations');
    }

}

const getAllAnnotationForCours = async (cours) => {
    try {
        const query = `
            SELECT ac.* , a.* , uv.nom, uv.prenom, uv.num_etudiant
            FROM annotation_cours ac 
            JOIN annotation a ON ac.id_annotation = a.id_annotation 
            JOIN utilisateur u ON a.id_utilisateur = u.id_utilisateur
            JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
            JOIN cours c ON ac.id_cours = c.id_cours 
            WHERE c.id_cours = ?;
        `
        const [rows] = await db.query(query, [cours]);
        return rows;

    } catch (error) {
        console.error(error); 
        throw new Error('Erreur lors de la récupération des annotations', error);
    }
}

const getAllAnswerForAnnotation = async (annotation) => {
    console.log(annotation);
    try {
        const query = `
            SELECT ra.*, uv.nom, uv.prenom, u.num_etudiant
            FROM reponse_annotation ra
            JOIN utilisateur u ON ra.id_utilisateur = u.id_utilisateur
            JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
            WHERE ra.id_annotation = ?;
        `;
        const [rows] = await db.query(query, [annotation]);
        return rows;

    } catch (error) {
        throw new Error('Erreur lors de la récupération des réponses', error);
    }
}

// Fonction générique pour insérer dans la table 'annotation'
async function insertAnnotation(connection, contenu, etat, date, utilisateur) {
    const insertAnnotationQuery = `
        INSERT INTO annotation (contenu, etat_annotation, date, id_utilisateur)
        VALUES (?, ?, ?, ?);
    `;
    const [result] = await connection.query(insertAnnotationQuery, [contenu, etat, date, utilisateur]);
    return result.insertId;
};

// Fonction générique pour créer une annotation liée à une table spécifique
async function createAnnotation(tableName, foreignKeyColumn, foreignKeyValue, contenu, etat, date, utilisateur) {
    let connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const annotationId = await insertAnnotation(connection, contenu, etat, date, utilisateur);
        // Préparer la requête pour insérer dans la table spécifique
        const insertQuery = `
            INSERT INTO ${tableName} (id_annotation, ${foreignKeyColumn})
            VALUES (?, ?);
        `;
        await connection.query(insertQuery, [annotationId, foreignKeyValue]);
        await connection.commit();
        return true;
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        throw new Error(`Erreur lors de la création de l'annotation`, error);
    } finally {
        if (connection) connection.release();
    }
};

// Fonctions spécifiques pour créer une annotation de type 'cours' ou 'quizz'
const createAnnotationCours = async (cours, contenu, etat, date, utilisateur) => {
    return await createAnnotation('annotation_cours', 'id_cours', cours, contenu, etat, date, utilisateur);
};

const createAnnotationQuizz = async (question, contenu, etat, date, utilisateur) => {
    return await createAnnotation('annotation_quizz', 'id_question', question, contenu, etat, date, utilisateur);
};

const addAnswerToAnnotation = async (annotation, contenu, date, utilisateur) => {
    try {
        const query = `
            INSERT INTO reponse_annotation (id_annotation, contenu, date, id_utilisateur)
            VALUES (?, ?, ?, ?);
        `;
        await db.query(query, [annotation, contenu, date, utilisateur]);
        return true;
    } catch (error) {
        throw new Error('Erreur lors de l\'ajout de la réponse', error);
    }
}

const deleteAnnotation = async (annotation) => {
    let connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Supprimer l'annotation dans les tables enfants et la table principale
        const deleteQuery = `
            DELETE FROM reponse_annotation WHERE id_annotation = ?;
            DELETE FROM annotation_cours WHERE id_annotation = ?;
            DELETE FROM annotation_quizz WHERE id_annotation = ?;
            DELETE FROM annotation WHERE id_annotation = ?;
        `;

        await connection.query(deleteQuery, [annotation, annotation, annotation, annotation]);

        await connection.commit();
        return true;

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        throw new Error('Erreur lors de la suppression de l\'annotation', error);

    } finally {
        if (connection) connection.release();
    }
};

const deleteAnswer = async (reponse) => {
    try {
        const query = `DELETE FROM reponse_annotation WHERE id_reponse_annotation = ?;`;
        await db.query(query, [reponse]);
        return true;
    } catch (error) {
        throw new Error('Erreur lors de la suppression de la réponse', error);
    }
}

const updateAnnotationState = async (annotation, etat) => {
    try {
        const query = `
            UPDATE annotation
            SET etat_annotation = ?
            WHERE id_annotation = ?;
        `;
        await db.query(query, [etat, annotation]);
        return true;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la modification de l\'annotation', error);
    }
}

const updateAnnotationContent = async (annotation, contenu, date) => {
    try {
        const query = `
            UPDATE annotation
            SET contenu = ?, date = ?
            WHERE id_annotation = ?;
        `;
        await db.query(query, [contenu, date, annotation]);
        return true;
    } catch (error) {
        throw new Error('Erreur lors de la modification de l\'annotation', error);
    }
}

const updateAnswer = async (reponse, contenu, date) => {
    try {
        const query = `
            UPDATE reponse_annotation
            SET contenu = ?, date = ?
            WHERE id_reponse_annotation = ?;
        `;
        await db.query(query, [contenu, date, reponse]);
        return true;
    } catch (error) {
        throw new Error('Erreur lors de la modification de la réponse', error);
    }
}


module.exports = {
    getAllAnnotationForQuizz,
    getAllAnnotationForCours,
    getAllAnswerForAnnotation,
    createAnnotationCours,
    createAnnotationQuizz,
    addAnswerToAnnotation,
    deleteAnnotation,
    deleteAnswer,
    updateAnnotationState,
    updateAnnotationContent,
    updateAnswer
}
