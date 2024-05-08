const userService = require('../services/user-service');
const {getIdUtilisateurFromToken} = require('../services/user-service');
const jwt = require('jsonwebtoken');

exports.verifyToken = ((req,res) => {
    try {
         // Check if the Authorization header exists in the request
        if (!req.headers.authorization) {
            throw new Error('Authorization header is missing');
        }

        const token = req.headers.authorization.split(' ')[1];
        if(!token || token == 'undefined' || token == 'null'){
            throw new Error('Token invalide');
        }else{
            const decoded = userService.verifyToken(token);
            res.status(200).send({valide:true, information:decoded});
        }
    } catch (err) {
        console.error(err);
        res.status(401).send('Token invalide');
    }
})

exports.Authenticate = (async (req,res) => {
    try {
        const {num_etudiant, password} = req.body;
        const token = await userService.authenticateUser(num_etudiant, password);
        res.status(200).send({token: token, days: 7});
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de l authentification');
    }
})

 exports.register = (async (req,res) => {
    try {
        const { email, password, consentement } = req.body;
        const token = await userService.registerUser(email, password, consentement);
        res.status(200).send({token: token, days: 7});
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Échec de l\'inscription');
    }
})

exports.invalidateToken = (async (req,res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await userService.invalidateToken(token);
        res.status(200).send({username: decoded.userName});
    } catch (err) {
        console.error(err);
        res.status(401).send('Token invalide');
    }
});


exports.getUserInfo = async (req,res) => {
    try {
        const id_utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const info = await userService.getUserInfo(id_utilisateur);
        res.status(200).send(info);
    } catch (err) {
        console.error(err);
        res.status(401).send('erreur lors de la récupération des informations de l\'utilisateur');
    }
};

exports.updateUser = async (req,res) => {
    try{
        const {nom, prenom, date_naissance, password, email} = req.body;
        const userId = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        await userService.updateUser(userId, nom, prenom, date_naissance, password, email);
        res.status(200).send('Utilisateur mis à jour');
    }catch(err){
        console.error(err);
        res.send(500).send(err);
    }
};

exports.sendResetEmail = async (req,res) => {
    try{
        const {num_etudiant} = req.body;
        await userService.sendResetEmail(num_etudiant);
        res.status(200).send('Email envoyé');
    }catch(error){
        console.error(error);
    }
};

exports.updatePassword = async (req,res) => {
    try{
        const {num_etudiant, verif_code, password} = req.body;
        await userService.resetPassword(num_etudiant, verif_code, password);
        res.status(200).send('Mot de passe réinitialisé');
    }catch(error){
        console.error(error);
        res.status(500).send(error);
    }
};


exports.updateProfilPicture = async (req,res) => {
    try{
        const id_utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const imageUrl = req.file ? req.file.path : null;
        if(!imageUrl){
            throw new Error('Erreur lors de la récupération de l\'image de profil');
        }
        await userService.updateProfilPicture(id_utilisateur, imageUrl);
        res.status(200).send('Image de profil mise à jour');
    }catch(error){
        console.error(error);
        res.status(500).send('Erreur lors de la modification de l\'image');
    }
};