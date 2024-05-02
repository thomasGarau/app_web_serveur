const Joi = require('joi');

const updateUserSchema = Joi.object({
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    date_naissance: Joi.date().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
});


module.exports = {
    updateUserSchema
};