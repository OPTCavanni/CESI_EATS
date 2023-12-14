import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import myModelRoutes from './routes/myModelRoutes';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());

const username = 'root';
const password = 'test';
const dbName = 'test'; // Remplacez ceci par le nom de votre base de données
const dbHost = '10.145.128.140:27017'; // Remplacez ceci par l'hôte de votre base de données (adresse IP ou nom de domaine)

// Construction de la chaîne de connexion
const mongoURI = `mongodb://${username}:${password}@${dbHost}/`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } as any)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((error) => console.log('Failed to connect to MongoDB.', error));

// Set JSON format for HTTP requests
app.use(express.json());

// Create endpoint
app.get('/', (req, res) => {res.status(200).json({ response: true });});
app.use('/', myModelRoutes);

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log('Server is running...'));

export default app;
