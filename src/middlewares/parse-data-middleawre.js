const multipartUpload = require('../../config/multipartDataConfig');

// Middleware combiné pour gérer multipart et JSON
const parseMultipartJson = (req, res, next) => {
    // Utiliser multer pour gérer les champs texte
    multipartUpload.fields([])(req, res, (err) => {
        if (err) {
            console.error('Erreur lors du traitement multipart :', err);
            return res.status(400).json({ message: 'Erreur lors du traitement des données multipart' });
        }

        try {
            // Récupérer et parser le champ JSON "data"
            if (req.body.data) {
                const jsonData = JSON.parse(req.body.data);
                req.body = { ...req.body, ...jsonData }; // Fusionner les champs texte avec le JSON parsé
            }

            next(); // Passer au middleware suivant
        } catch (error) {
            console.error('Erreur lors de la conversion du JSON multipart :', error.message);
            res.status(400).json({ message: 'Erreur de format JSON' });
        }
    });
};

module.exports = {
    parseMultipartJson,
};
