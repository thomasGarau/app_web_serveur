const fs = require('fs');
const csv = require('csv-parser');
const db = require('../../config/database');

const CreateUsersFromCSV = async (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                const values = results.map(user => [
                    user.num_etudiant,
                    user.nom,
                    user.prenom,
                    user.mail_utilisateur,
                    user.role,
                    user.id_universite,
                    user.date_naissance
                ]);

                if (values.length > 0) {
                    const query = `
                        INSERT INTO utilisateur_valide 
                        (num_etudiant, nom, prenom, mail_utilisateur, role, id_universite, date_naissance) 
                        VALUES ?`;

                    try {
                        await db.query(query, [values]);
                        resolve('Tous les utilisateurs ont été ajoutés avec succès.');
                    } catch (error) {
                        console.error('Erreur lors de l\'insertion des utilisateurs:', error);
                        reject(error);
                    }
                } else {
                    resolve('Aucune donnée à insérer.');
                }
            });
    });
};

module.exports = {
    CreateUsersFromCSV
}
