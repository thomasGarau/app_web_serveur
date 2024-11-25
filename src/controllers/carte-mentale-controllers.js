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
        const cm = await cmService.allCMChapter(chapitre);
        res.status(200).send(cm);
    }catch(err){
        console.error(err);
        res.status(500).send('Echec de la récupération des chapitres de la carte mentale');
    }
};

exports.cmInfo = async (req,res) => {};

exports.cmDetails = async (req,res) => {};

exports.createCM = async (req,res) => {};

exports.updateCM = async (req,res) => {};

exports.deleteCM = async (req,res) => {};

exports.addToCollection = async (req,res) => {};

exports.removeFromCollection = async (req,res) => {};

