const flashcardService = require('../services/flashcard-services');
const {getIdUtilisateurFromToken} = require('../services/user-service');
const OwnFlashcardError = require('../constants/errors');

exports.allFlashcard = async (req,res) => {
    try{
        const chapitre = req.body.chapitre;
        const flashcards = await flashcardService.allFlashcard(chapitre);
        res.status(200).send(flashcards);
    }catch(err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des flashcards');
    }
};

exports.userFlashcard = async (req,res) => {
    try{
        const chapitre = req.body.chapitre;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const flashcards = await flashcardService.userFlashcard(utilisateur, chapitre);
        res.status(200).send(flashcards);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la récupération des flashcards');
    }
};

exports.dailyFlashcard = async (req,res) => {
    try{
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const flashcards = await flashcardService.dailyFlashcard(utilisateur);
        res.status(200).send(flashcards);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la récupération des flashcards');
    }
};

exports.flashcardAnswer = async (req,res) => {
    try{
        const {flashcard, answer} = req.body;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const date = new Date();
        const response = await flashcardService.flashcardAnswer(utilisateur, flashcard, date, answer);
        res.status(200).send(response);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la récupération de la réponse de la flashcard');
    }
};

exports.addToCollection = async (req, res) => {
    try {
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const flashcard = req.body.flashcard;

        await flashcardService.addToCollection(utilisateur, flashcard);
        res.status(200).send("Flashcard ajoutée à la collection");
    } catch (err) {
        if (err instanceof OwnFlashcardError) {
            return res.status(err.status).send({ message: err.message });
        }

        console.error('Erreur dans addToCollection Controller :', err);
        res.status(500).send({ message: 'Echec de l\'ajout de la flashcard à la collection' });
    }
};

exports.removeFromCollection = async (req,res) => {
    try{
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const flashcard = req.body.flashcard;
        await flashcardService.removeFromCollection(utilisateur, flashcard);
        res.status(200).send("Flashcard retirée de la collection");
    }catch(err){
        console.error(err);
        res.status(500).send('Echec du retrait de la flashcard de la collection');
    }
};

exports.createFlashcard = async (req,res) => {
    try{
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const {chapitre, question, reponse, visibilite} = req.body;
        const flashcard = {chapitre, question, reponse, visibilite};
        await flashcardService.createFlashcard(utilisateur, flashcard);
        res.status(200).send("Flashcard créée");
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la création de la flashcard');
    }
};

exports.updateFlashcard = async (req,res) => {
    try{
        const {flashcard, question, reponse} = req.body;
        const flashcardData = {flashcard, question, reponse};
        await flashcardService.updateFlashcard(flashcardData);
        res.status(200).send("Flashcard mise à jour");
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la mise à jour de la flashcard');
    }
};

exports.deleteFlashcard = async (req,res) => {
    try{
        const flashcard = req.body.flashcard;
        await flashcardService.deleteFlashcard(flashcard);
        res.status(200).send('Flashcard supprimée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la suppression de la flashcard');
    }
};

exports.GenerateDailyFlashcard = async (req,res) => {
    try{
        await flashcardService.GenerateDailyFlashcard();
        res.status(200).send('Flashcards générées');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la génération des flashcards');
    }
}