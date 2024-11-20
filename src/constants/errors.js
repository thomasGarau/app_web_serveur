class OwnFlashcardError extends Error {
    constructor(message = 'Vous ne pouvez pas ajouter votre propre flashcard à votre collection.', status = 400) {
        super(message);
        this.code = 'USER_OWN_FLASHCARD';
        this.status = status; // Code HTTP, 400 par défaut pour une erreur utilisateur
    }
}

module.exports = OwnFlashcardError;