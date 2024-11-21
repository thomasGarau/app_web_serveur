const db = require('../../config/database.js');


// liste d'ue d'un utilisateur

const useruelist = async (num_etudiant) => {
    try{
        const query =`SELECT DISTINCT ue.id_ue, ue.label,ue.path
                FROM promotion
                JOIN formation_ue ON promotion.id_formation = formation_ue.formation_id_formation
                JOIN ue ON formation_ue.ue_id_ue = ue.id_ue
                WHERE promotion.num_etudiant = ?`;
        const [rows] = await db.query(query, [num_etudiant] );
        //nom du professeur associé à chaque ue de la liste des ue
        for (let i = 0; i < rows.length; i++) {
            const query =`SELECT utilisateur_valide.nom, utilisateur_valide.prenom
                    FROM utilisateur_valide
                    JOIN utilisateur ON utilisateur_valide.num_etudiant = utilisateur.num_etudiant
                    JOIN enseignants_ue ON utilisateur.id_utilisateur = enseignants_ue.id_utilisateur
                    WHERE enseignants_ue.id_ue = ?`;
            const [rows2] = await db.query(query, [rows[i].id_ue] );
            rows[i].enseignant = rows2;
        }

        if (rows.length > 0){
            return rows;
        }
        else {
            return [];
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération des ue');
    
    }
}

const profUeList = async (utilisateur) => {
    try{
        const query =`select *  from enseignants_ue
        where id_utilisateur = ?`;
        const [rows] = await db.query(query, [utilisateur] );
        if (rows.length > 0){
            return rows;
        }
        else {
            return [];
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération des ue');
    }
}


const ueInfo = async (id_ue) => {
    try{
        const query =`SELECT ue.id_ue, ue.label,ue.path
                FROM ue
                WHERE ue.id_ue = ?`;
        const [rows] = await db.query(query, [id_ue] );
        if (rows.length > 0){
            return rows;
        }
        else {
            return [];
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération des ue');
    }
}

// liste des ue ainsi que le nom de chaque enseignant associé
const uelist = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM ue');
        //nom du professeur associé à chaque ue de la liste des ue
        for (let i = 0; i < rows.length; i++) {
            const query =`SELECT utilisateur_valide.nom, utilisateur_valide.prenom
                    FROM utilisateur_valide
                    JOIN utilisateur ON utilisateur_valide.num_etudiant = utilisateur.num_etudiant
                    JOIN enseignants_ue ON utilisateur.id_utilisateur= enseignants_ue.id_utilisateur
                    WHERE enseignants_ue.id_ue = ?`;
            const [rows2] = await db.query(query, [rows[i].id_ue] );
            rows[i].enseignant = rows2;
        }
        
        if (rows.length > 0){
            return rows;
        }
        else {
            return 'Aucune ue';
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération des ue');
    }
}

// liste des ue d'une formation

const formationuelist = async (id_formation) => {
    try{
        const query =`SELECT ue.id_ue, ue.label ,ue.path
                        FROM formation JOIN formation_ue 
                        ON formation.id_formation = formation_ue.formation_id_formation 
                        JOIN ue ON formation_ue.ue_id_ue = ue.id_ue WHERE formation.id_formation = ?`;
        const [rows] = await db.query(query, [id_formation] );
        if (rows.length > 0){
            return rows;
        }
        else {
            return [];
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération des ue');
    }
}

// liste des chapitres d'une ue
const chapitreuelist = async (id_ue) => {
    try{
        const query =`SELECT chapitre.id_chapitre, chapitre.label
                        FROM chapitre
                        JOIN ue ON chapitre.id_ue = ue.id_ue
                        WHERE ue.id_ue = ?`;
        const [rows] = await db.query(query, [id_ue] );
        if (rows.length > 0){
            return rows;
        }
        else {
            return [];
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération des chapitres');
    }
}


// ajouter une formation
const addformation = async (id_formation,label,id_universite) => {
    try{
        await db.query('INSERT INTO formation(id_formation,label,id_universite) VALUES(?, ?, ?)', [id_formation,label,id_universite]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant l ajout');
    }

}

// liste des chapitres d'une ue
const uechapitreslist = async (id_ue) => {
    const query =`SELECT chapitre.id_chapitre, chapitre.label
                    FROM chapitre
                    JOIN ue ON chapitre.id_ue = ue.id_ue
                    WHERE ue.id_ue = ?`;
    const [rows] = await db.query(query, [id_ue] );
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucun chapitre pour cette ue');
    }
}



// ajouter une ue
const addue = async (label, id_formation, path) => {
    try{
        const [rows] = await db.query('INSERT INTO ue(label,path) VALUES(?,?)', [label,path]);
        const id_ue = rows.insertId;
        await db.query('INSERT INTO formation_ue(formation_id_formation,ue_id_ue) VALUES(?, ?)', [id_formation,id_ue]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant l ajout');
    }

}

// ajouter un chapitre
const addchapitre = async (label,id_ue) => {
    try{
        await db.query('INSERT INTO chapitre(label,id_ue) VALUES(?, ?)', [label,id_ue]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant l ajout');
    }

}

//supprimer une formation
const deleteformation = async (id_formation) => {
    try{
        await db.query('DELETE FROM formation WHERE id_formation = ?', [id_formation]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant la suppression');
    }

}

//supprimer un chapitre
const deletechapitre = async (id_chapitre) => {
    try{
        await db.query('DELETE FROM chapitre WHERE id_chapitre = ?', [id_chapitre]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant la suppression');
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
const updateue = async (id_ue, options) => {
    try {
        const { label, path } = options;

        const fieldsToUpdate = [
            { field: 'label', value: label },
            { field: 'path', value: path }
        ];

        const fieldsWithValues = fieldsToUpdate.filter(field => field.value !== null && field.value !== undefined);

        const setClauses = fieldsWithValues.map(field => `${field.field} = ?`);

        const updateQuery = `UPDATE ue SET ${setClauses.join(', ')} WHERE id_ue = ?`;

        const updateValues = fieldsWithValues.map(field => field.value);
        updateValues.push(id_ue);

        await db.query(updateQuery, updateValues);

    } catch (err) {
        console.error(err);
        throw new Error('Erreur lors de la modification');
    }
}

// modifier une formation
const updateformation = async (id_formation,label) => {
    try{
        await db.query('UPDATE formation SET label = ? WHERE id_formation = ?', [label,id_formation]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant la modification');
    }

}

// modifier un chapitre
const updatechapitre = async (id_chapitre,label) => {
    try{
        await db.query('UPDATE chapitre SET label = ? WHERE id_chapitre = ?', [label,id_chapitre]);
    } catch (err) {
        console.error(err);
        throw new Error('erreur durant la modification');
    }

}


module.exports = {
    useruelist,
    uelist,
    profUeList,
    ueInfo,
    addue,
    deleteue,
    updateue,
    formationuelist,
    addformation,
    deleteformation,
    updateformation,
    chapitreuelist,
    addchapitre,
    deletechapitre,
    updatechapitre
}