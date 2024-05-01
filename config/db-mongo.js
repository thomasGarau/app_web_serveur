const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://thomasgarau8:yc69OYW1f4OBt17s@cluster0.tcen0pp.mongodb.net/attaque?retryWrites=true&w=majority';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, options);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

module.exports = connectDB;