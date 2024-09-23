const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Validation pour les champs généraux
const validateField = (...fieldNames) => {
    return fieldNames.map(fieldName => {
        return body(fieldName)
            .if(body(fieldName).isString()) // Condition pour appliquer la validation seulement si c'est une chaîne
            .matches(/^[a-zA-Z0-9 ]*$/).withMessage(`${fieldName} must contain only alphanumeric characters and spaces.`)
            .isLength({ min: 1, max: 500 }).withMessage(`${fieldName} must be between 1 and 500 characters.`)
            .bail() // Arrête les validations si une des précédentes échoue
            .if(body(fieldName).isNumeric()) // Condition pour appliquer la validation seulement si c'est numérique
            .isInt({ min: -2147483648, max: 2147483647 }).withMessage(`${fieldName} must be a 32-bit integer.`)
    });
};
// Validation pour les champs qui ne doivent pas être sanitizés


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

//pareille que validateField mais pour les champs de type texte nécessitant plus de caractère ainsi que de la poncutation est des accents
const exceptionField = (...fieldNames) => {
    return fieldNames.map(fieldName => {
      return body(fieldName)
        .if(body(fieldName).isString())
        .trim()  // Supprime les espaces de début et de fin
        .escape()  // Encode les caractères HTML pour prévenir les attaques XSS
        .matches(/^[a-zA-Z0-9 ,.!?'"ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñÇç;:()\[\]{}\/*\-+=%$#@\^`~&]*$/)
        .withMessage(`${fieldName} must contain only approved characters including specific punctuation and accents.`)
        .isLength({ min: 1, max: 1000 }).withMessage(`${fieldName} must be between 1 and 1000 characters.`); // Adaptez selon le besoin de votre application
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

const validateObjectSchema = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
    }
    next();
};



module.exports = {
    validate,
    validateRegistrationFields,
    handleValidationErrors,
    validateField,
    exceptionField,
    validateEmail,
    validatePassword,
    hashPassword,
    validateObjectSchema,
};

