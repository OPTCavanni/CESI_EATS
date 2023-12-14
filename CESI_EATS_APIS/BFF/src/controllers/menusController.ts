import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import { displayArticle, displayArticlebyId } from './articlesController';
import { getToken, getUsername } from '../services/services'

dotenv.config();

const Menus = process.env.MENUS_ADRESSE;
const articles = process.env.ARTICLES_ADRESSE;

// Create menu
export const createMenu = async (req: Request, res: Response) => {
    const token = getToken(req, res);
    const bearer = 'Bearer ' + token;
    const adresse = Menus + 'create-menu';

    console.log(req.body);

    const data = await axios.post(
        adresse,
        { headers: { 'Authorization': bearer } }
    );
};

// Display one
export const displayMenu = async (req: Request, res: Response) => {
    const token = getToken(req, res);
    const bearer = 'Bearer ' + token;
    const id = req.params.id;
    const adresse = Menus + 'get/' + id;
    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    );
    console.log(data.data)
    const menu = data.data;
    const list_articles = ((menu.id_article != null) ? menu.id_article : []) as Array<string>;

    // Récupérer les articles associés au menu depuis l'API des articles
    const _articles: any[] = [];
    
    for (let index = 0; index < list_articles.length; index++) {
      const element = list_articles[index];
      const adresse = articles + String(element);
      const article = await displayArticlebyId(req, res, element)
      _articles.push(article);
    };
    console.log(_articles[0])
    const _menu = {menu: menu, articles: _articles};
    res.status(200).send(_menu)
    console.log(_menu);
    return _menu;
};

export const displayMenubyId = async (req: Request, res: Response, id: string) => {
    const token = getToken(req, res);
    const bearer = 'Bearer ' + token;
    const adresse = Menus + 'get/' + id;
    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    );
    const menu = data.data;
    const list_articles = ((menu.id_article != null) ? menu.id_article : []) as Array<string>;

    // Récupérer les articles associés au menu depuis l'API des articles
    const _articles: any[] = [];
    
    for (let index = 0; index < list_articles.length; index++) {
      const element = list_articles[index];
      const adresse = articles + String(element);
      const article = await displayArticlebyId(req, res, element)
      _articles.push(article);
    };
    const _menu = {menu: menu, articles: _articles};
    return _menu;
};

// Display all from restaurant
export const displayRestaurantMenus = async (req: Request, res: Response) => {
    const token = getToken(req, res);
    const bearer = 'Bearer ' + token;
    const adresse = Menus + 'get-all';
    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    );

};

// Display all
export const displayAllMenus = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = Menus + 'get-all'
    console.log(adresse)
    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )

    const menu = data.data
    const list_articles = ((menu.id_article != null) ? menu.id_article : []) as Array<String>
    // Récupérer les articles associés au menu depuis l'API des articles
    const _articles: any[] = [];
    
    for (let index = 0; index < list_articles.length; index++) {
      const element = list_articles[index];
      const adresse = articles + String(element);
      const article = displayArticle(req, res)
      _articles.push(article);
    }
    const _menu = {menu: menu, articles: _articles}
    console.log(_menu)
    res.status(200).json(_menu)
    return _menu
}

// Update menu
export const updateMenu = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const id = req.params.id
    const adresse = Menus + id

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
    const adresse = Menus + id

    console.log(req.body)

    const data = await axios.delete(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
};