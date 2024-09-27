const Joi = require('joi');
const { annotation } = require('../constants/enums.js');
const { EtatAnnotationEnum } = annotation;

const annotationSchema = Joi.object({
    date: Joi.date().required(),
    etat: Joi.string().valid(...Object.values(EtatAnnotationEnum)).required(),
    contenu: Joi.string().min(1).max(1000).required()
});

const annotationCoursSchema = Joi.object({
    annotation: Joi.array().items(annotationSchema).required(),
    cours: Joi.number().integer().required(),
});

const annotationQuizzSchema = Joi.object({
    annotation: Joi.array().items(annotationSchema).required(),
    question: Joi.number().integer().required()
}); 

const answerToAnnotationSchema = Joi.object({
    annotation: Joi.number().integer().required(),
    date: Joi.date().required(),
    contenu: Joi.string().min(1).max(1000).required()
});

const annotationUpdateSchema = Joi.object({
    annotation: Joi.number().integer().required(),
    etat: Joi.string().valid(...Object.values(EtatAnnotationEnum)).optional(),
    contenu: Joi.string().min(1).max(1000).optional()
});

const answerToAnnotationUpdateSchema = Joi.object({
    reponse: Joi.number().integer().required(),
    contenu: Joi.string().min(1).max(255).optional()
});



module.exports = {
    annotationSchema,
    annotationCoursSchema,
    annotationQuizzSchema,
    answerToAnnotationSchema,
    annotationUpdateSchema,
    answerToAnnotationUpdateSchema
}