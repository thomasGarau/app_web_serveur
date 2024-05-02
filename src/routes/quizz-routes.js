const express = require('express')
const router = express.Router()
const {
    listQuizzCreer,
    listQuizzPasser,
    getQuizzInfo,
    getNoteQuizzInfo,
    getQuizzForUe,
    getQuizzForChapter,
    getMeilleureNoteUtilisateurPourQuizz,
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
    ajouterReponseAQuestion,
    deleteQuestion,
    deleteReponse,
    updateQuizz,
    updateQuestion,
    updateReponse
} = require('../controllers/quizz-controller.js');
const {quizzConfig} = require('../middlewares/objectConfig.js');
const {questionConfig} = require('../middlewares/objectConfig.js');
const {responseConfig} = require('../middlewares/objectConfig.js');
const {responseForDelConfig} = require('../middlewares/objectConfig.js');
const {noteQuizzConfig} = require('../middlewares/objectConfig.js');
const {verifyAuthorisation, verifyTokenBlacklist, verifyOwner} = require('../middlewares/verifyAuthorisation.js');
const { validateField } = require('../middlewares/sanitizeInput.js');
const { quizzValidation } = require('../middlewares/sanitizeInput.js');
const { validateQuizzType, validateReponseQuizzType, validateQuestionType, validateQuestionUpdateType, validateQuizzUpdateType, validateReponseUpdateType  } = quizzValidation;

router.get('/listQuizzCreer', [verifyAuthorisation, verifyTokenBlacklist], listQuizzCreer);
router.get('/listQuizzPasser', [verifyAuthorisation, verifyTokenBlacklist], listQuizzPasser);

router.post('/getNoteQuizzInfo', [validateField("note_quizz"), verifyAuthorisation, verifyTokenBlacklist, verifyOwner(noteQuizzConfig, "note_quizz")], getNoteQuizzInfo);
router.post('/getQuizzInfo', [validateField("quizz"), verifyAuthorisation, verifyTokenBlacklist], getQuizzInfo);
router.post('/quizzForUe', [validateField("ue"), verifyAuthorisation, verifyTokenBlacklist], getQuizzForUe);
router.post('/quizzForChapter', [validateField("chapitre"), verifyAuthorisation, verifyTokenBlacklist], getQuizzForChapter);
router.post('/meilleureNoteUtilisateurPourQuizz', [validateField("quizz"), verifyAuthorisation, verifyTokenBlacklist], getMeilleureNoteUtilisateurPourQuizz);
router.post('/noteMoyennePourQuizz', [validateField("quizz"), verifyAuthorisation, verifyTokenBlacklist], getNoteMoyennePourQuizz);
router.post('/questionsPourQuizz', [validateField("quizz"), verifyAuthorisation, verifyTokenBlacklist], getQuestionsPourQuizz);
router.post('/reponsesPourQuestion', [validateField("question"), verifyAuthorisation, verifyTokenBlacklist], getReponsesPourQuestion);
router.post('/reponsesUtilisateurPourQuestion', [validateField("question", "quizz"), verifyAuthorisation, verifyTokenBlacklist], getReponsesUtilisateurPourQuestion);
router.post('/resultatUtilisateurQuizz', [validateField("note_quizz"), verifyAuthorisation, verifyTokenBlacklist], getResultatUtilisateurQuizz);
router.post('/annotationsPourQuestion', [validateField("question"), verifyAuthorisation, verifyTokenBlacklist], getAnnotationsPourQuestion);

router.post('/ajouterNoteUtilisateurPourQuizz', [validateField("quizz", "note"), verifyAuthorisation, verifyTokenBlacklist], ajouterNoteUtilisateurPourQuizz);
router.post('/ajouterNoteUtilisateurAuQuizz', [validateField("quizz", "note")] , ajouterNoteUtilisateurAuQuizz);
router.post('/ajouterReponseUtilisateurAuQuizz', [validateReponseQuizzType,  verifyAuthorisation, verifyTokenBlacklist], ajouterReponseUtilisateurAuQuizz);
router.post('/ajouterQuizz', [validateQuizzType, verifyAuthorisation, verifyTokenBlacklist], ajouterQuizz);
router.post('/ajouterQuestionAuQuizz', [validateField("quizz"), validateQuestionType, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(quizzConfig, "quizz")], ajouterQuestionAuQuizz);

router.delete('/deleteQuizz', [validateField("quizz"), verifyAuthorisation, verifyTokenBlacklist, verifyOwner(quizzConfig, "quizz")], deleteQuizz);
router.delete('/deleteQuestion', [validateField("question"), verifyAuthorisation, verifyTokenBlacklist, verifyOwner(questionConfig, "question")], deleteQuestion);

router.put('/updateQuizz', [validateField("quizz"), validateQuizzUpdateType,  verifyAuthorisation, verifyTokenBlacklist, verifyOwner(quizzConfig, "quizz")], updateQuizz);
router.put('/updateQuestion', [validateField("question"), validateQuestionUpdateType, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(questionConfig, "question")], updateQuestion);

module.exports = router;