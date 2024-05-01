const quizzService = require('../services/quizz-service');
const {getIdUtilisateurFromToken} = require('../services/user-service');

exports.getQuizzInfo = async (req, res) => {
    try{
        const quizz = req.body.quizz;
        const quizzInfo = await quizzService.getQuizzInfo(quizz);
        res.status(200).send(quizzInfo);
    }catch(error){
        console.error(error);
        res.status(500).send(error.message);
    }
};

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

exports.getQuizzForChapter = async (req, res) => {
    try{
        const chapitre = req.body.chapitre;
        const quizzProfesseurs = await quizzService.getQuizzProfesseurForChapitre(chapitre);
        const quizzEleves = await quizzService.getQuizzEleveForChapitre(chapitre);

        if(quizzProfesseurs.length > 0 || quizzEleves.length > 0){
            res.status(200).send([
                quizzProfesseurs,
                quizzEleves
            ]);
        }else{
            res.status(200).send([]);
        }
    }catch(error){
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.getMeilleureNoteUtilisateurPourQuizz = async (req, res) => {
    try {
        const { quizz } = req.body;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
       
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
    const { question, note_quizz } = req.body;
    const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);

    try {
        const reponsesUtilisateur = await quizzService.getReponsesUtilisateurPourQuestion(question, utilisateur, quizz);
        res.status(200).send(reponsesUtilisateur);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.getAnnotationsPourQuestion = async (req, res) => {
    const { question } = req.body;
    try {
        const annotations = await quizzService.getAnnotationsPourQuestion(question);
        res.status(200).send(annotations);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.getResultatUtilisateurQuizz = async (req, res) => {
    try {
        const { note_quizz } = req.body;
        const result = await quizzService.getResultatQuizz(note_quizz)
        return res.status(200).json({ resultat: result });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.ajouterNoteUtilisateurPourQuizz = async (req, res) => {
    try {
        const { quizz, note } = req.body;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);

        await quizzService.addNoteUtilisateurPourQuizz(quizz, utilisateur, note);

        res.status(201).send('Note ajoutée avec succès.');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.ajouterNoteUtilisateurAuQuizz = async (req, res) => {
    try{
        const { quizz, note } = req.body;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const date = new Date();
        await quizzService.addNoteUtilisateurAuQuizz(quizz, utilisateur, note, date);
        res.status(201).send('Note ajoutée avec succès.');
    }catch (error){
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.ajouterQuizz = async (req, res) => { 
    try {
        const { label, type, chapitre, questions } = req.body.data;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const quizz = await quizzService.createQuizz(label, type, chapitre, utilisateur, questions);
        return res.status(201).json({ message: "Quizz créé avec succès", quizz: quizz });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.ajouterQuestionAuQuizz = async (req, res) => {
    try {
        const { quizz, label, nombre_bonne_reponse, type, reponses } = req.body;
        const data = { label, nombre_bonne_reponse, type, reponses };
        const question = await quizzService.ajouterQuestionAuQuizz(quizz, data);
        return res.status(201).json({ message: "Question ajoutée avec succès", question: question });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.ajouterReponseAQuestion = async (req, res) => {
    try {
        const { question, data } = req.body;
        const reponse = await quizzService.ajouterReponseAQuestion(question, data);
        return res.status(201).json({ message: "Réponse ajoutée avec succès", reponse: reponse });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.ajouterReponseUtilisateurAuQuizz = async (req, res) => {
    try {
        const { quizz, data } = req.body;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const note_quizz = await quizzService.ajouterReponsesUtilisateurAuQuizz(quizz, utilisateur, data);
        const result = await quizzService.createResultatQuizz(quizz, note_quizz, data)
        return res.status(200).json({ message: "Réponses ajoutées avec succès", resultat: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteQuizz = async (req, res) => {
    try {
        const { quizz } = req.body;
        await quizzService.deleteQuizz(quizz);
        return res.status(200).json({ message: "Quizz supprimé avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        await quizzService.deleteQuestion(question);
        return res.status(200).json({ message: "Question supprimée avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteReponse = async (req, res) => {
    try {
        const { reponse } = req.body;
        await quizzService.deleteReponse(reponse);
        return res.status(200).json({ message: "Réponse supprimée avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updateQuizz = async (req, res) => {
    try {
        const { quizz, data } = req.body;
        await quizzService.updateQuizz(quizz, data);
        return res.status(200).json({ message: "Quizz modifié avec succès" });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
};
exports.updateQuestion = async (req, res) => {
    try {
        const { question, data } = req.body;
        await quizzService.updateQuestion(question, data);
        return res.status(200).json({ message: "Question modifiée avec succès" });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
};
exports.updateReponse = async (req, res) => {
    try {
        const { reponse, data } = req.body;
        await quizzService.updateReponse(reponse, data);
        return res.status(200).json({ message: "Réponse modifiée avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};