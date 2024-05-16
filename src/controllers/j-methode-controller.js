const jMethodeService = require('../services/j-methode-service');
const {getIdUtilisateurFromToken} = require('../services/user-service');
const {verifyUserConsentement} = require('../services/user-service');


exports.ajouterSuivisActivite = async (req, res) => {
    try {
        const data = req.body;
        const userId = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        if(await verifyUserConsentement(req.headers.authorization.split(' ')[1])){
            const timestamp = new Date();
            await jMethodeService.ajouterSuivisActivite(userId, timestamp, data);
            return res.status(200).send('Suivis activité ajouté');
        }else{
            res.status(401).send('Consentement utilisateur non valide');
            console.error('Consentement utilisateur non valide');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erreur serveur');
    }
}

exports.makePrediction = async (req, res) => {
    try {
        const id_utilisateur = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const prediction = await jMethodeService.getPrediction(id_utilisateur);
        res.status(200).json(prediction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.ajoutCalendrier = async (req, res) => {
    try {
        const data = req.body;
        const userId = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        if(await verifyUserConsentement(req.headers.authorization.split(' ')[1])){
            await jMethodeService.creerCalendrier(userId, data);
            return res.status(200).send('Calendrier ajouté');
        }else{
            res.status(401).send('Consentement utilisateur non valide');
            console.error('Consentement utilisateur non valide');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erreur serveur');
    }
};

exports.getCalendrier = async (req, res) => {
    try {
        const userId = await getIdUtilisateurFromToken(req.headers.authorization.split(' ')[1]);
        const calendrier = await jMethodeService.getCalendrier(userId);
        res.status(200).json(calendrier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};