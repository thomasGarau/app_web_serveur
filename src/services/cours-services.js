const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//liste des cours
const courlist = async () => {
    const [rows] = await db.query('SELECT * FROM cours');
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucun cours disponible');
    }
}

// cours par id 
const courById = async (id_study) => {
    const [rows] = await db.query('SELECT * FROM cours WHERE id_cours = ?' , [id_study]);
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucun cours avec cet id');
    }
}

// ajouter un cours
const addcour = async (id_study,label,id_theme) => {
    try{
        await db.query('INSERT INTO cours(id_cours,label,id_theme) VALUES(?, ?, ?)', [id_study,label,id_theme]);
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
const updatecour = async (id_study,label,id_theme) => {
    try{
        await db.query('UPDATE cours SET label = ?, id_theme = ? WHERE id_cours = ?', [label,id_theme,id_study]);
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant la modification');
    }
}

module.exports = {
    courlist,
    courById,
    addcour,
    deletecour,
    updatecour
}