const express = require('express')
const router = express.Router()
const {
    getQuizzForUe,
    getMeilleureNoteUtilisateurPourQuizz,
    getNoteMoyennePourQuizz,
    getAnnotationsPourQuestion,
    getQuestionsPourQuizz,
    getReponsesPourQuestion,
    getResultatUtilisateurQuizz,
    getReponsesUtilisateurPourQuestion,
    ajouterNoteUtilisateurPourQuizz,
    ajouterReponseUtilisateurAuQuizz,
    ajouterQuizz,
    deleteQuizz,
    ajouterQuestionAuQuizz,
    ajouterReponseAQuestion,
    deleteQuestion,
    deleteReponse,
    updateQuizz,
    updateQuestion,
    updateReponse
} = require('../controllers/quizz-controller.js');
const {quizzConfig, questionConfig, responseConfig, responseForDelConfig} = require('../middlewares/objectConfig.js');
const {verifyAuthorisation, verifyTokenBlacklist, verifyOwner} = require('../middlewares/verifyAuthorisation.js');
const { validateField } = require('../middlewares/sanitizeInput.js');
const { quizzValidation } = require('../middlewares/sanitizeInput.js');
const { validateQuizzType, validateReponseQuizzType, validateQuestionType } = quizzValidation;

router.get('/quizzForUe', [validateField("ue"), verifyAuthorisation, verifyTokenBlacklist], getQuizzForUe);
router.get('/meilleureNoteUtilisateurPourQuizz', [validateField("quizz"), verifyAuthorisation, verifyTokenBlacklist], getMeilleureNoteUtilisateurPourQuizz);
router.get('/noteMoyennePourQuizz', [validateField("quizz"), verifyAuthorisation, verifyTokenBlacklist], getNoteMoyennePourQuizz);
router.get('/questionsPourQuizz', [validateField("quizz"), verifyAuthorisation, verifyTokenBlacklist], getQuestionsPourQuizz);
router.get('/reponsesPourQuestion', [validateField("question"), verifyAuthorisation, verifyTokenBlacklist], getReponsesPourQuestion);
router.get('/reponsesUtilisateurPourQuestion', [validateField("question", "quizz"), verifyAuthorisation, verifyTokenBlacklist], getReponsesUtilisateurPourQuestion);
router.get('/resultatUtilisateurQuizz', [validateField("note_quizz"), verifyAuthorisation, verifyTokenBlacklist], getResultatUtilisateurQuizz);
router.get('/annotationsPourQuestion', [validateField("question", "quizz"), verifyAuthorisation, verifyTokenBlacklist], getAnnotationsPourQuestion);

router.post('/ajouterNoteUtilisateurPourQuizz', [validateField("quizz", "note"), verifyAuthorisation, verifyTokenBlacklist], ajouterNoteUtilisateurPourQuizz);
router.post('/ajouterReponseUtilisateurAuQuizz', [validateField("quizz"), validateReponseQuizzType,  verifyAuthorisation, verifyTokenBlacklist], ajouterReponseUtilisateurAuQuizz);
router.post('/ajouterQuizz', [validateQuizzType, verifyAuthorisation, verifyTokenBlacklist], ajouterQuizz);
router.post('ajouterQuestionAuQuizz', [validateField("quizz"), validateQuestionType, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(quizzConfig, "quizz")], ajouterQuestionAuQuizz);
router.post('ajouterReponseAQuestion', [validateField("question"), validateReponseQuizzType, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(responseConfig, "question")], ajouterReponseAQuestion);

router.delete('/deleteQuizz', [validateField("quizz"), verifyAuthorisation, verifyTokenBlacklist, verifyOwner(quizzConfig, "quizz")], deleteQuizz);
router.delete('/deleteQuestion', [validateField("question"), verifyAuthorisation, verifyTokenBlacklist, verifyOwner(questionConfig, "question")], deleteQuestion);
router.delete('/deleteReponse', [validateField("reponse"), verifyAuthorisation, verifyTokenBlacklist, verifyOwner(responseForDelConfig, "reponse")], deleteReponse);

router.put('/updateQuizz', [validateField("quizz"),verifyAuthorisation, verifyTokenBlacklist, verifyOwner(quizzConfig, "quizz")], updateQuizz);
router.put('/updateQuestion', [validateField("question"), verifyAuthorisation, verifyTokenBlacklist, verifyOwner(questionConfig, "question")], updateQuestion);
router.put('/updateReponse', [validateField("reponse"), verifyAuthorisation, verifyTokenBlacklist, verifyOwner(responseConfig, "reponse")], updateReponse);

module.exports = router;