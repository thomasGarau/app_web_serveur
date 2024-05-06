// Middleware pour le téléchargement de fichiers CSV
const uploadCSV = require('../../config/csv-config');

function uploadCSVFile(req, res, next) {
    const uploadSingle = uploadCSV.single('file');

    uploadSingle(req, res, function (error) {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
        // Continuer avec la requête après un téléchargement réussi
        next();
    });
}

module.exports = {
    uploadCSVFile
};