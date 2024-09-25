const db = require('../../config/database.js');

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
const courlist = async (id_chapitre, utilisateur) => {
    try {
        const query = `
        SELECT c.id_cours AS id, c.label, c.type, COALESCE(ac.etat_progression, 0) AS progression
        FROM cours c
        LEFT JOIN avancement_cours ac 
        ON c.id_cours = ac.id_cours AND ac.id_user = ?
        WHERE c.id_chapitre = ?
        `;
        const [rows] = await db.query(query, [utilisateur, id_chapitre]);

        if (rows.length > 0) {
            const totalProgress = rows.reduce((sum, row) => sum + row.progression, 0);
            const progressionChapitre = totalProgress / rows.length;

            return {
                progression_chapitre: progressionChapitre,
                cours: rows
            };
        } else {
            return {
                progression_chapitre: 0,
                cours: []
            };
        }
    } catch (error) {
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
const addcour = async ({ label, id_chapitre, path, type }) => {
    try {
        await db.query(
            'INSERT INTO cours (label, id_chapitre, path, type) VALUES (?, ?, ?, ?)',
            [label, id_chapitre, path, type]
        );
    } catch (err) {
        console.error(err);
        throw new Error('Erreur durant l\'ajout');
    }
};

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
        const query = `
            UPDATE cours SET label = ?,
            WHERE id_cours = ?;
        `;
        await db.query(query, [label, id_study]);
        return true;
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