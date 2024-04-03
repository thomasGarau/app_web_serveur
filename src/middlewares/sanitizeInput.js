const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Validation pour les champs généraux
const validateField = (...fieldNames) => {
    return fieldNames.map(fieldName => {
        return body(fieldName)
            .isLength({ min: 1, max: 100 })
            .trim();
    });
};

// Validation pour l'email
const validateEmail = () => {
    return body('email').isEmail().normalizeEmail();
};

// Validation pour le mot de passe
const validatePassword = () => {
    return [
        body('password')
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
    return body('password').customSanitizer(async (password) => {
        return await bcrypt.hash(password, 10);
    })
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validate,
    validateField,
    validateEmail,
    validatePassword,
    hashPassword
};