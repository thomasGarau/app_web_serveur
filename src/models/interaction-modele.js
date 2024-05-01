const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    dureeSession: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    cours: {
        type: String,
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
