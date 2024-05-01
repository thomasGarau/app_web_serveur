const Joi = require('joi');

const schemaInteraction = Joi.object({
    cours: Joi.string().required(),
    debutSuivis: Joi.date().timestamp().required(),
    finSuivis: Joi.date().timestamp().required(),
    clics: Joi.number().integer().min(0).required(),
    scrolls: Joi.number().integer().min(0).required(),
    progression: Joi.number().min(0).max(100).required(),
});


module.exports = {
    schemaInteraction
};