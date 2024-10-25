const Joi = require('joi');
const { visibiliteEnum } = require('../constants/enums.js');
const { VisibiliteEnum } = VisibiliteEnum;

const flashcardSchema = Joi.object({
    chapitre: Joi.number().integer().required(),
    question: Joi.string().min(1).max(255).required(),
    reponse: Joi.string().min(1).max(255).required(),
    visibilite: Joi.string().valid(...Object.values(VisibiliteEnum)).required()
});

const updateFlashcardSchema = Joi.object({
    question: Joi.string().min(1).max(255).optional(),
    reponse: Joi.string().min(1).max(255).optional(),
    visibilite: Joi.string().valid(...Object.values(VisibiliteEnum)).optional(),
});


module.exports = {
    flashcardSchema,
    updateFlashcardSchema
}