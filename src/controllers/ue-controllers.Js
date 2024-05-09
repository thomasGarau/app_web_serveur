const ueService = require('../services/ue-services');
const jwt = require('jsonwebtoken');
const {GetToken} = require('../middlewares/verifyAuthorisation');
const userService = require('../services/user-service');
 
// liste des ue d'un utilisateur et le nom et prenoms de l'enseignant associé
exports.useruelist = (async (req,res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        const num_etudiant = token_decoded.num_etudiant;
        const ues = await ueService.useruelist(num_etudiant);
            res.status(200).send(ues);
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

exports.ueInfo = (async (req,res) => {
    try {
        const {id_ue} = req.body;
        const ue = await ueService.ueInfo(id_ue);
        res.status(200).send(ue)
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération de l ue');
    }
}
)

exports.profUeList = (async (req,res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        const num_etudiant_prof = token_decoded.num_etudiant;
        const ues = await ueService.profUeList(num_etudiant_prof);
        res.status(200).send(ues);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des ue');
    }
}
)

//liste des chapitre d'une ue
exports.chapitreuelist = (async (req,res) => {
    try {
        const {id_ue} = req.body;
        const chapitres = await ueService.chapitreuelist(id_ue);
        res.status(200).send(chapitres);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des chapitres');
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
        const {label, id_formation} = req.body;
        const path = req.file.path;
        await ueService.addue(label, id_formation, path);
        res.status(200).send('Ajout réussi');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de l ajout');
    }
}
)

// ajouter un chapitre
exports.addchapitre = (async (req,res) => {
    try {
        const {label,id_ue} = req.body;
        await ueService.addchapitre(label,id_ue);
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

// supprimer un chapitre
exports.deletechapitre = (async (req,res) => {
    try {
        const {id_chapitre} = req.body;
        await ueService.deletechapitre(id_chapitre);
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
        await ueService.deleteue(id_ue);
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
        const {id_ue, label} = req.body;
        const path = req.file ? req.file.path : null;
        const options = {
            label,
            path
        }
        await ueService.updateue(id_ue, options);
        res.status(200).send('Modification réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la modification');
    }
}
)

// modifier un chapitre
exports.updatechapitre = (async (req,res) => {
    try {
        const {id_chapitre,label} = req.body;
        await ueService.updatechapitre(id_chapitre,label);
        res.status(200).send('Modification réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la modification');
    }
}
)
