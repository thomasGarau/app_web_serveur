const express = require('express');
const router = express.Router();
const { verifyTokenBlacklist, verifyAuthorisation } = require('../middlewares/verifyAuthorisation');
const { handleValidationErrors, validateField,exceptionField } = require('../middlewares/sanitizeInput');
const { forumConfig, messageConfig } = require('../middlewares/objectConfig');
const { verifyOwnerOrAdmin, verifyOwner } = require('../middlewares/verifyAuthorisation');
const { forumListCours, forumListQuizz, messageListQuizz, messageListCours, messageListCoursChapitre, addMessage, updateMessage, deleteMessage, forumListChapitre, forumList, addForumCours, addForumQuizz, updateForum, deleteForum, forumClose, forumOpen } = require('../controllers/chat-controllers');


router.post('/chat-quizz', [validateField('id_quizz'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], messageListQuizz);
router.post('/chat-cours', [validateField('id_cours'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], messageListCours);
router.post('/chat-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist, validateField('id_chapitre')], messageListCoursChapitre);

router.post('/add-message', [exceptionField('contenu'), validateField('id_forum'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], addMessage);
router.post('/update-message', [exceptionField('contenu'),validateField('id_message','id_forum'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(messageConfig,"id_message")], updateMessage);
router.post('/delete-message', [ validateField('id_message'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwnerOrAdmin(messageConfig,"id_message")], deleteMessage);

router.post('/forum-cours', [ validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], forumListCours);
router.get('/forum-cours-chapitre', [verifyAuthorisation, verifyTokenBlacklist], forumListChapitre);
router.post('/forum-quizz', [validateField('id_quizz'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], forumListQuizz);
router.post('/forum', [validateField('id_forum'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], forumList);
router.post('/forum-close', [validateField('id_forum'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwnerOrAdmin(forumConfig,"id_forum")], forumClose);
router.post('/forum-open', [validateField('id_forum'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwnerOrAdmin(forumConfig,"id_forum")], forumOpen);

router.post('/add-forum-cours', [exceptionField('contenu', 'label'), validateField('id_cours'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], addForumCours);
router.post('/add-forum-quizz', [exceptionField('contenu', 'label'), validateField('id_quizz'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], addForumQuizz);
router.post('/update-forum', [exceptionField('label'), validateField('id_forum', 'etat'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwnerOrAdmin(forumConfig,"id_forum")], updateForum);
router.post('/delete-forum', [validateField('id_forum'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwnerOrAdmin(forumConfig,"id_forum")], deleteForum);


module.exports = router;