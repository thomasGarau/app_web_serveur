const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const ChapitreById = async (id_chapitre) => {
    try{
        const [rows] = await db.query('SELECT * FROM chapitre WHERE id_chapitre = ?', [id_chapitre]);
        if (rows.length > 0){
            return rows;
        }
        else {
            return 'Aucun chapitre disponible';
        }
    }
    catch(error){
        throw new Error('erreur dans la récupération des chapitres');
    }
}

//liste des cours d'un chapitre
const courlist = async (id_chapitre) => {
    try{
        const [rows] = await db.query('SELECT * FROM cours WHERE id_chapitre = ?' , [id_chapitre]);
        if (rows.length > 0){
            return rows;
        }
        else {
           return [];
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération des cours');
    }
}

// cours par id 
const courById = async (id_study) => {
    try{
        const [rows] = await db.query('SELECT * FROM cours WHERE id_cours = ?' , [id_study]);
        if (rows.length > 0){
            return rows;
        }
        else {
            return 'Aucun cours avec cet id';
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération du cours');
    }
}

// ajouter un cours
const addcour = async (id_study,label,contenu,id_chapitre) => {
    try{
        await db.query('INSERT INTO cours(id_cours,label,contenu,id_chapitre) VALUES(?,?,?,?)', [id_study,label,contenu,id_chapitre]);
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant l ajout');
    }
}

// supprimer un cours
const deletecour = async (id_study) => {
    try{
        await db.query('DELETE FROM cours WHERE id_cours = ?', [id_study]);
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant la suppression');
    }
}

// modifier un cours
const updatecour = async (id_study, label, contenu) => {
    try {
        const row = await db.query('UPDATE cours SET contenu = ?, label = ? WHERE id_cours = ?', [contenu, label, id_study]);
        console.log(row, 'row');
    } catch (err) {
        console.error(err);
        throw new Error('Erreur durant la modification');
    }
}


module.exports = {
    courlist,
    courById,
    addcour,
    deletecour,
    updatecour,
    ChapitreById
}