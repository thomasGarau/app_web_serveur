const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// liste des ue d'un utilisateur
const useruelist = async (id_pseudo) => {
    const [rows] = await db.query('SELECT * FROM utilisateur_has_ue WHERE utilisateur_id_pseudo = ?' , [id_pseudo]);
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucune ue pour cet utilisateur');
    }
}

// liste des ue
const uelist = async () => {
    const [rows] = await db.query('SELECT * FROM ue');
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucune ue');
    }
}

// ajouter une ue
const addue = async (id_ue,label,visible) => {
    try{
        await db.query('INSERT INTO ue(id_ue,label,visible) VALUES(?, ?, ?)', [id_ue,label,visible]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant l ajout');
    }

}

// supprimer une ue
const deleteue = async (id_ue) => {
    try{
        await db.query('DELETE FROM ue WHERE id_ue = ?', [id_ue]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant la suppression');
    }

}

// modifier une ue
const updateue = async (id_ue,label,visible) => {
    try{
        await db.query('UPDATE ue SET label = ?, visible = ? WHERE id_ue = ?', [label,visible,id_ue]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant la modification');
    }

}


module.exports = {
    useruelist,
    uelist,
    addue,
    deleteue,
    updateue
}