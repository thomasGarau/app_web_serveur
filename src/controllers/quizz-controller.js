const quizzService = require('../services/quizz-service');

exports.getQuizzForUe = async (req, res) => {
    try {
        const ue = req.body.ue;

        const quizzProfesseurs = await quizzService.getQuizzProfesseurForUe(ue);
        const quizzEleves = await quizzService.getQuizzEleveForUe(ue);

        if (quizzProfesseurs.length > 0 || quizzEleves.length > 0) {
            res.status(200).send({
                listQuizzCreesParLesProfesseurs: quizzProfesseurs,
                listQuizzCreesParLesEleves: quizzEleves
            });
        } else {
            throw new Error('Aucun quizz trouvé pour cette UE');
        }
    } catch (error) {
        console.error(error);
        res.status(401).send(error.message);
    }
};

exports.getMeilleureNoteUtilisateurPourQuizz = async (req, res) => {
    try {
        const { quizz, utilisateur } = req.body;

        const meilleureNote = await quizzService.getNoteUtilisateurQuizz(quizz, utilisateur);

        if (meilleureNote !== null) {
            res.status(200).send({ meilleureNote });
        } else {
            res.status(404).send('Aucune note trouvée pour cet utilisateur et ce quizz.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.ajouterNoteUtilisateurPourQuizz = async (req, res) => {
    try {
        const { quizz, utilisateur, note } = req.body;
        const date = new Date();

        await quizzService.addNoteUtilisateurQuizz(quizz, utilisateur, note, date);

        res.status(201).send('Note ajoutée avec succès.');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.ajouterNoteUtilisateurAuQuizz = async (req, res) => {
    try {
        const { quizz, utilisateur, note } = req.body;
        const date = new Date();

        await quizzService.addNoteUtilisateurAuQuizz(quizz, utilisateur, note, date);

        res.status(201).send('Note ajoutée avec succès.');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


exports.getNoteMoyennePourQuizz = async (req, res) => {
    try {
        const { quizz } = req.body

        const noteMoyenne = await quizzService.getNoteMoyenneQuiz(quizz);

        if (noteMoyenne !== null) {
            res.status(200).send({ noteMoyenne });
        } else {
            res.status(404).send('Aucune note trouvée pour ce quizz.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


exports.getQuestionsPourQuizz = async (req, res) => {
    const { quizz } = req.body;
    try {
        const questions = await quizzService.getQuestionsPourQuizz(quizz);
        res.status(200).send(questions);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.getReponsesPourQuestion = async (req, res) => {
    const { question } = req.body;
    try {
        const reponses = await quizzService.getReponsesPourQuestion(question);
        res.status(200).send(reponses);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.getReponsesUtilisateurPourQuestion = async (req, res) => {
    const { question, utilisateur, quizz } = req.body;
    try {
        const reponsesUtilisateur = await quizzService.getReponsesUtilisateurPourQuestion(question, utilisateur, quizz);
        res.status(200).send(reponsesUtilisateur);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.getAnnotationsPourQuestion = async (req, res) => {
    const { question, quizz } = req.body;
    try {
        const annotations = await quizzService.getAnnotationsPourQuestion(question, quizz);
        res.status(200).send(annotations);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};
