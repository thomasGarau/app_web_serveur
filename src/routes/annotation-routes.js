const express = require('express');
const router = express.Router();
const { verifyTokenBlacklist, verifyAuthorisation, verifyOwner } = require('../middlewares/verifyAuthorisation.js');
const { validateField, handleValidationErrors, validateObjectSchema } = require('../middlewares/sanitizeInput.js');
const {annotationConfig, closeAnnotationConfig, answerToAnnotationConfig, closeAnswerToAnnotationConfig} = require('../middlewares/objectConfig.js');
const {annotationCoursSchema, annotationQuizzSchema, annotationUpdateSchema, answerToAnnotationUpdateSchema, answerToAnnotationSchema} = require('../models_JSON/annotationValidation.js');
const { getAllAnnotationForQuizz, getAllAnnotationForCours, getAllAnswerForAnnotation, createAnnotationCours, createAnnotationQuizz, addAnswerToAnnotation, updateAnnotationState, updateAnnotationContent, updateAnswer, deleteAnotation, deleteAnswer } = require('../controllers/annotation-controller');


router.post('/annotation-quizz', [validateField("quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getAllAnnotationForQuizz);
router.post('/annotation-cours', [validateField("cours") , handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getAllAnnotationForCours);
router.post('/annotation-answer', [validateField("annotation"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getAllAnswerForAnnotation);

router.post('/create-annotation-cours', [validateObjectSchema(annotationCoursSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], createAnnotationCours);
router.post('/create-annotation-quizz', [validateObjectSchema(annotationQuizzSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], createAnnotationQuizz);
router.post('/add-answer', [validateObjectSchema(answerToAnnotationSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], addAnswerToAnnotation);

router.put('/update-annotation-state', [validateObjectSchema(annotationUpdateSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(closeAnnotationConfig, "annotation")], updateAnnotationState);
router.put('/update-annotation-content', [validateObjectSchema(annotationUpdateSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(annotationConfig, "annotation")], updateAnnotationContent);

router.put('/update-answer', [validateObjectSchema(answerToAnnotationUpdateSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(answerToAnnotationConfig, "reponse")], updateAnswer);

router.delete('/delete-annotation', [validateField("annotation"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(closeAnnotationConfig, "annotation")], deleteAnotation);
router.delete('/delete-answer', [validateField("reponse"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(closeAnswerToAnnotationConfig, "reponse")], deleteAnswer);

module.exports = router;