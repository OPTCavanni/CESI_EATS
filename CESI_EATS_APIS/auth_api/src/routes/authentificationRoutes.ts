// Import de modules TypeScript
import express from 'express';

// Import de modules personnalisés
import * as authentificationControllers from '../controllers/authentificationControllers';

// Déclaration des variables globales
const router = express.Router();

// Define routes
router.post('/create-user', authentificationControllers.createUser);
router.post('/login', authentificationControllers.login);
router.post('/refresh', authentificationControllers.refresh);
router.get('/get-type', authentificationControllers.sendUserType);

export default router;
