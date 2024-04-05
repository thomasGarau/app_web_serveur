const Joi = require('joi');

const idReponseSchema = Joi.object({
    idReponse: Joi.number().integer().required()
});

const reponseSchema = Joi.object({
    contenu: Joi.string().min(1).max(255).required(),
    est_bonne_reponse: Joi.boolean().required()
});

const questionsSchema = Joi.object({
    label: Joi.string().min(1).max(255).required(),
    nombre_bonne_reponse: Joi.number().integer().required(),
    type: Joi.string().min(1).max(255).required(),
    reponses: Joi.array().items(reponseSchema).required()
});

const creationQuizzSchema = Joi.object({
    label: Joi.string().min(1).max(255).required(),
    type: Joi.string().min(1).max(255).required(),
    chapitre: Joi.number().integer().required(),
    questions: Joi.array().items(questionsSchema).required()
});

const reponseQuizzSchema = Joi.object({
    quizz: Joi.number().integer().required(),
    data: Joi.array().items(idReponseSchema).required()
});


module.exports = { reponseQuizzSchema, creationQuizzSchema, questionsSchema };