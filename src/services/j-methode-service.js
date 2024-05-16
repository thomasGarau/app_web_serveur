const Interaction = require('../models/interaction-modele');
const  {flaskAPI} = require('../../config/axiosConfig');
const db = require('../../config/database');

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
        const interactions = await Interaction.find({ userId: 998371 });
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
        const promises = data.map(async (item) => {
            const id_chapitre = item.id_chapitre;
            const DureeTotal = item.DureeTotal / 1000;
            const clicks = item.clicksMinute * DureeTotal / 60;
            const progression = item.chapitreProgression;
            const predictionData = { clicks, progression, note: 15 };
            const prediction = await flaskAPI.post('/predict', predictionData);
            return { id_chapitre, prediction: prediction.data[0]};
        });
        const results = await Promise.all(promises);

        const response = results.reduce((acc, { id_chapitre, prediction }) => {
            acc[id_chapitre] = prediction;
            return acc;
        }, {});

        const promises2 = Object.entries(response).map(async ([id_chapitre, prediction]) => {
            const item = { clicks: 330, progression: 80, note: 15 };
            const newPrediction = await flaskAPI.post('/predict', item);
            const tempsRestant = newPrediction.data[0] - prediction;
            return { id_chapitre, tempsEffectif: prediction, tempsNecessaire: newPrediction.data[0], tempsRestant };
        });

        const results2 = await Promise.all(promises2);

        const response2 = results2.reduce((acc, { id_chapitre, tempsEffectif, tempsNecessaire, tempsRestant }) => {
            acc[id_chapitre] = { tempsEffectif : tempsEffectif, tempsNecessaire, tempsRestant };
            return acc;
        }, {});

        return response2;
    } catch (error) {
        console.error('Error while fetching prediction:', error.response?.data || error.message);
        throw error;
    }
};

const creerCalendrier = async (id_utilisateur) => {
    try {
        const data = await getPrediction(id_utilisateur);
        const insertion = {};

        const promises2 = Object.entries(data).map(async ([id_chapitre, { tempsRestant }]) => {
            const [lastInteraction] = await Interaction.find({ userId: id_utilisateur, chapitre: id_chapitre }).sort({ timestamp: -1, limit: 1 });
            const lastRevisionDate = lastInteraction ? new Date(lastInteraction.timestamp) : new Date();

            const [rows] = await db.query('SELECT * FROM methode_des_j_chapitre WHERE id_utilisateur = ? AND id_chapitre = ? ORDER BY date DESC LIMIT 1', [id_utilisateur, id_chapitre]);
            const ecartPaterne = rows.length > 0 ? rows[0].ecart : 1;

            let newEcart;
            if (tempsRestant > 100) {
                newEcart = ecartPaterne - 1;
            } else if (tempsRestant > 50) {
                newEcart = ecartPaterne;
            } else {
                newEcart = ecartPaterne + 1;
            }

            newEcart = Math.max(newEcart, 1);

            const pattern = [1, 3, 5, 10, 30];
            const currentIndex = pattern.indexOf(ecartPaterne);
            const nextIndex = Math.min(currentIndex + (newEcart - ecartPaterne), pattern.length - 1);
            const nextRevisionEcart = pattern[nextIndex];

            const nextRevisionDate = new Date(lastRevisionDate);
            nextRevisionDate.setDate(nextRevisionDate.getDate() + nextRevisionEcart);

            const currentDate = new Date();
            if (nextRevisionDate < currentDate) {
                nextRevisionDate.setTime(currentDate.getTime());
            }

            insertion[id_chapitre] = nextRevisionDate;
            await db.query('INSERT INTO methode_des_j_chapitre (id_utilisateur, id_chapitre, date, ecart) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE date = VALUES(date), ecart = VALUES(ecart)', [id_utilisateur, id_chapitre, nextRevisionDate, nextRevisionEcart]);
        });

        await Promise.all(promises2);

        return insertion;
    } catch (error) {
        console.error('Error while creating calendar:', error);
        throw error;
    }
};




const getCalendrier = async (id_utilisateur) => {
    try {
        const [rows] = await db.query('SELECT * FROM methode_des_j_chapitre WHERE id_utilisateur = ?', [id_utilisateur]);
        const calendrier = rows.reduce((acc, { id_chapitre, date }) => {
            acc[id_chapitre] = date;
            return acc;
        }, {});

        return calendrier;
    } catch (error) {
        console.error('Error while fetching calendar:', error);
        throw error;
    }
}

module.exports = {
    ajouterSuivisActivite,
    getPrediction,
    creerCalendrier, 
    getCalendrier
};