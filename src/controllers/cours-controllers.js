const coursService = require('../services/cours-services');
const jwt = require('jsonwebtoken');

// liste des cours

exports.courlist = (async (req,res) => {
    try {
        const cours = await coursService.courlist();
        console.log(cours);
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
        const {id_study,label,contenu,id_chapitre} = req.body;
        await coursService.addcour(id_study,label,contenu,id_chapitre);
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
        await coursService.deletecour(id_study);
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
        const {id_study,label,contenu,id_chapitre} = req.body;
        await coursService.updatecour(id_study,label,contenu,id_chapitre);
        res.status(200).send('Modification réussie');
    }
    catch(err){
        console.log(err);
        res.status(200).send('Echec de la modification');
    }
})