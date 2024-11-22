const axios = require('axios');
const TOKEN = process.env.FLASK_TOKEN;

const flaskAPI = axios.create({
    baseURL: 'http://127.0.0.1:5000/',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': TOKEN
    }
});

module.exports = { flaskAPI };