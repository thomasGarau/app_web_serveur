const multer = require('multer');

// Configuration pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

// Définir des limites pour le téléversement
const limits = {
    fileSize: 5 * 1024 * 1024  // 5MB
};

// Créer une instance Multer pour gérer fichiers et champs texte
const multipartUpload = multer({

});

module.exports = multipartUpload; // Export de l'instance Multer
