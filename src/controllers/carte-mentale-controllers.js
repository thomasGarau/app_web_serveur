const cmService = require('../services/carte-mentale-services');
const {getIdUtilisateurFromToken} = require('../services/user-service');

exports.userCM = async (req,res) => {
    try{
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const {chapitre} = req.body;
        const cm = await cmService.userCM(utilisateur, chapitre);
        res.status(200).send(cm);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la récupération des cartes mentales');
    }
};

exports.allCMChapter = async (req,res) => {
    try{
        const {chapitre} = req.body;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const cm = await cmService.allCMChapter(chapitre, utilisateur);
        res.status(200).send(cm);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la récupération des chapitres de la carte mentale');
    }
};

exports.cmInfo = async (req,res) => {
    try{
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const {cm} = req.body;
        const cmInfo = await cmService.cmInfo(utilisateur, cm);
        res.status(200).send(cmInfo);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la récupération des informations de la carte mentale');
    }
};

exports.cmDetails = async (req,res) => {
    try{
        const {cm} = req.body;
        const cmDetails = await cmService.cmDetails(cm);
        res.status(200).send(cmDetails);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la récupération des détails de la carte mentale');
    }
};

exports.createCM = async (req,res) => {
    try{
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const {titre, chapitre, visibilite, details} = req.body;
        const date = new Date();
        const imageUrl = req.file ? req.file.path : null;
        if(!imageUrl){
            throw new Error('Erreur lors de la récupération de l\'image de la carte mentale');
        }
        const cm = await cmService.createCM(utilisateur, titre, chapitre, visibilite, date, imageUrl, details);
        res.status(200).send(cm);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la création de la carte mentale');
    }
};

exports.updateCM = async (req,res) => {
    try{
        const {cm, titre,visibilite, details} = req.body;
        const date = new Date();
        const imageUrl = req.file ? req.file.path : null;
        if(!imageUrl){
            throw new Error('Erreur lors de la récupération de l\'image de la carte mentale');
        }
        await cmService.updateCM(cm, titre, visibilite, date, imageUrl, details);
        res.status(200).send('Carte mentale mise à jour');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la mise à jour de la carte mentale');
    }
};

exports.deleteCM = async (req,res) => {
    try{
        const {cm} = req.body;
        await cmService.deleteCM(cm);
        res.status(200).send('Carte mentale supprimée');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la suppression de la carte mentale');
    }
};

exports.addToCollection = async (req,res) => {
    try{
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const {cm} = req.body;
        const date = new Date();
        await cmService.addToCollection(utilisateur, cm, date);
        res.status(200).send('Carte mentale ajoutée à la collection');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de l\'ajout de la carte mentale à la collection');
    }
};

exports.removeFromCollection = async (req,res) => {
    try{
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const {cm} = req.body;
        await cmService.removeFromCollection(utilisateur, cm);
        res.status(200).send('Carte mentale retirée de la collection');
    }catch(err){
        console.error(err);
        res.status(500).send('Echec du retrait de la carte mentale de la collection');
    }
};

