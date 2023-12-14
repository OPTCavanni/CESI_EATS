import express from 'express';
import * as compteController from '../controllers/compteController';

const router = express.Router();

// Define routes
router.get('/get-all-users', compteController.getAllAccount);
router.get('/display-user', compteController.displayAccount);
router.put('/update-user', compteController.updateMyAccount);
router.put('/update-user-credential', compteController.updateMyCredentials);
router.delete('/delete-user', compteController.deleteMyModel);
router.post('/create-restaurant', compteController.createRestaurant);
router.get('/display-restaurant', compteController.displayRestaurant);

export default router;