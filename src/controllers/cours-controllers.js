const coursService = require('../services/cours-services');

// liste des cours

exports.courlist = (async (res) => {
    try {
        const cours = await coursService.courlist();
        res.status(200).send(cours);
    } catch (err) {
        console.error(err);
        res.status(500).send('Echec de la récupération des cours');
    }
}
)

// cours par id

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

// ajouter un cours

exports.addcours = (async (req,res) => {
    try{
        const {id_study,label,id_theme} = req.body;
        await coursService.addcours(id_study,label,id_theme);
        res.status(200).send('Ajout réussi');
    }
    catch (err){
        console.error(err);
        res.status(500).send('Echec de l ajout');
    }
})

// supprimer un cours

exports.deletecours = (async (req,res) => {
    try{
        const {id_study} = req.body;
        await coursService.deletecours(id_study);
        res.status(200).send('Suppression réussie');
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Echec de la suppression');
    }
})

// modifie un cours

exports.updatecours = (async (req,res)=>{
    try{
        const {id_study,label,id_theme} = req.body;
        await serviceCours.updatecours(id_study,label,id_theme);
        res.status(200).send('Modification réussie');
    }
    catch(err){
        console.log(err);
        res.status(200).send('Echec de la modification');
    }
})

