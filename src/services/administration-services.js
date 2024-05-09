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
    const enseignants = new Map(); // stockage pour éviter les doublons
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
                // Insertion des enseignants (uniquement si nouveau)
                const enseignantValues = Array.from(enseignants.values());
                const enseignantQuery = `
                    INSERT INTO utilisateur_valide 
                    (num_etudiant, nom, prenom, mail_utilisateur, role, id_universite) 
                    VALUES ? ON DUPLICATE KEY UPDATE num_etudiant = VALUES(num_etudiant)`;
                await db.query(enseignantQuery, [enseignantValues.map(ens => [ens.num_etudiant, ens.nom, ens.prenom, ens.mail, ens.role, ens.id_universite])]);
                
                // Préparation des données pour les insertions groupées des formations, UE et enseignants_UE
                for (const row of results) {
                    if (!formations.has(row.label_formation)) {
                        formations.set(row.label_formation, null); // Placeholder pour l'ID à récupérer après insertion
                    }
                    if (!ues.has(row.label_ue)) {
                        ues.set(row.label_ue, null); // Placeholder pour l'ID à récupérer après insertion
                    }
                    enseignantsUeValues.push([row.num_etudiant_enseignant, row.label_ue]); // Associer enseignant et UE
                }

                // Insertion des formations
                const formationValues = Array.from(formations.keys()).map(label => [label, idUniversite]);
                const [formationResult] = await db.query(`INSERT INTO formation (label, id_universite) VALUES ?`, [formationValues]);
                let formationIdStart = formationResult.insertId;
                formationValues.forEach(([label], index) => {
                    formations.set(label, formationIdStart + index);
                });

                // Insertion des UE
                const ueValues = Array.from(ues.keys()).map(label => [label]);
                const [ueResult] = await db.query(`INSERT INTO ue (label) VALUES ?`, [ueValues]);
                let ueIdStart = ueResult.insertId;
                ueValues.forEach(([label], index) => {
                    ues.set(label, ueIdStart + index);
                });

                // Préparer les données pour `formation_ue` et `enseignants_ue`
                formationUeValues.push(...Array.from(formations.entries()).flatMap(([formationLabel, formationId]) => {
                    return Array.from(ues.entries()).filter(([ueLabel]) => results.some(row => row.label_formation === formationLabel && row.label_ue === ueLabel))
                                                    .map(([ueLabel, ueId]) => [formationId, ueId]);
                }));
                enseignantsUeValues.forEach(([num_etudiant, ueLabel], index) => {
                    enseignantsUeValues[index] = [num_etudiant, ues.get(ueLabel)]; // Remplacer label UE par son ID
                });

                // Insertions finales pour les relations
                await db.query(`INSERT INTO formation_ue (formation_id_formation, ue_id_ue) VALUES ?`, [formationUeValues]);
                await db.query(`INSERT INTO enseignants_ue (num_etudiant, id_ue) VALUES ?`, [enseignantsUeValues]);

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
