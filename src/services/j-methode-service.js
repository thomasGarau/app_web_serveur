const Interaction = require('../models/interaction-modele');

const ajouterSuivisActivite = async (userId, timestamp, data) => {
    const interactionData = {
        userId: userId,
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