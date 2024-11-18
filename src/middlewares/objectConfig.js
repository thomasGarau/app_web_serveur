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
    generateOwnerQuery: (userId, objectId,) => {
        return {
            query: `SELECT * FROM quizz
            JOIN question ON quizz.id_quizz = question.id_quizz
            WHERE question.id_question = ? AND quizz.id_utilisateur = ? LIMIT 1`,
            params: [objectId, userId]
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

// Verifier si l'utilisateur est bien le propriétaire du message ou si c'est un admin
const messageConfig = {
    generateOwnerQuery: (userId, objectId) => {
        return {
            query: `SELECT *
                    FROM message
                    WHERE id_message = ? AND id_utilisateur = ?`,
            params: [objectId, userId]
        };
    }
};


const ueUserConfig = {
    generateOwnerQuery: (userId) => {
        return {
             query: `SELECT ue.id_ue, ue.label
                FROM utilisateur
                JOIN promotion ON utilisateur.num_etudiant = promotion.num_etudiant
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
          query : `SELECT *
            FROM utilisateur u
            JOIN enseignants_ue eu ON u.id_utilisateur = eu.id_utilisateur
            JOIN chapitre c ON eu.id_ue = c.id_ue
            JOIN cours cr ON c.id_chapitre = cr.id_chapitre
            WHERE u.id_utilisateur = ? AND cr.id_cours = ?`,
          params: [userId, objectId]
        };
    }
}

const coursConfig = {
    tableName: 'cours',
    userIdColumn: 'id_utilisateur',
    objectIdColumn: 'id_study'
};

const userConfig = {
    generateOwnerQuery: (userId) => {
        return {
            query: `SELECT *
                    FROM utilisateur
                    WHERE id_utilisateur = ?`,
            params: [userId]
        };
    }
};

const noteQuizzConfig = {
    generateOwnerQuery: (userId, objectId) => {
        return {
            query: `SELECT *
                    FROM note_quizz
                    WHERE id_note_quizz = ? AND id_utilisateur = ?`,
            params: [objectId, userId]
        };
    }
};

const forumConfig = {
    generateOwnerQuery: (userId, objectId) => {
        return {
            query: `SELECT *
                    FROM forum
                    WHERE id_forum = ? AND id_utilisateur = ?`,
            params: [objectId, userId]
        };
    }
};

const annotationConfig  = {
    generateOwnerQuery: (userId, annotationId) => {
        return {
            query: `SELECT *
                    FROM annotation a
                    LEFT JOIN annotation_cours ac ON a.id_annotation = ac.id_annotation
                    LEFT JOIN cours c ON ac.id_cours = c.id_cours
                    LEFT JOIN annotation_quizz aq ON a.id_annotation = aq.id_annotation
                    LEFT JOIN question q ON aq.id_question = q.id_question
                    LEFT JOIN quizz qz ON q.id_quizz = qz.id_quizz
                    WHERE a.id_annotation = ?
                    AND (
                        (c.id_utilisateur = ? AND ac.id_cours IS NOT NULL) -- L'annotation est liée à un cours, et l'utilisateur est propriétaire du cours
                        OR
                        (qz.id_utilisateur = ? AND aq.id_question IS NOT NULL) --L'annotation est liée à un quizz, et l'utilisateur est propriétaire du quizz
                    )`,    
            params: [annotationId, userId, userId]
        };
    }
};

const answerToAnnotationConfig = {
    generateOwnerQuery: (userId, answerId) => {
        return {
            query: `
                SELECT *
                FROM reponse_annotation ra
                JOIN annotation a ON ra.id_annotation = a.id_annotation
                LEFT JOIN annotation_cours ac ON a.id_annotation = ac.id_annotation
                LEFT JOIN cours c ON ac.id_cours = c.id_cours
                LEFT JOIN annotation_quizz aq ON a.id_annotation = aq.id_annotation
                LEFT JOIN question q ON aq.id_question = q.id_question
                LEFT JOIN quizz qz ON q.id_quizz = qz.id_quizz
                WHERE ra.id_reponse_annotation = ? 
                AND (
                    ra.id_utilisateur = ? -- Propriétaire de la réponse
                    OR 
                    (ac.id_annotation IS NOT NULL AND c.id_utilisateur = ?) -- Propriétaire du cours
                    OR 
                    (aq.id_annotation IS NOT NULL AND qz.id_utilisateur = ?) -- Propriétaire du quizz
                )
            `,
            params: [answerId, userId, userId, userId]
        };
    }
};

const flashcardConfig = {
    generateOwnerQuery: (userId, objectId) => {
        return {
            query: `SELECT *
                    FROM flashcard
                    WHERE id_flashcard = ? AND id_utilisateur = ?`,
            params: [objectId, userId]
        };
    }
}

const flashcardVisibilityConfig = {
    generateVisibilityQuery: (userId, objectId) => {
        return {
            query: `SELECT *
                    FROM flashcard
                    WHERE id_flashcard = ? AND visibilite = 'public'`,
            params: [objectId]
        };
    }
};



module.exports.quizzConfig = quizzConfig,
module.exports.noteQuizzConfig = noteQuizzConfig;
module.exports.questionConfig = questionConfig;
module.exports.responseConfig = responseConfig;
module.exports.responseForDelConfig = responseForDelConfig;
module.exports.coursConfig = coursConfig;
module.exports.ueConfig = ueConfig;
module.exports.ueUserConfig = ueUserConfig;
module.exports.userConfig = userConfig;
module.exports.forumConfig = forumConfig;
module.exports.messageConfig = messageConfig;
module.exports.annotationConfig = annotationConfig;
module.exports.answerToAnnotationConfig = answerToAnnotationConfig;
module.exports.flashcardConfig = flashcardConfig;
module.exports.flashcardVisibilityConfig = flashcardVisibilityConfig;
