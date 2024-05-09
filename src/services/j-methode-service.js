const Interaction = require('../models/interaction-modele');
const  {flaskAPI} = require('../../config/axiosConfig');

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

async function preparePredictionData(id_utilisateur) {
    try {
        const interactions = await Interaction.find({ userId: id_utilisateur });
        const user_data = {};

        interactions.forEach((item) => {
            if (!item.chapitre) {
                console.error('Missing chapitre for item:', item);
                return; 
            }

            const user_chap_key = `${item.userId}_${item.chapitre}`;

            if (!user_data[user_chap_key]) {
                user_data[user_chap_key] = {
                    DureeTotal: 0,
                    totalScrolls: 0,
                    totalClicks: 0,
                    coursProgression: {},
                };
            }

            const data = user_data[user_chap_key];
            data.DureeTotal += item.dureeSession;
            data.totalScrolls += item.scrolls;
            data.totalClicks += item.clics;

            if (data.coursProgression[item.cours]) {
                data.coursProgression[item.cours] = Math.max(data.coursProgression[item.cours], item.progression);
            } else {
                data.coursProgression[item.cours] = item.progression;
            }
        });

        const clean_data = Object.entries(user_data).map(([key, values]) => {
            const [userId, chapitreString] = key.split('_');
            const chapitre = parseInt(chapitreString, 10);
            if (!Number.isFinite(chapitre)) {
                console.error('Invalid chapitre found:', chapitreString);
                return null;
            }

            const coursProgressions = Object.entries(values.coursProgression).map(([cours, progression]) => ({
                cours,
                progression
            }));

            const chapitreProgression = coursProgressions.reduce((acc, curr) => acc + curr.progression, 0) / coursProgressions.length;

            return {
                id_utilisateur: parseInt(userId, 10),
                id_chapitre: chapitre,
                DureeTotal: values.DureeTotal,
                scrollMinute: values.totalScrolls * 60000 / values.DureeTotal,
                clicksMinute: values.totalClicks * 60000 / values.DureeTotal,
                coursProgressions,
                chapitreProgression
            };
        }).filter(x => x != null); // Filtrer les données nulles

        return clean_data;
    } catch (error) {
        console.error('Error while preparing prediction data:', error);
        throw error;
    }
}


const getPrediction = async (id_utilisateur) => {
    try {
        const data = await preparePredictionData(id_utilisateur);
        data.forEach((item) => {
            const id_chapitre = item.id_chapitre;
            DureeTotal = item.DureeTotal;
            clicks = item.clicksMinute * DureeTotal / 60000;
            progression = item.chapitreProgression;
            const predictionData = []
        });
        const response = await flaskAPI.post('/predict', data);
        return response.data;
    } catch (error) {
        console.error('Error while fetching prediction:', error.response?.data || error.message);
        throw error;
    }
};


module.exports = {
    ajouterSuivisActivite,
    getPrediction,
};