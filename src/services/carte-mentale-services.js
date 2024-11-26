const db = require('../../config/database');
const carteMentaleModele = require('../models/carte-mentale-modele');

const userCM = async (utilisateur, chapitre) => {
    try {
        const query = `
            SELECT cm.*
            FROM carte_mentale cm
            LEFT JOIN carte_mentale_collection cmc ON cm.id_carte_mentale = cmc.id_carte_mentale
            WHERE cm.id_chapitre = ? 
            AND (cm.id_utilisateur = ? OR cmc.id_utilisateur = ?);
        `;
        const [rows] = await db.query(query, [chapitre, utilisateur, utilisateur]);
        return rows;
    }
    catch (error) {
        throw new Error('Erreur lors de la récupération des cartes mentales');
    }
};

const allCMChapter = async (chapitre) => {
    try {
        const query = `
            SELECT c.*
            FROM carte_mentale c
            WHERE c.id_chapitre = ?;
        `;
        const [rows] = await db.query(query, [chapitre]);
        return rows;
    }
    catch (error) {
        throw new Error('Erreur lors de la récupération des chapitres de la carte mentale');
    }
}


const cmInfo = async (utilisateur, cm) => {
    try {
        const query = `
            SELECT cm.*,
                   CASE 
                       WHEN cmc.id_utilisateur IS NOT NULL THEN true 
                       ELSE false 
                   END AS is_collection
            FROM carte_mentale cm
            LEFT JOIN carte_mentale_collection cmc 
                   ON cm.id_carte_mentale = cmc.id_carte_mentale 
                   AND cmc.id_utilisateur = ?
            WHERE cm.id_carte_mentale = ?;
        `;
        const [rows] = await db.query(query, [utilisateur, cm]);
        return rows[0]; // Retourne une seule carte mentale si `cm` est un identifiant unique
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des informations de la carte mentale');
    }
};

const cmDetails = async (cm) => {
    try {
        const document = await carteMentaleModele.findOne({ id_carte_mentale: cm });

        if (!document) {
            throw new Error('Document non trouvé pour cette carte mentale');
        }

        return document;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des détails de la carte mentale : ' + error.message);
    }
};

const createCM = async (utilisateur, titre, chapitre, visibilite, date, url, details) => {
    const connection = await db.getConnection(); // Obtenir une connexion pour gérer la transaction
    const session = await carteMentaleModele.startSession();

    try {
        // Démarrer une transaction MySQL
        await connection.beginTransaction();

        // Étape 1 : Insérer les informations dans la base relationnelle
        const query = `
            INSERT INTO carte_mentale
            (id_utilisateur, titre, id_chapitre, visibilite, date, url)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const [result] = await connection.query(query, [utilisateur, titre, chapitre, visibilite, date, url]);

        // Démarrer une session MongoDB pour assurer la cohérence
        session.startTransaction();

        // Étape 2 : Insérer les détails dans MongoDB
        const document = new carteMentaleModele({
            id_carte_mentale: result.insertId, // Correspondance entre MySQL et MongoDB
            details: details
        });
        await document.save({ session });

        // Commit MySQL et MongoDB
        await connection.commit();
        await session.commitTransaction();

        return { id_carte_mentale: result.insertId };
    } catch (error) {
        console.error('Erreur lors de la création de la carte mentale :', error.message);

        // Rollback MySQL et MongoDB
        if (session) await session.abortTransaction();
        if (connection) await connection.rollback();

        throw new Error('Erreur lors de la création de la carte mentale');
    } finally {
        // Libérer la connexion et la session
        if (session) session.endSession();
        if (connection) connection.release();
    }
};

const updateCM = async (cm, titre, visibilite, date, url, details) => {
    const connection = await db.getConnection();
    const session = await carteMentaleModele.startSession();

    try {
        // Démarrer une transaction MySQL
        await connection.beginTransaction();

        // Étape 1 : Mettre à jour les informations dans la base relationnelle
        const query = `
            UPDATE carte_mentale
            SET titre = ?, visibilite = ?, url = ?, date = ?
            WHERE id_carte_mentale = ?;
        `;
        await connection.query(query, [titre, visibilite, url, date, cm]);

        // Démarrer une session MongoDB pour assurer la cohérence
        session.startTransaction();

        // Étape 2 : Mettre à jour les détails dans MongoDB
        await carteMentaleModele.updateOne({ id_carte_mentale: cm }, { details: details }, { session });

        // Commit MySQL et MongoDB
        await connection.commit();
        await session.commitTransaction();

        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la carte mentale :', error.message);

        // Rollback MySQL et MongoDB
        if (session) await session.abortTransaction();
        if (connection) await connection.rollback();

        throw new Error('Erreur lors de la mise à jour de la carte mentale');
    } finally {
        if (session) session.endSession();
        if (connection) connection.release();
    }
};

const deleteCM = async (cm) => {
    const connection = await db.getConnection();
    const session = await carteMentaleModele.startSession();

    try {
        // Démarrer une transaction MySQL
        await connection.beginTransaction();

        // Étape 1 : Supprimer les informations dans la base relationnelle
        const query = `
            DELETE FROM carte_mentale
            WHERE id_carte_mentale = ?;
        `;
        await connection.query(query, [cm]);

        // Démarrer une session MongoDB pour assurer la cohérence
        session.startTransaction();

        // Étape 2 : Supprimer les détails dans MongoDB
        await carteMentaleModele.deleteOne({ id_carte_mentale: cm }, { session });

        // Commit MySQL et MongoDB
        await connection.commit();
        await session.commitTransaction();

        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la carte mentale :', error.message);

        // Rollback MySQL et MongoDB
        if (session) await session.abortTransaction();
        if (connection) await connection.rollback();

        throw new Error('Erreur lors de la suppression de la carte mentale');
    } finally {
        if (session) session.endSession();
        if (connection) connection.release();
    }
};

const addToCollection = async (utilisateur, cm, date) => {
    try {
        const query = `
            INSERT INTO carte_mentale_collection
            (id_utilisateur, id_carte_mentale, date_ajout)
            VALUES (?, ?, ?);
        `;
        await db.query(query, [utilisateur, cm, date]);
        return true;
    } catch (error) {
        throw new Error('Erreur lors de l\'ajout de la carte mentale à la collection');
    }
};

const removeFromCollection = async (utilisateur, cm) => {
    try {
        const query = `
            DELETE FROM carte_mentale_collection
            WHERE id_utilisateur = ?
            AND id_carte_mentale = ?;
        `;
        await db.query(query, [utilisateur, cm]);
        return true;
    } catch (error) {
        throw new Error('Erreur lors de la suppression de la carte mentale de la collection');
    }
};



module.exports = {
    userCM,
    allCMChapter,
    cmInfo,
    cmDetails,
    createCM,
    updateCM,
    deleteCM,
    addToCollection,
    removeFromCollection
};