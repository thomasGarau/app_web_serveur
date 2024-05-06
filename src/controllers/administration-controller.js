const adminService = require('../services/administration-services');


exports.creerUtilisateur = async (req, res) => {
    try {
        const path = req.file ? req.file.path : null;
        await adminService.CreateUsersFromCSV(path);
        res.status(200).send('Utilisateurs créés avec succès');
    }catch(error){
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
};