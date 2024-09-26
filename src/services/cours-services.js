const db = require('../../config/database.js');
const fs = require('fs').promises;
const path = require('path');

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

const getCoursContentById = async (id_cours) => {
    try {
        const [rows] = await db.query('SELECT * FROM cours WHERE id_cours = ?', [id_cours]);
        if (rows.length === 0) {
            return null; 
        }

        const cours = rows[0];
        const { type, path: coursePath, label } = cours;

        if (['pdf', 'video', 'telechargeable'].includes(type)) {

            const filePath = path.resolve(__dirname, '..', '..', coursePath);

            const allowedDir = path.resolve(__dirname, '..', '..', 'cours');
            if (!filePath.startsWith(allowedDir)) {
                throw new Error('Accès non autorisé');
            }

            await fs.access(filePath);

            return { type: 'file', filePath, label };
        } else if (['youtube', 'lien'].includes(type)) {

            return { type: 'link', link: coursePath };

        } else {
            throw new Error('Type de cours inconnu');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération du contenu du cours', error);
    }
};

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

const deleteCour = async (id_cours) => {
    try {
        // Récupére les informations du cours
        const [rows] = await db.query('SELECT path, type FROM cours WHERE id_cours = ?', [id_cours]);

        if (rows.length === 0) {
            throw new Error('Cours non trouvé');
        }

        const { path: coursePath, type } = rows[0];

        // Si le cours est un fichier stocké sur le serveur, le supprimer
        if (['pdf', 'video', 'telechargeable'].includes(type)) {
            // Construit le chemin absolu du fichier
            const filePath = path.join(__dirname, '..', '..', coursePath);

            // Vérifie si le fichier existe
            await fs.access(filePath);

            // Supprime le fichier
            await fs.unlink(filePath);
        }

        await db.query('DELETE FROM cours WHERE id_cours = ?', [id_cours]);

    } catch (err) {
        console.error(err);
        throw new Error('Erreur lors de la suppression du cours');
    }
};

const updatecour = async (id_study, label) => {
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

const addProgression = async (id_cours, id_user, progression) => { 
    try {
        await db.query(
            'INSERT INTO avancement_cours (id_cours, id_utilisateur, progression) VALUES (?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE progression = GREATEST(progression, VALUES(progression))',
            [id_cours, id_user, progression]
        );
    } catch (err) {
        console.error(err);
        throw new Error('Erreur durant l\'ajout de la progression');
    }
};



module.exports = {
    courlist,
    getCoursContentById,
    addcour,
    deleteCour,
    updatecour,
    ChapitreById,
    addProgression
}