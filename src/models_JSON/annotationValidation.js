const Joi = require('joi');
const { annotation } = require('../constants/enums.js');
const { EtatAnnotationEnum } = annotation;

const annotationSchema = Joi.object({
    mail_utilisateur: Joi.string().min(1).max(255).required(),
    date: Joi.date().required(),
    etat: Joi.string().valid(...Object.values(EtatAnnotationEnum)).required(),
    contenu: Joi.string().min(1).max(1000).required()
});

const annotation_cours_Schema = Joi.object({
    annotation: Joi.array().items(annotationSchema).required(),
    cours: Joi.number().integer().required(),
    index_depart: Joi.number().integer().required(),
    index_fin: Joi.number().integer().required()
});

const annotation_quizz_Schema = Joi.object({
    annotation: Joi.array().items(annotationSchema).required(),
    question: Joi.number().integer().required()
}); 

const answerToAnnotationSchema = Joi.object({
    id_annotation: Joi.number().integer().required(),
    mail_utilisateur: Joi.string().min(1).max(255).required(),
    date: Joi.date().required(),
    contenu: Joi.string().min(1).max(1000).required()
});

const annotationUpdateSchema = Joi.object({
    annotation: Joi.number().integer().required(),
    etat: Joi.string().valid(...Object.values(EtatAnnotationEnum)).optional(),
    contenu: Joi.string().min(1).max(1000).optional()
});

const answerToAnnotationUpdateSchema = Joi.object({
    answer: Joi.number().integer().required(),
    contenu: Joi.string().min(1).max(255).optional()
});



module.exports = {
    annotationSchema,
    annotation_cours_Schema,
    annotation_quizz_Schema,
    answerToAnnotationSchema,
    annotationUpdateSchema,
    answerToAnnotationUpdateSchema
}