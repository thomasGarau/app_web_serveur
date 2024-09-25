// cours-middleware.js
const uploadCours = require('../../config/cours-config');
const db = require('../../config/database');

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
        const { id_chapitre } = req.body;
        if (!id_chapitre) {
            return res.status(400).send('id_chapitre est requis');
        }

        const [rows] = await db.query('SELECT id_ue FROM chapitre WHERE id_chapitre = ?', [id_chapitre]);
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

function determineCourseType(req, res, next) {
    try {
        const file = req.file;
        const { link } = req.body;

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

            req.courseType = type;
            req.coursePath = path.relative(path.join(__dirname, '..', '..'), file.path);
        } else if (link) {
            // Fonction pour déterminer le type de lien (yt ou non)
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
