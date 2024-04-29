const quizzConfig = {
    generateOwnerQuery: (userId, objectId) => {
        return {
            query: `SELECT * FROM quizz WHERE id_quizz = ? AND id_utilisateur = ? LIMIT 1`,
            params: [objectId, userId]
        };
    },
    generateFindOwnerQuery: (objectId) => {
        return {
            query: `SELECT id_utilisateur FROM quizz WHERE id_quizz = ? LIMIT 1`,
            params: [objectId]
        };
    }
};

const questionConfig = {
    generateOwnerQuery: (userId, objectId) => {
        return {
            query: `SELECT quizz.id_utilisateur FROM quizz
            JOIN question ON quizz.id_quizz = question.id_quizz
            WHERE question.id_question = ? LIMIT 1`,
            params: [objectId]
        };
    },
    generateFindOwnerQuery: (objectId) => {
        return {
            query: `SELECT quizz.id_utilisateur FROM quizz
            JOIN question ON quizz.id_quizz = question.id_quizz
            WHERE question.id_question = ? LIMIT 1`,
            params: [objectId]
        };
    }
};

const responseConfig = {
    generateOwnerQuery: (userId, objectId) => {
        return {
            query: `SELECT quizz.id_utilisateur FROM quizz
                    JOIN question ON quizz.id_quizz = question.id_quizz
                    JOIN reponse ON question.id_question = reponse.id_question
                    WHERE reponse.id_reponse = ? LIMIT 1`,
            params: [objectId, userId]
        };
    },
    generateFindOwnerQuery: (objectId) => {
        return {
            query: `SELECT quizz.id_utilisateur FROM quizz
                    JOIN question ON quizz.id_quizz = question.id_quizz
                    JOIN reponse ON question.id_question = reponse.id_question
                    WHERE reponse.id_reponse = ? LIMIT 1`,
            params: [objectId]
        };
    }
};

const responseForDelConfig = {
    generateOwnerQuery: (userId, objectId) => {
        return {
            query: `SELECT quizz.id_utilisateur FROM quizz
                    JOIN question ON quizz.id_quizz = question.id_quizz
                    JOIN reponse ON question.id_question = reponse.id_question
                    WHERE reponse.id_reponse = ? AND quizz.id_utilisateur = ? LIMIT 1`,
            params: [objectId, userId]
        };
    },
    generateFindOwnerQuery: (objectId) => {
        return {
            query: `SELECT quizz.id_utilisateur FROM quizz
                    JOIN question ON quizz.id_quizz = question.id_quizz
                    JOIN reponse ON question.id_question = reponse.id_question
                    WHERE reponse.id_reponse = ? LIMIT 1`,
            params: [objectId]
        };
    }
};

const ueUserConfig = {
    generateOwnerQuery: (userId) => {
        return {
             query: `SELECT ue.id_ue, ue.label
                FROM utilisateur
                JOIN promotion ON utilisateur.id_utilisateur = promotion.id_utilisateur
                JOIN formation_ue ON promotion.id_formation = formation_ue.formation_id_formation
                JOIN ue ON formation_ue.ue_id_ue = ue.id_ue
                WHERE utilisateur.num_etudiant = ?`,
            params: [userId]
        };
    }
}

const ueConfig = {
    generateOwnerQuery: (userId, objectId) => {
        return {
          query : `SELECT COUNT(*) AS count
            FROM utilisateur u
            JOIN enseignant_ue eu ON u.id_utilisateur = eu.id_utilisateur
            JOIN chapitre c ON eu.id_ue = c.id_ue
            JOIN cours cr ON c.id_chapitre = cr.id_chapitre
            WHERE u.num_etudiant = ? AND cr.id_cours = ?`,
          params: [userId, objectId]
        };
    }
}

const coursConfig = {
    tableName: 'cours',
    userIdColumn: 'id_utilisateur',
    objectIdColumn: 'id_study'
};

module.exports.quizzConfig = {
    quizzConfig,
    questionConfig,
    responseConfig,
    responseForDelConfig
};
module.exports.coursConfig = coursConfig;
module.exports.ueConfig = ueConfig;
module.exports.ueUserConfig = ueUserConfig;
