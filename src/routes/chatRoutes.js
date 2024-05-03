const express = require('express');
const { verifyTokenBlacklist, verifyAuthorisation } = require('../middlewares/verifyAuthorisation');
const { validate, validateField } = require('../middlewares/sanitizeInput');
const router = express.Router();
const { verifyOwnerOrAdmin } = require('../middlewares/verifyAuthorisation');
const { forumListCours,forumListQuizz,messageList,messageListQuizz,messageListCours,messageListCoursChapitre, addMessage, updateMessage, deleteMessage } = require('../controllers/chat-controllers');


router.post('/chat-quizz', [validateField('id_quizz'),verifyAuthorisation, verifyTokenBlacklist,validate], messageListQuizz);
router.post('/chat-cours', [validateField('id_cours'),verifyAuthorisation, verifyTokenBlacklist,validate], messageListCours);
router.post('/chat-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_chapitre'),validate], messageListCoursChapitre);
// router.get('/chat', [verifyAuthorisation, verifyTokenBlacklist,validate], messageList);
router.post('/add-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('contenu','date','id_forum')], addMessage);
router.post('/update-message', [verifyAuthorisation, verifyTokenBlacklist,validateField('id_message','contenu','date','id_forum'), verifyOwnerOrAdmin], updateMessage);
router.post('/delete-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_message'),validate,verifyOwnerOrAdmin], deleteMessage);
router.post('/forum-cours', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_cours')], forumListCours);
router.post('/forum-quizz', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_quizz')], forumListQuizz);


module.exports = router;