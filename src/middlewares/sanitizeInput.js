const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const {reponseQuizzSchema, creationQuizzSchema, questionSchema, updateQuestionSchema, updateQuizzSchema, updateReponseSchema} = require('../models_JSON/reponseQuizzValidation.js');
const { schemaInteraction } = require('../models_JSON/trackingDataValidation.js')
const { updateUserSchema } = require('../models_JSON/userValidation.js');
// Validation pour les champs généraux
const validateField = (...fieldNames) => {
    return fieldNames.map(fieldName => {
        return body(fieldName)
            .isLength({ min: 1, max: 500 })
            .trim();
    });
};

// Validation pour l'email
const validateEmail = () => {
    return body('email').optional().isEmail().normalizeEmail({gmail_remove_dots: false});
};

const validateRegistrationFields = (req, res, next) => {
    // Vérifie si les champs email et password sont présents
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Les champs email et password sont obligatoires." });
    }
    // Si les champs sont présents, passe au middleware suivant
    //car les autres middleware prennent les champs en optional pour la route d'update
    next();
};

// Validation pour le mot de passe
const validatePassword = () => {
    return [
        body('password')
            .optional()
            .isLength({ min: 12, max: 50 })
            .withMessage('Le mot de passe doit contenir entre 12 et 50 caractères.')
            .matches(/[A-Z]/)
            .withMessage('Le mot de passe doit contenir au moins une lettre majuscule.')
            .matches(/[a-z]/)
            .withMessage('Le mot de passe doit contenir au moins une lettre minuscule.')
            .matches(/[0-9]/)
            .withMessage('Le mot de passe doit contenir au moins un chiffre.')
            .matches(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/)
            .withMessage('Le mot de passe doit contenir au moins un caractère spécial.')
            .matches(/^[\x20-\x7E]{12,50}$/)
            .withMessage('Le mot de passe doit contenir uniquement les caractères imprimables de la table ASCII.')
    ];
};

const hashPassword = () => {
    return [
        body('password').if((value, { req }) => value !== undefined).customSanitizer(async (password) => {
            if (password) {
                return await bcrypt.hash(password, 10);
            }
            return password;
        })
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateReponseQuizzType = (req, res, next) => {
    const { error } = reponseQuizzSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }
    next();
};

const validateQuizzType = (req, res, next) => {
    const { error } = creationQuizzSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }
    next();
};

const validateQuestionType = (req, res, next) => {
    const { error } = questionSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }
    next();
};

const validateQuizzUpdateType = (req, res, next) => {
    const { error } = updateQuizzSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }
    next();
};

const validateQuestionUpdateType = (req, res, next) => {
    const { error } = updateQuestionSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }
    next();
};

const validateReponseUpdateType = (req, res, next) => {
    const { error } = updateReponseSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }
    next();
};

const validateJtrackingType = (req, res, next) => {
    const { error } = schemaInteraction.validate(req.body.data);
    if (error) {
        return res.status(400).send({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }
    next();
};

const updateUserType = (req, res, next) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }
    next();
};

module.exports = {
    validate,
    validateRegistrationFields,
    validateField,
    validateEmail,
    validatePassword,
    hashPassword
};

module.exports.quizzValidation = { 
    validateQuizzType, 
    validateReponseQuizzType,
    validateQuestionType,
    validateQuizzUpdateType,
    validateQuestionUpdateType,
    validateReponseUpdateType
}

module.exports.jMethode = {
    validateJtrackingType
}

module.exports.userValidation = {
    updateUserType
};
