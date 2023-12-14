import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import myModelRoutes from './routes/myModelRoutes';
import cors from 'cors';

import { Pool, PoolConfig, QueryResult } from 'pg';

const DB_USER = 'root';
const DB_PASSWORD = 'test';
const DB_NAME = 'postgres';
const DB_HOST = '10.145.128.140';
const DB_PORT = 5432;

const pool = new Pool({
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
});

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

export async function connectToDatabase(): Promise<Pool> {
  try {
    await pool.connect();
    console.log('Connected to the database successfully');
    return pool;
  } catch (error) {
    console.error('Error connecting to the database', error);
    throw error;
  }
}
  
export async function queryDatabase(query: string): Promise<QueryResult<any>> {
  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
}  


// Set JSON format for HTTP requests
app.use(express.json());

// Create endpoint
app.get('/', (req, res) => {res.status(200).json({ response: true });});
app.use('/', myModelRoutes);

// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log('Server is running...'));

export default app;
