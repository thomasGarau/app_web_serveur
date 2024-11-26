const { storage } = require('../../config/cloudinaryConfig');
const multer = require('multer');

const upload = multer({ storage: storage });

// Fonction pour gérer le téléchargement d'image
async function uploadImage(req, res, next) {

    // Sauvegarder les données de req.body avant que Multer ne réanalyse
    const savedBody = { ...req.body };

    const uploadSingle = upload.single('path');

    uploadSingle(req, res, function (error) {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }

        // Fusionner le req.body initial avec le req.body ré-analysé par Multer
        req.body = { ...savedBody, ...req.body };

        next();
    });
}

module.exports = {
    uploadImage,
};
