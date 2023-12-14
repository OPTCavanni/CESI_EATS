import express from 'express';
import * as myModelController from '../controllers/myModelController';

const router = express.Router();

// Define routes
router.get('/get-all', myModelController.getAllMyMenus);
router.get('/:id', myModelController.getMyMenu);
router.get('/get/:id', myModelController.getMenu);
router.get('/get-menu/:id', myModelController.getAllRestaurantMenus)
router.post('/create-menu', myModelController.createMenu);
router.put('/:id', myModelController.updateMenu);
router.delete('/:id', myModelController.deleteMenu);

export default router;
