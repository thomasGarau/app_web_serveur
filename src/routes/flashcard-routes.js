const express = require('express');
const router = express.Router();
const { verifyTokenBlacklist, verifyAuthorisation, verifyOwner, verifyVisibility } = require('../middlewares/verifyAuthorisation.js');
const { validateField, handleValidationErrors, validateObjectSchema } = require('../middlewares/sanitizeInput.js');

const {flashcardConfig, flashcardVisibilityConfig} = require('../middlewares/objectConfig.js');
const {flashcardSchema, updateFlashcardSchema } = require('../models_JSON/flashcardValidation.js');
const {allFlashcard, userFlashcard, dailyFlashcard, flashcardAnswer, addToCollection, removeFromCollection, createFlashcard, updateFlashcard, deleteFlashcard} = require('../controllers/flashcard-controller');

router.post('/all-flashcards', [validateField('chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], allFlashcard);
router.post('/user-flashcards', [validateField('chapitre'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], userFlashcard);
router.post('/daily-flashcards', [verifyAuthorisation, verifyTokenBlacklist], dailyFlashcard);

router.post('/flashcard-answer', [validateField('flashcard', 'answer'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], flashcardAnswer);

router.post('/add-flashcard-to-collection', [validateField('flashcard'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyVisibility(flashcardVisibilityConfig, "flashcard")], addToCollection);
router.delete('/remove-flashcard-from-collection', [validateField('flashcard'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], removeFromCollection);

router.post('/create-flashcard', [validateObjectSchema(flashcardSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist], createFlashcard);
router.put('/update-flashcard', [validateObjectSchema(updateFlashcardSchema), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(flashcardConfig, "flashcard")], updateFlashcard);
router.delete('/delete-flashcard', [validateField('flashcard'), handleValidationErrors, verifyAuthorisation, verifyTokenBlacklist, verifyOwner(flashcardConfig, "flashcard")], deleteFlashcard);

module.exports = router;