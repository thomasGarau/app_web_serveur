const express = require('express');
const { verifyTokenBlacklist, verifyAuthorisation } = require('../middlewares/verifyAuthorisation');
const { handleValidationErrors, validateField } = require('../middlewares/sanitizeInput');
const router = express.Router();
const { verifyOwnerOrAdmin } = require('../middlewares/verifyAuthorisation');
const { forumListCours,forumListQuizz,messageList,messageListQuizz,messageListCours,messageListCoursChapitre, addMessage, updateMessage, deleteMessage } = require('../controllers/chat-controllers');


router.post('/chat-quizz', [validateField('id_forum'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], messageListQuizz);
router.post('/chat-cours', [validateField('id_forum'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], messageListCours);
// router.post('/chat-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_chapitre'),validate], messageListCoursChapitre);
// router.get('/chat', [verifyAuthorisation, verifyTokenBlacklist,validate], messageList);
router.post('/add-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('contenu','date','id_forum'), handleValidationErrors], addMessage);
router.post('/update-message', [verifyAuthorisation, verifyTokenBlacklist,validateField('id_message','contenu','date','id_forum'), handleValidationErrors,  verifyOwnerOrAdmin], updateMessage);
router.post('/delete-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_message'), handleValidationErrors ,verifyOwnerOrAdmin], deleteMessage);
router.post('/forum-cours', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_cours'), handleValidationErrors], forumListCours);
router.post('/forum-quizz', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_quizz'), handleValidationErrors], forumListQuizz);


module.exports = router;