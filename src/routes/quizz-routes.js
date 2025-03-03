const express = require('express')
const router = express.Router()
const {verifyAuthorisation, verifyTokenBlacklist, verifyOwner} = require('../middlewares/verifyAuthorisation.js');
const { validateField, handleValidationErrors } = require('../middlewares/sanitizeInput.js');
const {
    listQuizzCreer,
    listQuizzPasser,
    getQuizzInfo,
    getNoteQuizzInfo,
    getNoteUtilisateurDonneeAuQuizz,
    getQuizzForUe,
    getQuizzForChapter,
    getMeilleureNoteUtilisateurPourQuizz,
    getLastNoteForQuizz,
    getNoteMoyennePourQuizz,
    getAnnotationsPourQuestion,
    getQuestionsPourQuizz,
    getReponsesPourQuestion,
    getResultatUtilisateurQuizz,
    getReponsesUtilisateurPourQuestion,
    ajouterNoteUtilisateurAuQuizz,
    ajouterNoteUtilisateurPourQuizz,
    ajouterReponseUtilisateurAuQuizz,
    ajouterQuizz,
    deleteQuizz,
    ajouterQuestionAuQuizz,
    deleteQuestion,
    updateQuizz,
    updateQuestion,  
} = require('../controllers/quizz-controller.js');
const {quizzConfig} = require('../middlewares/objectConfig.js');
const {questionConfig} = require('../middlewares/objectConfig.js');
const {noteQuizzConfig} = require('../middlewares/objectConfig.js');
const { validateObjectSchema } = require('../middlewares/sanitizeInput.js');
const { creationQuizzSchema, questionSchema, reponseQuizzSchema, updateQuizzSchema, updateQuestionSchema, } = require('../models_JSON/reponseQuizzValidation.js');

router.get('/listQuizzCreer', [verifyAuthorisation, verifyTokenBlacklist], listQuizzCreer);
router.get('/listQuizzPasser', [verifyAuthorisation, verifyTokenBlacklist], listQuizzPasser);

router.post('/getNoteUtilisateurDonneeAuQuizz', [validateField("quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getNoteUtilisateurDonneeAuQuizz);
router.post('/getNoteQuizzInfo', [validateField("note_quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(noteQuizzConfig, "note_quizz")], getNoteQuizzInfo);
router.post('/getQuizzInfo', [validateField("quizz"), handleValidationErrors,  verifyAuthorisation, verifyTokenBlacklist], getQuizzInfo);
router.post('/quizzForUe', [validateField("ue"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getQuizzForUe);
router.post('/quizzForChapter', [validateField("chapitre"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getQuizzForChapter);
router.post('/meilleureNoteUtilisateurPourQuizz', [validateField("quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getMeilleureNoteUtilisateurPourQuizz);
router.post('/getLastNoteForQuizz', [validateField("quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getLastNoteForQuizz);
router.post('/noteMoyennePourQuizz', [validateField("quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getNoteMoyennePourQuizz);
router.post('/questionsPourQuizz', [validateField("quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getQuestionsPourQuizz);
router.post('/reponsesPourQuestion', [validateField("question"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getReponsesPourQuestion);
router.post('/reponsesUtilisateurPourQuestion', [validateField("question", "quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getReponsesUtilisateurPourQuestion);
router.post('/resultatUtilisateurQuizz', [validateField("note_quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getResultatUtilisateurQuizz);
router.post('/annotationsPourQuestion', [validateField("question"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], getAnnotationsPourQuestion);

router.post('/ajouterNoteUtilisateurPourQuizz', [validateField("quizz", "note"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], ajouterNoteUtilisateurPourQuizz);
router.post('/ajouterNoteUtilisateurAuQuizz', [validateField("quizz", "note")], handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, ajouterNoteUtilisateurAuQuizz);
router.post('/ajouterReponseUtilisateurAuQuizz', [validateObjectSchema(reponseQuizzSchema), verifyAuthorisation, verifyTokenBlacklist], ajouterReponseUtilisateurAuQuizz);
router.post('/ajouterQuizz', [validateObjectSchema(creationQuizzSchema), verifyAuthorisation, verifyTokenBlacklist], ajouterQuizz);
router.post('/ajouterQuestionAuQuizz', [validateObjectSchema(questionSchema), validateField("quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(quizzConfig, "quizz")], ajouterQuestionAuQuizz);

router.post('/deleteQuizz', [validateField("quizz"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(quizzConfig, "quizz")], deleteQuizz);
router.delete('/deleteQuestion', [validateField("question"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(questionConfig, "question")], deleteQuestion);

router.put('/updateQuizz', [validateObjectSchema(updateQuizzSchema), validateField("quizz"), handleValidationErrors,  verifyAuthorisation, verifyTokenBlacklist, verifyOwner(quizzConfig, "quizz")], updateQuizz);
router.put('/updateQuestion', [validateObjectSchema(updateQuestionSchema), validateField("question"), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(questionConfig, "question")], updateQuestion);

module.exports = router;