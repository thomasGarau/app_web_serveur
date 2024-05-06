const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    dureeSession: {
        type: Number,
        required: true
    },
    chapitre : {
        type: Number,
        required: true
    },
    cours: {
        type: Number,
        required: true
    },
    clics: {
        type: Number,
        required: true,
        min: 0
    },
    scrolls: {
        type: Number,
        required: true,
        min: 0
    },
    progression: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
