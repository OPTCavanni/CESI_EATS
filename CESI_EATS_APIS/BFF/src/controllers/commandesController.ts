import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import { displayArticle } from './articlesController';
import { getToken, getUsername, getUserType } from '../services/services';
import Commande from '../models/commandeModel';
import { displayMenu, displayMenubyId } from './menusController';
import { displayRestaurant, getResto, getUser } from './compteController';

dotenv.config()

const commandes = process.env.COMMANDES_ADRESSE
const Menus = process.env.MENUS_ADRESSE
const articles = process.env.ARTICLES_ADRESSE

// Create
export const createCommande = async (req: Request, res: Response) => {
  const username = getUsername(req, res)
  const myModel = new Commande({
    id_menu: req.body.id_menu,
    id_restaurant: req.body.id_restaurant,
    username: username,
    status: req.body.status
  });
  try {
    const newCommande = await myModel.save();
    res.status(201).json(newCommande);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errMessage });
  }
};


// Get all
export const getAllCommandes= async (req: Request, res: Response) => {
  const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = commandes + 'get-all'
    console.log(adresse)
    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )

    const commande = data.data
    const list_menus = ((commande.id_menu != null) ? commande.id_menu : []) as Array<string>
    // Récupérer les articles associés au menu depuis l'API des articles
    const _menus: any[] = [];
    
    for (let index = 0; index < list_menus.length; index++) {
      const element = list_menus[index];
      const adresse = Menus + String(element);
      const menu = displayMenubyId(req, res, element)
      _menus.push(menu);
    }
    console.log(_menus)
    res.status(200).json(_menus)
    return _menus
}

// Get specific one
export const displayCommandebyId = async (req: Request, res: Response, id: string) => {
  const token = getToken(req, res);
  const bearer = 'Bearer ' + token;
  const adresse = commandes + 'get/' + id;
  const data = await axios.get(
      adresse,
      { headers: { 'Authorization': bearer } }
  );
  const commande = data.data;
  
  const list_menus = ((commande.id_menu != null) ? commande.id_menu : []) as Array<string>;
  
  // Récupérer les articles associés au menu depuis l'API des articles
  const _menus: any[] = [];
  
  for (let index = 0; index < list_menus.length; index++) {
    const element = list_menus[index];
    const adresse = Menus + String(element);
    const menu = await displayMenubyId(req, res, element);
    _menus.push(menu.menu.title);
  }
  console.log("menu: ", _menus[0])

  const user = (await getUser(req, res, commande.username))[0];
  const restaurant = (await getResto(req, res, commande.id_restaurant))[0];
  console.log("restaurant: ", restaurant)
  console.log("user: ",user)

  const mapped_username = user.p_nom + " " + user.p_prenom
  const mapped_adresse = user.p_adresse + ", " + user.p_pays

  const mapped_restaurant_adresse = restaurant.restaurants_adresse + ", " + restaurant.restaurants_pays

  const mapped_commande = {
    id_commande: commande._id,
    restaurant_nom: restaurant.restaurants_nom,
    restaurant_adresse: mapped_restaurant_adresse,
    client_username: mapped_username,
    client_adresse: mapped_adresse,
    status: commande.status,
    id_livreur: Number(commande.id_livreur),
    menus: _menus,
    created_at: commande.created_at
  }
  console.log("mapped_commande: ",mapped_commande)
  return mapped_commande
};

// Get all from restaurant
export const getAllCommandeFromRestaurant = async (req: Request, res: Response) => {
  try {
    console.log("CHARLES")
    const token = getToken(req, res);
    const bearer = 'Bearer ' + token;
    const id = req.params.id;
    const adresse = commandes + 'get-restaurant/' + id;
    const data = await axios.get(
      adresse,
      { headers: { 'Authorization': bearer } }
    );
    const commande = data.data
    console.log(commande)
    let _commandes = []
    for (let index = 0; index < commande.length; index++) {
      const element = commande[index].id_commande;
      const _data = displayCommandebyId(req, res, element)
      _commandes.push(data)
    }
    console.log(_commandes)
    res.status(200).send(_commandes)
    return _commandes
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
    return []
  }
};
/*
// Get historique
export const getHistorique = async (req: Request, res: Response) => {
  try {
    const username = getUsername(req, res)
    const type = getUserType(req, res)
    const id = req.params.id;
    const bearer = 'Bearer ' + (req.headers['authorization'] && req.headers['authorization'].split(' ')[1])

    let myModel: any;
    switch (type) {
      case "Client":
        myModel = await Commande.find({username: username});
        break;
      case "Restaurant":
        const data_resto = await pool.query('SELECT restaurants_id FROM public."restaurants" INNER JOIN public."user_login" ON public."user_login".user_fk_compte_id = public."restaurants".restaurants_fk_user_id WHERE (public."user_login".user_username LIKE $1)', [username])
        console.log(data_resto.rows[0].restaurants_id)
        myModel = await Commande.find({id_restaurant: data_resto.rows[0].restaurants_id});
        break;
      case "Livreur":
        const id_livreur = await pool.query('SELECT user_id FROM public."user_Compte" INNER JOIN public."user_login" ON public."user_login".user_fk_compte_id = public."user_Compte".user_id WHERE (public."user_login".user_username LIKE $1)', [username])
        console.log(id_livreur.rows[0].user_id)
        myModel = await Commande.find({id_livreur: id_livreur.rows[0].user_id});
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
*/
// Update menu
export const updateMenu = async (req: Request, res: Response) => {
  const token = getToken(req, res)
  const bearer = 'Bearer ' + token
  const id = req.params.id
  const adresse = commandes + id

  console.log(req.body)

  const data = await axios.put(
      adresse,
      { headers: { 'Authorization': bearer } },
      req.body
  )
};

// Delete
export const deleteMenu = async (req: Request, res: Response) => {
  const token = getToken(req, res)
  const bearer = 'Bearer ' + token
  const id = req.params.id
  const adresse = commandes + id

  console.log(req.body)

  const data = await axios.delete(
      adresse,
      { headers: { 'Authorization': bearer } }
  )
};