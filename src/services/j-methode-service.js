const ajouterSuivisActivite = async (userId, timestamp, data) => {
    const dureeSession = datafinSuivis - data.debutSuivis;
    const interactionData = {
        userId: userId,
        dureeSession: dureeSession,
        timestamp: timestamp,
        ...data,
    };

    return true;
}

module.exports = {
    ajouterSuivisActivite
};