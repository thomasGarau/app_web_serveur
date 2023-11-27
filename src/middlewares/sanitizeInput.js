const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Validation pour les champs généraux
const validateField = (...fieldNames) => {
    return fieldNames.map(fieldName => {
        return body(fieldName).isLength({ min: 1, max: 100 }).trim().escape();
    });
};

// Validation pour l'email
const validateEmail = () => {
    return body('email').isEmail().normalizeEmail();
};

// Validation pour le mot de passe
const validatePassword = () => {
    return body('password').isLength({ min: 12, max: 50}).customSanitizer(async (password) => {
        const regex = /^[\x20-\x7E]{12,50}$/;
        if (!regex.test(password)) {
            throw new Error('Le mot de passe doit contenir au moins 12 caractères et au plus 50 caractères');
        }
        return password;
    });
};

const hashPassword = () => {
    return body('password').customSanitizer(async (password) => {
        return await bcrypt.hash(password, 10);
    })
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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