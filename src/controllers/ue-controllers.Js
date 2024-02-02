const userService = require('../services/ue-services');
 
// liste des ue d'un utilisateur
exports.useruelist = (async (req,res) => {
    try {
        const {id_pseudo} = req.body;
        const ues = await userService.useruelist(id_pseudo);
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
        const ues = await userService.uelist();
        res.status(200).send(ues);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des ue');
    }
}
)

// ajouter une ue
exports.addue = (async (req,res) => {
    try {
        const {id_ue,label,visible} = req.body;
        await userService.addue(id_ue,label,visible);
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
        await userService.deleteue(id_ue);
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
        const {id_ue,label,visible} = req.body;
        await userService.updateue(id_ue,label,visible);
        res.status(200).send('Modification réussie');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la modification');
    }
}
)
