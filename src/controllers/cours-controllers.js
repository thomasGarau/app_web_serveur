const coursService = require('../services/cours-services');
const {getIdUtilisateurFromToken} = require('../services/user-service');

exports.ChapitreById = (async (req,res) => {
    try{
        const {id_chapitre} = req.body;
        const chapitre = await coursService.ChapitreById(id_chapitre);
        res.status(200).send(chapitre);
    }
    catch (err){
        console.error(err);
        res.status(500).send('Echec de la récupération du chapitre');
    }
})

exports.courlist = (async (req,res) => {
    try{
        const {id_chapitre} = req.body;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const cours = await coursService.courlist(id_chapitre, utilisateur);
        res.status(200).send(cours);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des cours');
    }
})

exports.courById = (async (req,res) => {
    try{
        const {id_study} = req.body;
        const cours = await coursService.courById(id_study);
        res.status(200).send(cours);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération du cours');
    }
})

exports.addcours = async (req, res) => {
    try {
        const { id_chapitre, label } = req.body;
        const type = req.courseType;
        const coursePath = req.coursePath;

        if (!type || !coursePath) {
            return res.status(400).send('Type de cours ou chemin du cours manquant.');
        }

        await coursService.addcour({label,id_chapitre, path: coursePath, type});

        res.status(200).send('Ajout réussi');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de l\'ajout');
    }
}


exports.deletecours = (async (req,res) => {
    try{
        const {id_study} = req.body;
        await coursService.deletecour(id_study);
        res.status(200).send('Suppression réussie');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Echec de la suppression');
    }
})

exports.updatecours = (async (req,res)=>{
    try{
        const {id_study,label} = req.body;
        await coursService.updatecour(id_study,label);
        res.status(200).send('Modification réussie');
    }
    catch(err){
        console.error(err);
        res.status(500).send('Echec de la modification');
    }
})