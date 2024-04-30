const express = require('express');
const { verifyTokenBlacklist, verifyAuthorisation } = require('../middlewares/verifyAuthorisation');
const { validate, validateField } = require('../middlewares/sanitizeInput');
const router = express.Router();
const { verifyOwnerOrAdmin } = require('../middlewares/verifyAuthorisation');
const { forumListCours,forumListQuizz,messageList,messageListQuizz,messageListCours,messageListCoursChapitre, addMessage, updateMessage, deleteMessage } = require('../controllers/chat-controllers');


router.get('/chat-quizz', [verifyAuthorisation, verifyTokenBlacklist,validate], messageListQuizz);
router.get('/chat-cours', [verifyAuthorisation, verifyTokenBlacklist,validate], messageListCours);
router.get('/chat-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_chapitre'),validate], messageListCoursChapitre);
router.get('/chat', [verifyAuthorisation, verifyTokenBlacklist,validate], messageList);
router.post('/add-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('contenu','date','id_forum') ,validate], addMessage);
router.post('/update-message', [verifyAuthorisation, verifyTokenBlacklist,validateField('id_message','contenu','date','id_forum','token'),validate, verifyOwnerOrAdmin], updateMessage);
router.post('/delete-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_message','token'),validate,verifyOwnerOrAdmin], deleteMessage);
router.post('/forum-cours', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_cours'),validate], forumListCours);
router.post('/forum-quizz', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_quizz'),validate], forumListQuizz);


module.exports = router;