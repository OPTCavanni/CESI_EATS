import express from 'express';
import * as myModelController from '../controllers/myModelController';

const router = express.Router();

// Define routes
router.get('/get-all', myModelController.getAllMyModels);
router.get('/get/:id', myModelController.getArticleRestaurant);
router.get('/:id', myModelController.getArticle)
router.post('/create-article', myModelController.createMyModel);
router.put('/:id', myModelController.updateMyModel);
router.delete('/:id', myModelController.deleteMyModel);

export default router;
