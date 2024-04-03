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
const quizzRoute = require('./src/routes/quizz-routes')
const ueRoutes = require('./src/routes/ueRoutes')
const coursRoutes = require('./src/routes/coursRoutes')
const chatRoutes = require('./src/routes/chatRoutes')


app.use('/api/secure-page', securePageRoutes)
app.use('/api/user', userRoutes)
app.use('/api/quizz', quizzRoute)
app.use('/api/ue', ueRoutes)
app.use('/api/cours', coursRoutes)
app.use('/api/chat', chatRoutes)

