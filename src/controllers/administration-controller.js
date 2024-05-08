const adminService = require('../services/administration-services');
const userService = require('../services/user-service');


exports.creerUtilisateur = async (req, res) => {
    try {
        const path = req.file ? req.file.path : null;
        const token = req.headers.authorization.split(' ')[1];
        const num_etudiant = await userService.getNumetudiantFromToken(token);
        const universite = await adminService.getUniversiteFromUser(num_etudiant);
        await adminService.CreateUsersFromCSV(path, universite);
        res.status(200).send('Utilisateurs créés avec succès');
    }catch(error){
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
};

exports.creerFormation = async (req, res) => {
    try {
        const path = req.file ? req.file.path : null;
        await adminService.createFormation(path);
        res.status(200).send('Formation créée');
    }catch(error){
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
}