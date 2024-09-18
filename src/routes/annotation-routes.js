const express = require('express');
const router = express.Router();
const { verifyTokenBlacklist, verifyAuthorisation, verifyOwner } = require('../middlewares/verifyAuthorisation.js');
const { validateField, handleValidationErrors } = require('../middlewares/sanitizeInput.js');
const {annotationConfig} = require('../middlewares/objectConfig.js');
const {answerToAnnotationConfig} = require('../middlewares/objectConfig.js');
const {annotationValidation} = require('../middlewares/sanitizeInput');
const {validateAnnotationType, validateAnnotationUpdateType, validateAnswerToAnnotationUpdateType } = annotationValidation;
const {annotationCoursSchema, annotationQuizzSchema} = require('../models_JSON/annotationValidation.js');
const { getAllAnnotationForQuizz, getAllAnnotationForCour, getAllAnswerForAnnotation, createAnnotation, addAnswerToAnnotation, deleteAnotation } = require('../controllers/annotation-controllers');


router.post('/annotation-quizz', [validateField("quizz"), handleValidationErrors, verifyAuthorisation ,verifyTokenBlacklist], getAllAnnotationForQuizz);
router.post('/annotation-cours', [validateField("cours") , handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getAllAnnotationForCour);
router.post('/annotation-answer', [validateField("annotation"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getAllAnswerForAnnotation);

router.post('/create-annotation_cours', [validateAnnotationType(annotationCoursSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], createAnnotation);
router.post('/create-annotation_quizz', [validateAnnotationType(annotationQuizzSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], createAnnotation);
router.post('/add-answer', [validateField("annotation"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], addAnswerToAnnotation);

router.put('/update-annotation', [validateAnnotationUpdateType, handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(annotationConfig, "annotation")], createAnnotation);
router.put('/update-answer', [validateAnswerToAnnotationUpdateType, handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(answerToAnnotationConfig, "answer")], addAnswerToAnnotation);

router.post('/delete-annotation', [validateField("annotation"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(annotationConfig, "annotation")], deleteAnotation);
router.post('/delete-answer', [validateField("answer"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(answerToAnnotationConfig, "answer")], deleteAnotation);

module.exports = router;