const axios = require('axios');
const TOKEN = process.env.FLASK_TOKEN;

const flaskAPI = axios.create({
    baseURL: 'http://localhost:5000/ia',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': TOKEN
    }
});

module.exports = { flaskAPI };