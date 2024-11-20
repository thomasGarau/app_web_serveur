const analyse = async(userAnswer, flashcardAnswer) => {
    try{
        return "juste";
    }catch(err){
        console.error(err);
        throw new Error('Erreur dans l\'analyse de la réponse');
    }
}

module.exports = { analyse };