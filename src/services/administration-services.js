const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');
const db = require('../../config/database');

const getCurrentAcademicYear = () => {
    const today = moment();
    const currentYear = today.year();
    const academicYearStart = today.month() < 7 ? currentYear - 1 : currentYear;
    return academicYearStart;
};

const getFormations = async (idUniversite) => {
    const query = `SELECT id_formation, label FROM formation WHERE id_universite = ?`;
    const [results] = await db.query(query, [idUniversite]);
    return results.reduce((acc, formation) => {
        acc[formation.label] = formation.id_formation;
        return acc;
    }, {});
};

const getUniversiteFromUser = async (num_etudiant) => {
    const query = `
        SELECT id_universite
        FROM utilisateur_valide
        WHERE num_etudiant = ?`;
    
    const [result] = await db.query(query, num_etudiant);
    return result[0].id_universite;
}

const CreateUsersFromCSV = async (filePath, idUniversite) => {
    return new Promise(async (resolve, reject) => {
        const results = [];
        const formations = await getFormations(idUniversite);
        const academicYear = getCurrentAcademicYear();

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    let utilisateurValideValues = [];
                    let promotionValues = [];

                    for (const user of results) {
                        const idFormation = formations[user.label_formation];
                        if (!idFormation) {
                            console.error('Label de formation non trouvé:', user.label_formation);
                            continue;
                        }

                        utilisateurValideValues.push([
                            user.num_etudiant,
                            user.nom,
                            user.prenom,
                            user.mail_utilisateur,
                            user.role,
                            idUniversite,
                            user.date_naissance
                        ]);

                        promotionValues.push([
                            user.num_etudiant,
                            idFormation,
                            academicYear
                        ]);
                    }

                    if (utilisateurValideValues.length > 0) {
                        const utilisateurValideQuery = `
                            INSERT INTO utilisateur_valide 
                            (num_etudiant, nom, prenom, mail_utilisateur, role, id_universite, date_naissance) 
                            VALUES ?`;
                        await db.query(utilisateurValideQuery, [utilisateurValideValues]);
                    
                        if (promotionValues.length > 0) {
                            const promotionQuery = `
                                INSERT INTO promotion (num_etudiant, id_formation, annee) 
                                VALUES ?`;
                            await db.query(promotionQuery, [promotionValues]);
                        }
                    }
                    
                    resolve('Tous les utilisateurs ont été ajoutés avec succès.');
                } catch (error) {
                    console.error('Erreur lors de l\'insertion des utilisateurs:', error);
                    reject(error);
                }
            });
    });
};

const createFormation = async (filePath, idUniversite) => {
    const results = [];
    const enseignants = new Map();
    const formations = new Map();
    const ues = new Map();
    const formationUeValues = [];
    const enseignantsUeValues = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
                if (!enseignants.has(data.num_etudiant_enseignant)) {
                    enseignants.set(data.num_etudiant_enseignant, {
                        num_etudiant: data.num_etudiant_enseignant,
                        nom: data.nom_enseignant,
                        prenom: data.prenom_enseignant,
                        mail: data.mail_enseignant,
                        role: data.role_enseignant,
                        id_universite: idUniversite
                    });
                }
            })
            .on('end', async () => {
                try {
                    // Étape 1 : Insérer ou mettre à jour les enseignants dans utilisateur_valide
                    const enseignantValues = Array.from(enseignants.values());
                    const enseignantQuery = `
                        INSERT INTO utilisateur_valide 
                        (num_etudiant, nom, prenom, mail_utilisateur, role, id_universite) 
                        VALUES ? ON DUPLICATE KEY UPDATE num_etudiant = VALUES(num_etudiant)`;
                    await db.query(enseignantQuery, [enseignantValues.map(ens => [ens.num_etudiant, ens.nom, ens.prenom, ens.mail, ens.role, ens.id_universite])]);

                    // Étape 2 : Insérer dans utilisateur avec des valeurs par défaut
                    const numEtudiants = Array.from(enseignants.keys());
                    const utilisateurQuery = `
                        INSERT INTO utilisateur (num_etudiant, mdp, url, consentement) 
                        VALUES ?
                        ON DUPLICATE KEY UPDATE num_etudiant = VALUES(num_etudiant)`;
                    const utilisateurValues = numEtudiants.map(num => [num, '', null, 0]);
                    await db.query(utilisateurQuery, [utilisateurValues]);

                    // Étape 3 : Récupérer les id_utilisateur correspondants
                    const [utilisateurRows] = await db.query(
                        `SELECT u.id_utilisateur, uv.num_etudiant 
                         FROM utilisateur u
                         JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
                         WHERE uv.num_etudiant IN (?)`,
                        [numEtudiants]
                    );

                    const numToIdMap = new Map(utilisateurRows.map(row => [row.num_etudiant, row.id_utilisateur]));

                    // Étape 4 : Préparer les données pour les insertions groupées
                    for (const row of results) {
                        if (!formations.has(row.label_formation)) {
                            formations.set(row.label_formation, null);
                        }
                        if (!ues.has(row.label_ue)) {
                            ues.set(row.label_ue, null);
                        }

                        const idUtilisateur = numToIdMap.get(row.num_etudiant_enseignant);
                        if (idUtilisateur) {
                            enseignantsUeValues.push([idUtilisateur, row.label_ue]);
                        }
                    }

                    // Étape 5 : Insérer les formations
                    const formationValues = Array.from(formations.keys()).map(label => [label, idUniversite]);
                    const [formationResult] = await db.query(`INSERT INTO formation (label, id_universite) VALUES ?`, [formationValues]);
                    let formationIdStart = formationResult.insertId;
                    formationValues.forEach(([label], index) => {
                        formations.set(label, formationIdStart + index);
                    });

                    // Étape 6 : Insérer les UE
                    const ueValues = Array.from(ues.keys()).map(label => [label]);
                    const [ueResult] = await db.query(`INSERT INTO ue (label) VALUES ?`, [ueValues]);
                    let ueIdStart = ueResult.insertId;
                    ueValues.forEach(([label], index) => {
                        ues.set(label, ueIdStart + index);
                    });

                    // Étape 7 : Préparer les données pour formation_ue et enseignants_ue
                    formationUeValues.push(...Array.from(formations.entries()).flatMap(([formationLabel, formationId]) => {
                        return Array.from(ues.entries()).filter(([ueLabel]) => results.some(row => row.label_formation === formationLabel && row.label_ue === ueLabel))
                            .map(([ueLabel, ueId]) => [formationId, ueId]);
                    }));

                    enseignantsUeValues.forEach(([idUtilisateur, ueLabel], index) => {
                        enseignantsUeValues[index] = [idUtilisateur, ues.get(ueLabel)];
                    });

                    // Étape 8 : Insertions finales
                    await db.query(`INSERT INTO formation_ue (formation_id_formation, ue_id_ue) VALUES ?`, [formationUeValues]);
                    await db.query(`INSERT INTO enseignants_ue (id_utilisateur, id_ue) VALUES ?`, [enseignantsUeValues]);

                    resolve('Formations, UEs, and teachers have been successfully added.');
                } catch (error) {
                    console.error('Error inserting data:', error);
                    reject(error);
                }
            });
    });
};


module.exports = {
    createFormation,
    CreateUsersFromCSV,
    getUniversiteFromUser
}
