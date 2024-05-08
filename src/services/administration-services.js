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

const createFormation = async (filePath) => {
    return true
}

module.exports = {
    createFormation,
    CreateUsersFromCSV,
    getUniversiteFromUser
}
