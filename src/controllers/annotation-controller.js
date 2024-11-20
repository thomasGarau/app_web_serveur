const annotationService = require('../services/annotation-services');
const {getIdUtilisateurFromToken} = require('../services/user-service');

exports.getAllAnnotationForQuizz = async (req,res) => {
    try{
        const {quizz} = req.body;
        const annotations = await annotationService.getAllAnnotationForQuizz(quizz);
        res.status(200).send(annotations);
    }catch(err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des annotations');
    }
};

exports.getAllAnnotationForCours = async (req,res) => {
    try{
        const {cours} = req.body;
        const annotations = await annotationService.getAllAnnotationForCours(cours);
        res.status(200).send(annotations);
    }catch(err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des annotations');
    }
}

exports.getAllAnswerForAnnotation = async (req,res) => {
    try{
        const {annotation} = req.body;
        const answers = await annotationService.getAllAnswerForAnnotation(annotation);
        res.status(200).send(answers);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la récupération des réponses');
    }
}

exports.createAnnotationCours = async (req,res) => {
    try{
        const cours = req.body.cours;
        const {contenu, etat} = req.body.annotation;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const date = new Date();
        await annotationService.createAnnotationCours(cours, contenu, etat, date, utilisateur);
        res.status(200).send('Annotation créée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la création de l\'annotation');
    }
}

exports.createAnnotationQuizz = async (req,res) => {
    try{
        const question = req.body.question;
        const {contenu, etat} = req.body.annotation;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const date = new Date();
        await annotationService.createAnnotationQuizz(question, contenu, etat, date, utilisateur);
        res.status(200).send('Annotation créée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la création de l\'annotation');
    }
}

exports.addAnswerToAnnotation = async (req,res) => {
    try{
        const {annotation, contenu} = req.body;
        const date = new Date();
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        await annotationService.addAnswerToAnnotation(annotation, contenu, date, utilisateur);
        res.status(200).send('Réponse ajoutée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de l\'ajout de la réponse');
    }
}

exports.deleteAnotation = async (req,res) => {
    try{
        const {annotation} = req.body;
        await annotationService.deleteAnnotation(annotation);
        res.status(200).send('Annotation supprimée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la suppression de l\'annotation');
    }
}

exports.deleteAnswer = async (req,res) => {
    try{
        const {reponse} = req.body;
        await annotationService.deleteAnswer(reponse);
        res.status(200).send('Réponse supprimée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la suppression de la réponse');
    }
}

exports.updateAnnotationState = async (req,res) => {
    try{
        const {annotation, etat} = req.body;
        await annotationService.updateAnnotationState(annotation, etat);
        res.status(200).send('Annotation modifiée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la modification de l\'annotation');
    }
}

exports.updateAnnotationContent = async (req,res) => {
    try{
        const {annotation, contenu} = req.body;
        const date = new Date();
        await annotationService.updateAnnotationContent(annotation, contenu, date);
        res.status(200).send('Annotation modifiée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la modification de l\'annotation');
    }
}

exports.updateAnswer = async (req,res) => {
    try{
        const {reponse, contenu} = req.body;
        const date = new Date();
        await annotationService.updateAnswer(reponse, contenu, date);
        res.status(200).send('Réponse modifiée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la modification de la réponse');
    }
}

