const quizzService = require('../services/quizz-service');

exports.getQuizzForUe = ((req, res) => {
    try{
        const {ue} = req.body;
        const quizz = quizzService.getQuizzForUe(ue);
        res.status(200).send(quizz);
    }catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des quizz');
    }
});