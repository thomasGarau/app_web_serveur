const ueService = require('../services/ue-services');
const jwt = require('jsonwebtoken');
 
// liste des ue d'un utilisateur
exports.useruelist = (async (req,res) => {
    try {
        const {token} = req.body;
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        num_etudiant = token_decoded.num_etudiant;
        console.log(num_etudiant, "bbb")
        const ues = await ueService.useruelist(num_etudiant);
        res.status(200).send(ues);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des ue');
    }
}
)

// liste des ue
exports.uelist = (async (res) => {
    try {
        const ues = await ueService.uelist();
        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des ue');
    }
}
)

// ajouter une ue
exports.addue = (async (req,res) => {
    try {
        const {id_ue,label} = req.body;
        await ueService.addue(id_ue,label);
        res.status(200).send('Ajout réussi');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de l ajout');
    }
}
)

// supprimer une ue
exports.deleteue = (async (req,res) => {
    try {
        const {id_ue} = req.body;
        await ueService.deleteue(id_ue);
        res.status(200).send('Suppression réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la suppression');
    }
}
)

// modifier une ue
exports.updateue = (async (req,res) => {
    try {
        const {id_ue,label} = req.body;
        await ueService.updateue(id_ue,label);
        res.status(200).send('Modification réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la modification');
    }
}
)
