const express = require('express');
const { verifyTokenBlacklist, verifyAuthorisation } = require('../middlewares/verifyAuthorisation');
const { handleValidationErrors, validateField,exceptionField } = require('../middlewares/sanitizeInput');
const router = express.Router();
const { forumConfig,messageConfig } = require('../middlewares/objectConfig');
const { verifyOwnerOrAdmin, verifyOwner } = require('../middlewares/verifyAuthorisation');
const { forumListCours,forumListQuizz,messageList,messageListQuizz,messageListCours,messageListCoursChapitre, addMessage, updateMessage, deleteMessage,forumListChapitre,forumList,addForumCours,addForumQuizz,updateForum,deleteForum,forumClose,forumOpen } = require('../controllers/chat-controllers');


router.post('/chat-quizz', [validateField('id_quizz'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], messageListQuizz);
router.post('/chat-cours', [validateField('id_cours'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], messageListCours);
router.post('/chat-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_chapitre')], messageListCoursChapitre);

// router.get('/chat', [verifyAuthorisation, verifyTokenBlacklist,validate], messageList);
router.post('/add-message', [verifyAuthorisation, verifyTokenBlacklist,exceptionField('contenu'), validateField('id_forum'), handleValidationErrors], addMessage);
router.post('/update-message', [verifyAuthorisation, verifyTokenBlacklist,exceptionField('contenu'),validateField('id_message','id_forum'), handleValidationErrors,  verifyOwner(messageConfig,"id_message")], updateMessage);
router.post('/delete-message', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_message'), handleValidationErrors ,verifyOwnerOrAdmin(messageConfig,"id_message")], deleteMessage);
router.post('/forum-cours', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_chapitre'), handleValidationErrors], forumListCours);
router.get('/forum-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist], forumListChapitre);
router.post('/forum-quizz', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_quizz'), handleValidationErrors], forumListQuizz);
router.post('/forum', [verifyAuthorisation, verifyTokenBlacklist,validateField('id_forum'), handleValidationErrors], forumList);
router.post('/forum-close', [verifyAuthorisation, verifyTokenBlacklist,validateField('id_forum'), handleValidationErrors, verifyOwnerOrAdmin(forumConfig,"id_forum")], forumClose);
router.post('/forum-open', [verifyAuthorisation, verifyTokenBlacklist,validateField('id_forum'), handleValidationErrors, verifyOwnerOrAdmin(forumConfig,"id_forum")], forumOpen);

router.post('/add-forum-cours', [verifyAuthorisation, verifyTokenBlacklist,exceptionField('contenu'), validateField('label','id_cours'), handleValidationErrors], addForumCours);
router.post('/add-forum-quizz', [verifyAuthorisation, verifyTokenBlacklist,exceptionField('contenu'), validateField('label','id_quizz'), handleValidationErrors], addForumQuizz);
router.post('/update-forum', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_forum','label','etat'), handleValidationErrors, verifyOwnerOrAdmin(forumConfig,"id_forum")], updateForum);
router.post('/delete-forum', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_forum'), handleValidationErrors, verifyOwnerOrAdmin(forumConfig,"id_forum")], deleteForum);


module.exports = router;