// cours-config.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function(req, file, callback) {

        //chemin du dossier
        const dir = path.join(__dirname, '..', 'multer_cache');

        fs.mkdirSync(dir, { recursive: true });

        callback(null, dir);
    },
    filename: function(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        callback(null, filename);
    }
});

// Filtrage des fichiers pour accepter les types souhaités
const allowedTypes = ['application/pdf', 'video/mp4', 'video/avi', 'video/mpeg'];

const fileFilter = (req, file, callback) => {
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Type de fichier non supporté!'), false);
    }
};

const uploadCours = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploadCours;
