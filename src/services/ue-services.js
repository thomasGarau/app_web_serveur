const db = require('../../config/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// liste d'ue d'un utilisateur

const useruelist = async (num_etudiant) => {
    const [rows] = await db.query('SELECT ue.id_ue, ue.label FROM utilisateur JOIN utilisateur_valide ON utilisateur.num_etudiant = utilisateur_valide.num_etudiant JOIN formation ON utilisateur_valide.id_universite = formation.id_universite JOIN formation_ue ON formation.id_formation = formation_ue.formation_id_formation JOIN ue ON formation_ue.ue_id_ue = ue.id_ue WHERE utilisateur.num_etudiant = ?' , [num_etudiant] );
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
// une ue est elle visible ou pas du coup peut etre attribut visible
// ajouter une ue
const addue = async (id_ue,label) => {
    try{
        await db.query('INSERT INTO ue(id_ue,label) VALUES(?, ?)', [id_ue,label]);
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
const updateue = async (id_ue,label) => {
    try{
        await db.query('UPDATE ue SET label = ? WHERE id_ue = ?', [label,id_ue]);
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