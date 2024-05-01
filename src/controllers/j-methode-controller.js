const jMethodeService = require('../services/j-methode-service');
const {getIdUtilisateurFromToken} = require('../services/user-service');


exports.ajouterSuivisActivite = async (req, res) => {
    try {
        const data = req.body;
        const userId = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const timestamp = new Date();
        await jMethodeService.ajouterSuivisActivite(userId, timestamp, data);
        return res.status(200).send('Suivis activité ajouté');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erreur serveur');
    }
}