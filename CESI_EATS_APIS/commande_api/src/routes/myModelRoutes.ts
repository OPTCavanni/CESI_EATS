// Import des modules TypeScript
import express from 'express';

// Import des modules personnalisés
import * as myModelController from '../controllers/myModelController';

// Déclaration des variables globales   
const router = express.Router();

// Define routes
router.get('/get-all', myModelController.getAllMyModels);
router.get('/get/:id', myModelController.getMyModel);
router.get('/get-restaurant/:id', myModelController.getAllFromRestaurant);
router.get('/get-livreur', myModelController.getAllForLivreur);
router.get('/historique', myModelController.getHistorique);
router.get('/display/:id', myModelController.displayModel);
router.post('/create-commande', myModelController.createMyModel);
router.put('/:id', myModelController.updateMyModel);
router.delete('/:id', myModelController.deleteMyModel);

export default router;
