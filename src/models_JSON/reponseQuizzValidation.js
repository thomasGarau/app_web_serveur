const Joi = require('joi');

const idReponseSchema = Joi.object({
    idReponse: Joi.number().integer().required()
});

const reponseSchema = Joi.object({
    contenu: Joi.string().min(1).max(255).required(),
    est_bonne_reponse: Joi.number().integer().required()
});

const questionSchema = Joi.object({
    quizz: Joi.number().integer().optional(),
    label: Joi.string().min(1).max(255).required(),
    nombre_bonne_reponse: Joi.number().integer().required(),
    type: Joi.string().min(1).max(255).required(),
    reponses: Joi.array().items(reponseSchema).min(2).required()
});

const creationQuizzSchema = Joi.object({
    data : Joi.object({
        label: Joi.string().min(1).max(255).required(),
        type: Joi.string().min(1).max(255).required(),
        chapitre: Joi.number().integer().required(),
        questions: Joi.array().items(questionSchema).min(3).required()
    }).required()
});

const reponseQuizzSchema = Joi.object({
    quizz: Joi.number().integer().optional(),
    data: Joi.array().items(idReponseSchema).min(1).required()
});

const updateQuizzSchema = Joi.object({
    quizz: Joi.number().integer().required(),
    data: Joi.object({
        label: Joi.string().min(1).max(255).optional(),
        id_chapitre: Joi.number().integer().optional(),
        type: Joi.string().min(1).max(255).optional()
    }).required().min(1)
});

const updateReponseSchema = Joi.object({
    reponse: Joi.number().integer().optional(),
    delete: Joi.boolean().optional(),
    data: Joi.object({
        contenu: Joi.string().min(1).max(255).optional(),
        est_bonne_reponse: Joi.boolean().optional()
    }).required().min(1)
});

const updateQuestionSchema = Joi.object({
    question: Joi.number().integer().required(),
    data: Joi.object({
        label: Joi.string().min(1).max(255).optional(),
        nombre_bonne_reponse: Joi.number().integer().optional(),
        type: Joi.string().min(1).max(255).optional(),
        reponses: Joi.array().items(updateReponseSchema).min(2).optional()
    }).required().min(1)
});


module.exports = { 
    reponseQuizzSchema,
    creationQuizzSchema,
    questionSchema,
    updateQuizzSchema,
    updateQuestionSchema,
    updateReponseSchema
};