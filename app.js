const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db-mongo')

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//pour eviter les erreur cors lors de reqûete effectuer depuis le front
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());

connectDB()

const userRoutes = require('./src/routes/userRoutes')
const quizzRoute = require('./src/routes/quizz-routes')
const ueRoutes = require('./src/routes/ueRoutes')
const coursRoutes = require('./src/routes/coursRoutes')
const chatRoutes = require('./src/routes/chatRoutes')
const jMethodeRoutes = require('./src/routes/j-methode-routes')
const administrationRoutes = require('./src/routes/administration-routes')
const flashcardRoutes = require('./src/routes/flashcard-routes')

app.use('/api/user', userRoutes)
app.use('/api/quizz', quizzRoute)
app.use('/api/ue', ueRoutes)
app.use('/api/cours', coursRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/jMethode', jMethodeRoutes)
app.use('/api/administration', administrationRoutes)
app.use('/api/flashcard', flashcardRoutes)
