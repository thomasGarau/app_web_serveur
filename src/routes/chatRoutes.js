const express = require('express');
const { verifyTokenBlacklist, verifyAuthorisation } = require('../middlewares/verifyAuthorisation');
const { validate, validateField } = require('../middlewares/sanitizeInput');
const router = express.Router();
const { forumListCours,forumListQuizz,messageList,messageListQuizz,messageListCours,messageListCoursChapitre, addMessage, updateMessage, deleteMessage } = require('../controllers/chat-controllers');


router.get('/chat-quizz', [verifyAuthorisation, verifyTokenBlacklist,validate], messageListQuizz);
router.get('/chat-cours', [verifyAuthorisation, verifyTokenBlacklist,validate], messageListCours);
router.get('/chat-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_chapitre'),validate], messageListCoursChapitre);
router.get('/chat', [verifyAuthorisation, verifyTokenBlacklist,validate], messageList);
router.post('/add-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('contenu','date','id_forum') ,validate], addMessage);
router.post('/update-message', [verifyAuthorisation, verifyTokenBlacklist,validateField('id_message','contenu','date','id_forum','token'),validate], updateMessage);
router.post('/delete-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_message','token'),validate], deleteMessage);
router.get('/forum-cours', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_cours'),validate], forumListCours);
router.get('/forum-quizz', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_quizz'),validate], forumListQuizz);


module.exports = router;