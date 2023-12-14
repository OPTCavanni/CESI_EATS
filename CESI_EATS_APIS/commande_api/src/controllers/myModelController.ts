// Import des modules de TypeScript
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Pool, PoolConfig, QueryResult } from 'pg';
import axios from 'axios';
import { Schema } from 'mongoose';

// Import des modules personnalisés
import MyModel from '../models/myModel';

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
const JWT_SECRET = 'vivement_ce_soir_FF';

/****************************/
/* Déclaration des méthodes */
/****************************/

// Get all
export const getAllMyModels = async (req: Request, res: Response) => {
  try {
    console.log("ta mère pav")
    const myModels = await MyModel.find();
    res.status(200).json(myModels);
  } catch (err) {
    console.log("ça pue")
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Get specific one
export const getMyModel = async (req: Request, res: Response) => {
  try {
    const myModel = await MyModel.findById(req.params.id);
    if (myModel == null) {
      return res.status(404).json({ message: 'Cannot find myModel' });
    }
    res.status(200).json(myModel);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Get all from restaurant
export const getAllFromRestaurant = async (req: Request, res: Response) => {
  console.log("Oue")
  try {
    const id = req.params.id;
    console.log(id)
    const bearer = 'Bearer ' + (req.headers['authorization'] && req.headers['authorization'].split(' ')[1])
    const models = (await MyModel.find({ id_restaurant: id, status: ["En attente", "En cours"] })) as Array<any>;
    if (models.length == 0) {
      res.status(404).json({ message: 'Cannot find myModel' });
      return []
    }
    console.log(models)
    let commandes = [];
    for (let index = 0; index < models.length; index++) {
      const commande = models[index];
      const menus = models[index].id_menu;
      const mapped_menus = [];
      for (let index = 0; index < menus.length; index++) {
        const element = menus[index];
        const adresse = 'http://localhost:8000/menus/get/' + element
        const menu = await axios.get(
          adresse, 
          { headers: { 'Authorization': bearer } }
        )
        mapped_menus.push(menu.data.title)
      }
      const user_data = await pool.query('SELECT user_nom, user_prenom, user_adresse, user_pays FROM public."user_Compte" INNER JOIN public."user_login" ON public."user_login".user_fk_compte_id = public."user_Compte".user_id WHERE (public."user_login".user_username LIKE $1)', [commande.username])
      console.log(user_data.rows[0])
      const mapped_username = user_data.rows[0].user_nom + " " + user_data.rows[0].user_prenom
      const mapped_adresse = user_data.rows[0].user_adresse + " " + user_data.rows[0].user_pays
      const restaurant_data = await pool.query('SELECT restaurants_nom, restaurants_adresse, restaurants_pays FROM public."restaurants" WHERE (public."restaurants".restaurants_id = $1)', [commande.id_restaurant])
      console.log(restaurant_data.rows[0])
      const mapped_restaurant_adresse = restaurant_data.rows[0].restaurants_adresse + " " + restaurant_data.rows[0].restaurants_pays
      const displayedCommand = {
        id_commande: commande._id,
        restaurant_nom: restaurant_data.rows[0].restaurants_nom,
        restaurant_adresse: mapped_restaurant_adresse,
        client_username: mapped_username,
        client_adresse: mapped_adresse,
        status: commande.status,
        menus: mapped_menus
      }
      console.log(displayedCommand)
      commandes.push(displayedCommand)
    }
    console.log(commandes)
    res.json(commandes)
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
    return []
  }
};

// Get all from restaurant
export const getAllForLivreur = async (req: Request, res: Response) => {
  console.log("prout")
  try {
    const token = (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
    const Payload = jwt.verify(String(token), JWT_SECRET) as JwtPayload;
    const username = Payload.username;
    const id = (await pool.query('SELECT user_id FROM public."user_Compte" INNER JOIN public."user_login" ON public."user_login".user_fk_compte_id = public."user_Compte".user_id WHERE (public."user_login".user_username LIKE $1)', [username])).rows[0].user_id;
    console.log(id)
    const bearer = 'Bearer ' + token
    const models = (await MyModel.find({ id_livreur: [id, 53], status: ["En attente livraison", "En livraison"] })) as Array<any>;
    if (models.length == 0) {
      res.status(404).json({ message: 'Cannot find myModel' });
      return []
    }
    let commandes = [];
    for (let index = 0; index < models.length; index++) {
      const commande = models[index];
      const menus = models[index].id_menu;
      const mapped_menus = [];
      console.log(commande)
      for (let index = 0; index < menus.length; index++) {
        const element = menus[index];
        const adresse = 'http://localhost:8000/menus/get/' + element
        console.log(mapped_menus)
        const menu = await axios.get(
          adresse, 
          { headers: { 'Authorization': bearer } }
        )
        mapped_menus.push(menu.data.title)
      }
      console.log(1)
      const user_data = await pool.query('SELECT user_nom, user_prenom, user_adresse, user_pays FROM public."user_Compte" INNER JOIN public."user_login" ON public."user_login".user_fk_compte_id = public."user_Compte".user_id WHERE (public."user_login".user_username LIKE $1)', [commande.username])
      console.log(user_data.rows[0])
      const mapped_username = user_data.rows[0].user_nom + " " + user_data.rows[0].user_prenom
      const mapped_adresse = user_data.rows[0].user_adresse + " " + user_data.rows[0].user_pays
      const restaurant_data = await pool.query('SELECT restaurants_nom, restaurants_adresse, restaurants_pays FROM public."restaurants" WHERE (public."restaurants".restaurants_id = $1)', [commande.id_restaurant])
      console.log(restaurant_data.rows[0])
      const mapped_restaurant_adresse = restaurant_data.rows[0].restaurants_adresse + " " + restaurant_data.rows[0].restaurants_pays
      const displayedCommand = {
        id_commande: commande._id,
        restaurant_nom: restaurant_data.rows[0].restaurants_nom,
        restaurant_adresse: mapped_restaurant_adresse,
        client_username: mapped_username,
        client_adresse: mapped_adresse,
        status: commande.status,
        id_livreur: Number(commande.id_livreur),
        menus: mapped_menus
      }
      console.log("Commandes")
      console.log(displayedCommand)
      commandes.push(displayedCommand)
    }
    console.log(commandes)
    res.json(commandes)
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
    return []
  }
};

// Get historique
export const getHistorique = async (req: Request, res: Response) => {
  try {
    const userData = getUserInfo(req, res)
    const bearer = 'Bearer ' + (req.headers['authorization'] && req.headers['authorization'].split(' ')[1])

    let myModel: any;
    switch (userData.type) {
      case 1:
        myModel = await MyModel.find({username: userData.user});
        break;
      case 2:
        const data_resto = await pool.query('SELECT restaurants_id FROM public."restaurants" INNER JOIN public."user_login" ON public."user_login".user_fk_compte_id = public."restaurants".restaurants_fk_user_id WHERE (public."user_login".user_username LIKE $1)', [userData.user])
        console.log(data_resto.rows[0].restaurants_id)
        myModel = await MyModel.find({id_restaurant: data_resto.rows[0].restaurants_id});
        break;
      case 3:
        const id_livreur = await pool.query('SELECT user_id FROM public."user_Compte" INNER JOIN public."user_login" ON public."user_login".user_fk_compte_id = public."user_Compte".user_id WHERE (public."user_login".user_username LIKE $1)', [userData.user])
        console.log(id_livreur.rows[0].user_id)
        myModel = await MyModel.find({id_livreur: id_livreur.rows[0].user_id});
        console.log("historique")
        console.log(myModel)
        break;
      default:
        return res.status(404).json({ message: 'Cannot find myModel' });
    }
    if (myModel == null) {
      return res.status(404).json({ message: 'Cannot find myModel' });
    }
    console.log(myModel)
    let commandes = [];
    for (let index = 0; index < myModel.length; index++) {
      const commande = myModel[index];
      const menus = myModel[index].id_menu;
      const mapped_menus = [];
      for (let index = 0; index < menus.length; index++) {
        const element = menus[index];
        const adresse = 'http://localhost:8000/menus/get/' + element
        const menu = await axios.get(
          adresse, 
          { headers: { 'Authorization': bearer } }
        )
        mapped_menus.push(menu.data.title)
      }
      const id_livreur = ((commande.id_livreur == undefined) ? 0 : commande.id_livreur)
      const user_data = await pool.query('SELECT user_nom, user_prenom, user_adresse, user_pays FROM public."user_Compte" INNER JOIN public."user_login" ON public."user_login".user_fk_compte_id = public."user_Compte".user_id WHERE (public."user_login".user_username LIKE $1)', [commande.username])
      console.log(user_data.rows[0])
      const mapped_username = user_data.rows[0].user_nom + " " + user_data.rows[0].user_prenom
      const mapped_adresse = user_data.rows[0].user_adresse + " " + user_data.rows[0].user_pays
      const restaurant_data = await pool.query('SELECT restaurants_nom, restaurants_adresse, restaurants_pays FROM public."restaurants" WHERE (restaurants_id = $1)', [commande.id_restaurant])
      const mapped_restaurant_adresse = restaurant_data.rows[0].restaurants_adresse + " " + restaurant_data.rows[0].restaurants_pays
      const displayedCommand = {
        id_commande: commande._id,
        restaurant_nom: restaurant_data.rows[0].restaurants_nom,
        restaurant_adresse: mapped_restaurant_adresse,
        client_username: mapped_username,
        client_adresse: mapped_adresse,
        status: commande.status,
        id_livreur: Number(commande.id_livreur),
        menus: mapped_menus,
        created_at: commande.created_at
      }
      console.log(displayedCommand)
      commandes.push(displayedCommand)
    }
    console.log(commandes)
    res.json(commandes)
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    return res.status(500).json({ message: errMessage });
  }
};

// Get Username

function getUserInfo(req: Request, res: Response): { user: string; type: number } {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null){
    res.sendStatus(401);
    return {user: '', type: 0}
  } 
  try {
    const payload = jwt.verify(token, JWT_SECRET)

    const user = payload as JwtPayload;

    console.log(user.username, user.p_log);

    if (!user.username){
      res.sendStatus(403);
      return {user: '', type: 0}
    } 

    return {user: user.username, type: user.p_log}
  } catch (error) {
    console.error(error)
    return {user: '', type: 0}
  }
}

// Create
export const createMyModel = async (req: Request, res: Response) => {
  const username = getUserInfo(req, res).user
  const myModel = new MyModel({
    id_menu: req.body.id_menu,
    id_restaurant: req.body.id_restaurant,
    username: username,
    status: req.body.status
  });
  try {
    const newMyModel = await myModel.save();
    res.status(201).json(newMyModel);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errMessage });
  }
};

// Display Commande
export const displayModel = async (req: Request, res: Response) => {
  try {
    // Récupérer le menu depuis MongoDB
    const commande = await MyModel.findById(req.params.id);
    console.log(commande)

    if (!commande) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.status(200).json({commande: commande});//, articles: articles});
    return commande;
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Update
export const updateMyModel = async (req: Request, res: Response) => {
  try {
    const token = (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
    const Payload = jwt.verify(String(token), JWT_SECRET) as JwtPayload;
    const username = Payload.username;
    let id: string | null;
    if (Payload.p_log == 3) {
      id = String((await pool.query('SELECT user_id FROM public."user_Compte" INNER JOIN public."user_login" ON public."user_login".user_fk_compte_id = public."user_Compte".user_id WHERE (public."user_login".user_username LIKE $1)', [username])).rows[0].user_id);
    } else {
      id = null;
    }
    
    const mapped_body = {
      status: req.body.status,
      id_livreur: id
    }
    const updatedMyModel = await MyModel.findByIdAndUpdate(req.params.id, mapped_body, { new: true });
    console.log(updatedMyModel)
    res.status(200).json(updatedMyModel);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errMessage });
  }
};

// Delete
export const deleteMyModel = async (req: Request, res: Response) => {
  try {
    await MyModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'MyModel deleted' });
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};
