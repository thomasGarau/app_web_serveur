const parseMultipartJson = (req, res, next) => {
    try {
        // Vérifie si le champ `data` est présent
        if (req.body && req.body.data) {
            try {
                // Parse le champ `data` en JSON
                const jsonData = JSON.parse(req.body.data);

                // Fusionne les données parsées avec le reste de req.body
                req.body = { ...req.body, ...jsonData };

                // Supprime le champ `data` après parsing
                delete req.body.data;

            } catch (error) {
                console.error('Erreur lors du parsing JSON de `data` :', error.message);
                return res.status(400).json({ message: 'Erreur de format JSON dans le champ `data`' });
            }
        }

        next(); // Passer au middleware suivant
    } catch (error) {
        console.error('Erreur dans parseMultipartJson :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

module.exports = {
    parseMultipartJson,
};
