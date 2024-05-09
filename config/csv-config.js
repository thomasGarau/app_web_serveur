// csvUpload.js
const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads/');  // Assurez-vous que ce dossier existe
    },
    filename: function(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtrage des fichiers pour accepter seulement les fichiers CSV
const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
        callback(null, true);
    } else {
        callback(new Error('Seuls les fichiers CSV sont autorisés!'), false);
    }
};

const uploadCSV = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploadCSV;
