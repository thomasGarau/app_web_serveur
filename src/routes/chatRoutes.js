const express = require('express');
const { verifyTokenBlacklist, verifyAuthorisation } = require('../middlewares/verifyAuthorisation');
const { handleValidationErrors, validateField } = require('../middlewares/sanitizeInput');
const router = express.Router();
const { verifyOwnerOrAdmin } = require('../middlewares/verifyAuthorisation');
const { forumListCours,forumListQuizz,messageList,messageListQuizz,messageListCours,messageListCoursChapitre, addMessage, updateMessage, deleteMessage,forumListChapitre,forumList,addForum,updateForum,deleteForum } = require('../controllers/chat-controllers');


router.post('/chat-quizz', [validateField('id_quizz'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], messageListQuizz);
router.post('/chat-cours', [validateField('id_cours'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], messageListCours);
router.post('/chat-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_chapitre')], messageListCoursChapitre);

// router.get('/chat', [verifyAuthorisation, verifyTokenBlacklist,validate], messageList);
router.post('/add-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('contenu','id_forum','heure'), handleValidationErrors], addMessage);
router.post('/update-message', [verifyAuthorisation, verifyTokenBlacklist,validateField('id_message','contenu','heure','id_forum'), handleValidationErrors,  verifyOwnerOrAdmin], updateMessage);
router.post('/delete-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_message'), handleValidationErrors ,verifyOwnerOrAdmin], deleteMessage);
router.post('/forum-cours', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_chapitre'), handleValidationErrors], forumListCours);
router.get('/forum-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist], forumListChapitre);
router.post('/forum-quizz', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_quizz'), handleValidationErrors], forumListQuizz);
router.post('/forum', [verifyAuthorisation, verifyTokenBlacklist,validateField('id_forum'), handleValidationErrors], forumList);

router.post('/add-forum', [verifyAuthorisation, verifyTokenBlacklist, validateField('label','etat','id_utilisateur'), handleValidationErrors], addForum);
router.post('/update-forum', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_forum','label','etat','id_utilisateur'), handleValidationErrors, verifyOwnerOrAdmin], updateForum);
router.post('/delete-forum', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_forum'), handleValidationErrors, verifyOwnerOrAdmin], deleteForum);


module.exports = router;