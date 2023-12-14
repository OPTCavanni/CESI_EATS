import dotenv from 'dotenv';
import express from 'express';
import myModelRoutes from './routes/myModelRoutes';

dotenv.config();
const app = express();

// Set JSON format for HTTP requests
app.use(express.json());

// Create endpoint
app.get('/', (req, res) => {res.status(200).json({ response: true });});
app.use('/', myModelRoutes);

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log('Server is running...'));

export default app;