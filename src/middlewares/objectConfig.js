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
    generateOwnerQuery: (objectId) => {
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

const coursConfig = {
    tableName: 'cours',
    userIdColumn: 'id_utilisateur',
    objectIdColumn: 'id_study'
};

const ueConfig = {
    tableName: 'ue',
    userIdColumn: 'id_utilisateur',
    objectIdColumn: 'id_ue'
};

module.exports.quizzConfig = {
    quizzConfig,
    questionConfig,
    responseConfig,
};

module.exports.responseForDelConfig = responseForDelConfig;
module.exports.coursConfig = coursConfig;
module.exports.ueConfig = ueConfig;

