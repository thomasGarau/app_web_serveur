const Joi = require('joi');

const schemaInteraction = Joi.object({
    chapitre: Joi.number().integer().required(),
    cours: Joi.number().integer().required(),
    dureeSession: Joi.number().integer().min(0).required(),
    clics: Joi.number().integer().min(0).required(),
    scrolls: Joi.number().integer().min(0).required(),
    progression: Joi.number().min(0).max(100).required(),
});


module.exports = {
    schemaInteraction
};