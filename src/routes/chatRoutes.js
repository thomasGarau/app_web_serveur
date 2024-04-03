const express = require('express');
const { verifyTokenBlacklist } = require('../middlewares/verifyAuthorisation');
const { validate, validateField } = require('../middlewares/sanitizeInput');
const router = express.Router();
const { forumListCours,forumListQuizz,messageList,messageListQuizz,messageListCours,messageListCoursChapitre, addMessage, updateMessage, deleteMessage } = require('../controllers/chat-controllers');


router.get('/chat-quizz', [verifyTokenBlacklist,validate], messageListQuizz);
router.get('/chat-cours', [verifyTokenBlacklist,validate], messageListCours);
router.get('/chat-cours-chapitre', [verifyTokenBlacklist, validateField('id_chapitre'),validate], messageListCoursChapitre);
router.get('/chat', [verifyTokenBlacklist,validate], messageList);
router.post('/add-message', [verifyTokenBlacklist, validateField('id_message','contenu','date','id_forum','id_utilisateur') ,validate], addMessage);
router.post('/update-message', [verifyTokenBlacklist,validateField('id_message','contenu','date','id_forum','id_utilisateur'),validate], updateMessage);
router.post('/delete-message', [verifyTokenBlacklist, validateField('id_message'),validate], deleteMessage);
router.get('/forum-cours', [verifyTokenBlacklist, validateField('id_cours'),validate], forumListCours);
router.get('/forum-quizz', [verifyTokenBlacklist, validateField('id_quizz'),validate], forumListQuizz);


module.exports = router;