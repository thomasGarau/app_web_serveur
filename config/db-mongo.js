const mongoose = require('mongoose');
const env = require('dotenv');

const dbURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

module.exports = connectDB;