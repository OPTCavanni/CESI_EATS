// Import de modules TypeScript
import dotenv from 'dotenv';
import express from 'express';
import { Pool, PoolConfig, QueryResult } from 'pg';

// Import de modules personnalisés
import compteRoutes from './routes/compteRoutes';

// Mise en place de l'utilisation des variables d'environnements
dotenv.config();

// Définition des variables globales
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
});

const app = express();

const cors = require('cors')

app.use(cors());

/*********************/
/* Méthodes globales */ 
/*********************/

// Connect to MongoDB
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

// Création des endpoint
app.get('/', (req, res) => {res.status(200).json({ response: true });});
app.use('/', compteRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running...'));

export default app;