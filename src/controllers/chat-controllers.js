const chatService = require('../services/chat-services');
const jwt = require('jsonwebtoken');

// liste des messages

exports.messageList = (async (req,res) => {
    try {
        const messages = await chatService.messageList();
        res.status(200).send(messages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des messages');
    }
})

// messages par forum

exports.messageByForum = (async (req,res) => {
    try{
        const {id_forum} = req.body;
        const messages = await chatService.messageByForum(id_forum);
        res.status(200).send(messages);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des messages');
    }
})

// ajouter un message

exports.addMessage = (async (req,res) => {
    try{
        const {contenu,date,id_forum} = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(token_decoded,"token");
        const id_etudiant = token_decoded.id_etudiant;
        console.log(id_etudiant);
        await chatService.saveMessage(contenu,date,id_forum,id_etudiant);
        res.status(200).send('Ajout réussi');
    }
    catch (err){
        console.error(err);
        res.status(500).send('Echec de l ajout');
    }
})

// supprimer un message

exports.deleteMessage = (async (req,res) => {
    try{
        const {id_message,token} = req.body;
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        const role = token_decoded.role;
        const id_etudiant = token_decoded.id_etudiant;
        await chatService.deleteMessage(id_message,role,id_etudiant);
        res.status(200).send('Suppression réussie');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Echec de la suppression');
    }
})

// modifier un message

exports.updateMessage = (async (req,res) => {
    try{
        const {id_message,contenu,date,id_forum,token} = req.body;
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id_etudiant = token_decoded.id_etudiant;
        await chatService.updateMessage(id_message,contenu,date,id_forum,id_etudiant);
        res.status(200).send('Modification réussie');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Echec de la modification');
    }
})

// liste des messages forums quizz

exports.messageListQuizz = (async (req,res) => {
    try {
        const id_forum = req.body.id_forum;
        const messages = await chatService.messageListQuizz(id_forum);
        res.status(200).send(messages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des messages');
    }
})

// liste des messages forums cours

exports.messageListCours = (async (req,res) => {
    try {
        const id_forum = req.body.id_forum;
        const messages = await chatService.messageListCours(id_forum);
        res.status(200).send(messages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des messages');
    }
})

// liste des messages forums cours chapitre

exports.messageListCoursChapitre = (async (req,res) => {
    try {
        const {id_chapitre} = req.body;
        const messages = await chatService.messageListCoursChapitre(id_chapitre);
        res.status(200).send(messages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des messages');
    }
})

// liste des forums pour un cours donné

exports.forumListCours = (async (req,res) => {
    try {
        const {id_cours} = req.body;
        const forums = await chatService.forumListCours(id_cours);
        res.status(200).send(forums);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des forums');
    }
})

// liste des forums pour un quizz donné

exports.forumListQuizz = (async (req,res) => {
    try {
        const {id_quizz} = req.body;
        const forums = await chatService.forumListQuizz(id_quizz);
        res.status(200).send(forums);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des forums');
    }
})
