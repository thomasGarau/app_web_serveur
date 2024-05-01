const Interaction = require('../models/interaction-modele');

const ajouterSuivisActivite = async (userId, timestamp, data) => {
    const dureeSession = data.finSuivis - data.debutSuivis;
    const interactionData = {
        userId: userId,
        dureeSession: dureeSession,
        timestamp: timestamp,
        ...data,
    };
    const interaction = new Interaction(interactionData);
    await interaction.save();

    return true;
}

module.exports = {
    ajouterSuivisActivite
};