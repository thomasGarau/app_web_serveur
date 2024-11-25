const Joi = require('joi');
const { visibiliteEnum } = require('../constants/enums.js');
const { VisibiliteEnum } = visibiliteEnum;

const nodeSchema = Joi.object({
    id: Joi.string().required(),
    type: Joi.string().required(),
    label: Joi.string().required(),
    color: Joi.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/).required(), // Validation des couleurs en hexadécimal
    position: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required()
    }).required()
});

const edgeSchema = Joi.object({
    id: Joi.string().required(),
    source: Joi.string().required(),
    target: Joi.string().required(),
    sourceHandle: Joi.string().allow(null).optional(),
    targetHandle: Joi.string().allow(null).optional()
});

const detailsSchema = Joi.object({
    nodes: Joi.array().items(nodeSchema).required(),
    edges: Joi.array().items(edgeSchema).required()
});

const carteMentaleSchema = Joi.object({
    titre: Joi.string().min(1).max(255).required(),
    chapitre: Joi.number().integer().required(),
    visibilite: Joi.string().valid(...VisibiliteEnum).required(),
    details: detailsSchema.required()
});

const updateCarteMentaleSchema = Joi.object({
    carteMentale: Joi.number().integer().required(),
    titre: Joi.string().min(1).max(255).optional(),
    visibilite: Joi.string().valid(...VisibiliteEnum).optional(),
    details: detailsSchema.optional()
});

module.exports = {
    carteMentaleSchema,
    updateCarteMentaleSchema
}