// cours-middleware.js
const uploadCours = require('../../config/cours-config');
const db = require('../../config/database');
const path = require('path');
const fs = require('fs').promises;

function uploadCoursFile(req, res, next) {
    const uploadSingle = uploadCours.single('file');

    uploadSingle(req, res, function (error) {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }

        next();
    });
}

async function fetchIdUe(req, res, next) {
    try {
        const { chapitre } = req.body;
        if (!chapitre) {
            return res.status(400).send('chapitre est requis');
        }

        const [rows] = await db.query('SELECT id_ue FROM chapitre WHERE id_chapitre = ?', [chapitre]);
        if (rows.length === 0) {
            return res.status(404).send('Chapitre non trouvé');
        }
        req.id_ue = rows[0].id_ue;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de id_ue');
    }
}
async function determineCourseType(req, res, next) {
    try {
        const file = req.file;
        const { link, chapitre } = req.body;
        const id_ue = req.id_ue;
        req.label = req.file.originalname;

        if (file) {
            const extension = path.extname(file.originalname).toLowerCase();

            const extensionToType = {
                '.pdf': 'pdf',
                '.mp4': 'video',
                '.avi': 'video',
                '.mpeg': 'video',
                '.mov': 'video',
                '.wmv': 'video',
            };

            const type = extensionToType[extension] || 'telechargeable';

            // Définir le chemin du dossier de destination
            const destDir = path.join(__dirname, '..', '..', 'cours', `ue_${id_ue}`, `chapitre_${chapitre}`);

            // Créer le dossier de destination s'il n'existe pas
            await fs.mkdir(destDir, { recursive: true });

            // Définir le chemin complet du fichier de destination
            const destPath = path.join(destDir, file.filename);

            // Déplacer le fichier du dossier tampon vers le dossier de destination
            const srcPath = file.path; // Chemin du fichier dans le dossier tampon
            await fs.rename(srcPath, destPath);

            req.courseType = type;
            req.coursePath = path.relative(path.join(__dirname, '..', '..', '..'), destPath);
        } else if (link) {
            // Fonction pour déterminer le type de lien (YouTube ou autre)
            const getLinkType = (url) => {
                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
                return youtubeRegex.test(url) ? 'youtube' : 'lien';
            };

            const type = getLinkType(link);

            req.courseType = type;
            req.coursePath = link;
        } else {
            return res.status(400).send('Aucun fichier ou lien n\'a été fourni.');
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la détermination du type de cours');
    }
}

module.exports = {
    uploadCoursFile,
    fetchIdUe,
    determineCourseType
};
