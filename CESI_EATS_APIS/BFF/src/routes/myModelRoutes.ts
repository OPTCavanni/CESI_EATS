import express from 'express';
import { authorize } from '../middleware';
import * as compte from '../controllers/compteController';
import * as articles from '../controllers/articlesController';
import * as menus from '../controllers/menusController';
import * as commandes from '../controllers/commandesController'

const router = express.Router();

/*****************/
/* Define routes */
/*****************/

// Compte routes
// Post
router.post('/create-restaurant', authorize(['Restaurant']), compte.createRestaurant);

// Get
router.get('/get-all-users', compte.getAllUsers)
router.get('/display-user', authorize(['Client', 'Restaurant', 'Livreur']), compte.displayUser);
router.get('/display-restaurant', authorize(['Restaurant']), compte.displayRestaurant);

// Put
router.put('/update-user', authorize(['Client', 'Restaurant', 'Livreur']), compte.updateMyAccount);
router.put('/update-user-credentials', authorize(['Client', 'Restaurant', 'Livreur']), compte.updateMyCredentials);
router.put('/update-restaurant', authorize(['Restaurant']), compte.updateRestaurant);

// Delete
router.delete('/delete-user', authorize(['Client', 'Restaurant', 'Livreur']), compte.deleteMyModel);
router.delete('/delete-restaurant', authorize(['Restaurant']), compte.deleteRestaurant)


// Articles routes
// Post
router.post('/create-article', authorize(['Restaurant']), articles.createArticle);

// Get
router.get('/article/:id', authorize(['Client', 'Restaurant', 'Livreur']), articles.displayArticle)
router.get('/restaurant-articles/:id', authorize(['Client', 'Restaurant', 'Livreur']), articles.displayRestaurantArticles)

// Put
router.put('/article/:id', authorize(['Restaurant']), articles.updateArticle);

// Delete
router.delete('/article/:id', authorize(['Restaurant']), articles.deleteArticle);


// Menus routes
// Post
router.post('/create-menu', authorize(['Restaurant']), menus.createMenu);

// Get
router.get('/menu/:id', authorize(['Client', 'Restaurant', 'Livreur']), menus.displayMenu)
router.get('/restaurant-menus/:id', authorize(['Client', 'Restaurant', 'Livreur']), menus.displayRestaurantMenus)
router.get('/menu/get-all', authorize(['Client', 'Restaurant', 'Livreur']), menus.displayAllMenus)

// Put
router.put('/menu/:id', authorize(['Restaurant']), menus.updateMenu);

// Delete
router.delete('/menu/:id', authorize(['Restaurant']), menus.deleteMenu);


// Commandes routes
// Post
router.post('/create-commande', authorize(['Client']), menus.createMenu);

// Get
router.get('/restaurant-commande/:id', authorize(['Client', 'Restaurant', 'Livreur']), commandes.getAllCommandeFromRestaurant)

// Put
router.put('/commande/:id', authorize(['Client']), menus.updateMenu);

export default router;