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
    ajouterNoteUtilisateurAuQuizz,
    ajouterReponseUtilisateurAuQuizz,
    ajouterQuizz
} = require('../controllers/quizz-controller.js');
const {verifyAuthorisation, verifyTokenBlacklist} = require('../middlewares/verifyAuthorisation.js');
const { validateField, validateQuizzType, validateReponseQuizzType } = require('../middlewares/sanitizeInput.js');

router.get('/quizzForUe', [validateField("ue"), verifyTokenBlacklist, verifyAuthorisation], getQuizzForUe);
router.get('/meilleureNoteUtilisateurPourQuizz', [validateField("quizz", "utilisateur"), verifyTokenBlacklist, verifyAuthorisation], getMeilleureNoteUtilisateurPourQuizz);
router.get('/noteMoyennePourQuizz', [validateField("quizz"), verifyTokenBlacklist, verifyAuthorisation], getNoteMoyennePourQuizz);

router.get('/questionsPourQuizz', [validateField("quizz"), verifyTokenBlacklist, verifyAuthorisation], getQuestionsPourQuizz);
router.get('/reponsesPourQuestion', [validateField("question"), verifyTokenBlacklist, verifyAuthorisation], getReponsesPourQuestion);
router.get('/reponsesUtilisateurPourQuestion', [validateField("question", "utilisateur", "quizz"), verifyTokenBlacklist, verifyAuthorisation], getReponsesUtilisateurPourQuestion);
router.get('/resultatUtilisateurQuizz', [validateField("note_quizz"), verifyTokenBlacklist, verifyAuthorisation], getResultatUtilisateurQuizz);
router.get('/annotationsPourQuestion', [validateField("question", "quizz"), verifyTokenBlacklist, verifyAuthorisation], getAnnotationsPourQuestion);

router.post('/ajouterNoteUtilisateurPourQuizz', [validateField("quizz", "utilisateur", "note"), verifyTokenBlacklist, verifyAuthorisation], ajouterNoteUtilisateurPourQuizz);
router.post('/ajouterNoteUtilisateurAuQuizz', [validateField("quizz", "utilisateur", "note"), verifyTokenBlacklist, verifyAuthorisation], ajouterNoteUtilisateurAuQuizz);

router.post('/ajouterReponseUtilisateurAuQuizz', [validateField("quizz", "utilisateur"), validateReponseQuizzType,  verifyTokenBlacklist, verifyAuthorisation], ajouterReponseUtilisateurAuQuizz);
router.post('/ajouterQuizz', [validateField("label", "ue"), validateQuizzType, verifyTokenBlacklist, verifyAuthorisation], ajouterQuizz);

module.exports = router;