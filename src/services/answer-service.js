const  {flaskAPI} = require('../../config/axiosConfig');

const analyse = async(flashcardAnswer, userAnswer) => {
    try{
        const reponse = await flaskAPI.post('/mistral/analyse', {
            userAnswer,
            flashcardAnswer
        });
        return reponse.data;
    }catch(err){
        console.error(err);
        throw new Error('Erreur dans l\'analyse de la réponse');
    }
}

module.exports = { analyse };