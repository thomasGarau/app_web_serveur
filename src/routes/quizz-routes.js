const express = require('express')
const router = express.Router()
const {
    getQuizzForUe,
    getMeilleureNoteUtilisateurPourQuizz,
    ajouterNoteUtilisateurPourQuizz,
    ajouterNoteUtilisateurAuQuizz,
    getNoteMoyennePourQuizz,
    getAnnotationsPourQuestion,
    getQuestionsPourQuizz,
    getReponsesPourQuestion,
    getReponsesUtilisateurPourQuestion
} = require('../controllers/quizz-controller.js');
const {verifyAuthorisation, verifyTokenBlacklist} = require('../middlewares/verifyAuthorisation.js');
const { validateField } = require('../middlewares/sanitizeInput.js');

router.get('/quizzForUe', [validateField("ue"), verifyTokenBlacklist, verifyAuthorisation], getQuizzForUe);
router.get('/meilleureNoteUtilisateurPourQuizz', [validateField("quizz", "utilisateur"), verifyTokenBlacklist, verifyAuthorisation], getMeilleureNoteUtilisateurPourQuizz);
router.post('/ajouterNoteUtilisateurPourQuizz', [validateField("quizz", "utilisateur", "note"), verifyTokenBlacklist, verifyAuthorisation], ajouterNoteUtilisateurPourQuizz);
router.post('/ajouterNoteUtilisateurAuQuizz', [validateField("quizz", "utilisateur", "note"), verifyTokenBlacklist, verifyAuthorisation], ajouterNoteUtilisateurAuQuizz);
router.get('/noteMoyennePourQuizz', [validateField("quizz"), verifyTokenBlacklist, verifyAuthorisation], getNoteMoyennePourQuizz);

router.get('/questionsPourQuizz', [validateField("quizz"), verifyTokenBlacklist, verifyAuthorisation], getQuestionsPourQuizz);
router.get('/reponsesPourQuestion', [validateField("question"), verifyTokenBlacklist, verifyAuthorisation], getReponsesPourQuestion);
router.get('/reponsesUtilisateurPourQuestion', [validateField("question", "utilisateur", "quizz"), verifyTokenBlacklist, verifyAuthorisation], getReponsesUtilisateurPourQuestion);
router.get('/annotationsPourQuestion', [validateField("question", "quizz"), verifyTokenBlacklist, verifyAuthorisation], getAnnotationsPourQuestion);


module.exports = router;