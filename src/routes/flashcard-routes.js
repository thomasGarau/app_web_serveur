const express = require('express');
const router = express.Router();
const { verifyTokenBlacklist, verifyAuthorisation, verifyOwner } = require('../middlewares/verifyAuthorisation.js');
const { validateField, handleValidationErrors, validateObjectSchema } = require('../middlewares/sanitizeInput.js');

const {flashcardConfig} = require('../middlewares/objectConfig.js');
const {flashcardSchema, updateFlashcardSchema } = require('../models_JSON/flashcardValidation.js');
const {allFlashcard, userFlashcard, dailyFlashcard, flashcardContent, createFlashcard, updateFlashcard, deleteFlashcard} = require('../controllers/flashcard-controller');

router.post('/all-flashcards', [validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], allFlashcard);
router.post('/user-flashcards', [validateField('id_chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], userFlashcard);
router.post('/daily-flashcards', [verifyAuthorisation, verifyTokenBlacklist], dailyFlashcard);
router.post('/flashcard-content', [validateField('id_flashcard'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], flashcardContent);

router.post('/create-flashcard', [validateObjectSchema(flashcardSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], createFlashcard);
router.put('/update-flashcard', [validateObjectSchema(updateFlashcardSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(flashcardConfig, "flashcard")], updateFlashcard);
router.delete('/delete-flashcard', [validateField('id_flashcard'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(flashcardConfig, "flashcard")], deleteFlashcard);

module.exports = router;