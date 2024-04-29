const ueService = require('../services/ue-services');
const jwt = require('jsonwebtoken');
const {GetToken} = require('../middlewares/verifyAuthorisation');
 
// liste des ue d'un utilisateur
exports.useruelist = (async (req,res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        const num_etudiant = token_decoded.num_etudiant;
        console.log(num_etudiant, "bbbuun")
        const ues = await ueService.useruelist(num_etudiant);
        if(ues.length < 0){
            res.status(200).send("Aucune ue pour cet utilisateur");
        }
        else{
            res.status(200).send(ues);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des ue');
    }
}
)

// liste des ue
exports.uelist = (async (req,res) => {
    try {
        const ues = await ueService.uelist();
        res.status(200).send(ues);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des ue');
    }
}
)

// liste des ue d'une formation
exports.formationuelist = (async (req,res) => {
    try {
        const {id_formation} = req.body;
        const ues = await ueService.formationuelist(id_formation);
        res.status(200).send(ues);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des ue');
    }
}
)

// ajouter une formation

exports.addformation = (async (req,res) => {
    try {
        const {id_formation,label,id_universite} = req.body;
        await ueService.addformation(id_formation,label,id_universite);
        res.status(200).send('Ajout réussi');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de l ajout');
    }
}
)

// ajouter une ue
exports.addue = (async (req,res) => {
    try {
        const {label,id_formation} = req.body;
        await ueService.addue(label,id_formation);
        res.status(200).send('Ajout réussi');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de l ajout');
    }
}
)

// supprimer une formation
exports.deleteformation = (async (req,res) => {
    try {
        const {id_formation} = req.body;
        await ueService.deleteformation(id_formation);
        res.status(200).send('Suppression réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la suppression');
    }
}
)

// supprimer une ue
exports.deleteue = (async (req,res) => {
    try {
        const {id_ue} = req.body;
        await ueService.deleteue(id_ue,role);
        res.status(200).send('Suppression réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la suppression');
    }
}
)

// modifier une formation
exports.updateformation = (async (req,res) => {
    try {
        const {id_formation,label} = req.body;
        await ueService.updateformation(id_formation,label);
        res.status(200).send('Modification réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la modification');
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
