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
    catch (error) {
        console.error(error);
        res.status(500).send('Echec de la récupération des cours');
    }
})

exports.courById = async (req, res) => {
    try {
        const { id_study } = req.body;
        const coursContent = await coursService.getCoursContentById(id_study);

        if (!coursContent) {
            return res.status(404).send('Aucun cours avec cet ID');
        }

        if (coursContent.type === 'file') {
            res.sendFile(coursContent.filePath, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Erreur lors de l\'envoi du fichier');
                }
            });
        } else if (coursContent.type === 'link') {
            res.status(200).json({ link: coursContent.link });
        } else {
            res.status(400).send('Type de cours inconnu');
        }
    } catch (err) {
        console.error(err);

        if (err.message === 'Accès non autorisé') {
            res.status(403).send(err.message);
        } else if (err.message === 'Fichier introuvable') {
            res.status(404).send(err.message);
        } else {
            res.status(500).send('Échec de la récupération du cours');
        }
    }
};

exports.addcours = async (req, res) => {
    try {
        const { chapitre } = req.body;
        const type = req.courseType;
        const coursePath = req.coursePath;
        const label = req.label

        if (!type || !coursePath) {
            return res.status(400).send('Type de cours ou chemin du cours manquant.');
        }

        await coursService.addcour({label, chapitre, path: coursePath, type});

        res.status(200).send('Ajout réussi');
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de l\'ajout');
    }
}


exports.deletecours = (async (req,res) => {
    try{
        const {id_study} = req.body;
        await coursService.deleteCour(id_study);
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

exports.addProgression = async (req,res) => {
    try{
        const {id_study, progression} = req.body;
        const utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        await coursService.addProgression(id_study, utilisateur, progression);
        res.status(200).send('Progression ajoutée');
    }
    catch(err){
        console.error(err);
        res.status(500).send('Echec de l\'ajout de la progression');
    }
};