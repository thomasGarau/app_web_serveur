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
    deleteQuizz
} = require('../controllers/quizz-controller.js');
const {quizzConfig} = require('../middlewares/objectConfig.js');
const {verifyAuthorisation, verifyTokenBlacklist, verifyOwner} = require('../middlewares/verifyAuthorisation.js');
const { validateField, validateQuizzType, validateReponseQuizzType } = require('../middlewares/sanitizeInput.js');

router.get('/quizzForUe', [validateField("ue"), verifyTokenBlacklist, verifyAuthorisation], getQuizzForUe);
router.get('/meilleureNoteUtilisateurPourQuizz', [validateField("quizz"), verifyTokenBlacklist, verifyAuthorisation], getMeilleureNoteUtilisateurPourQuizz);
router.get('/noteMoyennePourQuizz', [validateField("quizz"), verifyTokenBlacklist, verifyAuthorisation], getNoteMoyennePourQuizz);

router.get('/questionsPourQuizz', [validateField("quizz"), verifyTokenBlacklist, verifyAuthorisation], getQuestionsPourQuizz);
router.get('/reponsesPourQuestion', [validateField("question"), verifyTokenBlacklist, verifyAuthorisation], getReponsesPourQuestion);
router.get('/reponsesUtilisateurPourQuestion', [validateField("question", "quizz"), verifyTokenBlacklist, verifyAuthorisation], getReponsesUtilisateurPourQuestion);
router.get('/resultatUtilisateurQuizz', [validateField("note_quizz"), verifyTokenBlacklist, verifyAuthorisation], getResultatUtilisateurQuizz);
router.get('/annotationsPourQuestion', [validateField("question", "quizz"), verifyTokenBlacklist, verifyAuthorisation], getAnnotationsPourQuestion);

router.post('/ajouterNoteUtilisateurPourQuizz', [validateField("quizz", "note"), verifyTokenBlacklist, verifyAuthorisation], ajouterNoteUtilisateurPourQuizz);

router.post('/ajouterReponseUtilisateurAuQuizz', [validateField("quizz"), validateReponseQuizzType,  verifyTokenBlacklist, verifyAuthorisation], ajouterReponseUtilisateurAuQuizz);
router.post('/ajouterQuizz', [validateQuizzType, verifyTokenBlacklist, verifyAuthorisation], ajouterQuizz);

router.post('ajouterQuestionAuQuizz')
router.post('ajouterReponseAQuestion')

router.delete('/deleteQuizz', [validateField("quizz"), verifyOwner(quizzConfig, "quizz"), verifyTokenBlacklist, verifyAuthorisation], deleteQuizz);
router.delete('/deleteQuestion')
router.delete('/deleteReponse')

router.put('/updateQuizz')
router.put('/updateQuestion')
router.put('/updateReponse')

module.exports = router;