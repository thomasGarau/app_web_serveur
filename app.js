const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//pour eviter les erreur cors lors de reqûete effectuer depuis le front
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());

const userRoutes = require('./src/routes/userRoutes')
const securePageRoutes = require('./src/routes/secure-page-Routes')
app.use('/api/secure-page', securePageRoutes)
app.use('/api/user', userRoutes)