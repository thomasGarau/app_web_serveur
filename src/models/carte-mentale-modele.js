const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    color: { type: String, match: /^#(?:[0-9a-fA-F]{3}){1,2}$/, required: true },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }
});

const EdgeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    sourceHandle: { type: String, default: null },
    targetHandle: { type: String, default: null }
});

const CarteMentaleSchema = new mongoose.Schema({
    id_carte_mentale: { type: Number, required: true, unique: true }, // ID pour correspondre à la BDD relationnelle
    details: {
        nodes: { type: [NodeSchema], required: true },
        edges: { type: [EdgeSchema], required: true }
    }
});

module.exports = mongoose.model("CarteMentale", CarteMentaleSchema, "carte_mentale"); // 'carte_mentale' est le nom de la collection
