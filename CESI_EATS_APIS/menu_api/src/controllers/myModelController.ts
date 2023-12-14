import { Request, Response } from 'express';
import axios from 'axios';
import Menu from '../models/myModel';


// Get specific one
export const getMenu = async (req: Request, res: Response) => {
  try {
    // Récupérer le menu depuis MongoDB
    const menu = await Menu.findById(req.params.id);
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    const bearer = 'Bearer ' + token
    console.log(menu)

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.status(200).json(menu)
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};


export const getMyMenu = async (req: Request, res: Response) => {
  try {
    // Récupérer le menu depuis MongoDB
    const menu = await Menu.findById(req.params.id);
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const bearer = 'Bearer ' + token;

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const list_articles = ((menu.id_article != null) ? menu.id_article : []) as Array<String>;

    console.log(list_articles);

    // Récupérer les articles associés au menu depuis l'API des articles
    const articles: any[] = [];
    
    for (let index = 0; index < list_articles.length; index++) {
      const element = list_articles[index];
      const adresse = 'http://localhost:8000/articles/' + element;
      console.log(adresse);
      const article = await axios.get(adresse, {headers: {'Authorization': bearer}})
      articles.push(article.data);
    }

    // Ajouter les articles au menu
    console.log("ça marche man");
    console.log(articles);

    res.status(200).send({menus: menu, articles: articles});
    return menu;
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

export const getMyMenubyId = async (req: Request, res: Response, id: string) => {
  try {
    // Récupérer le menu depuis MongoDB
    const menu = await Menu.findById(id);
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const bearer = 'Bearer ' + token;

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const list_articles = ((menu.id_article != null) ? menu.id_article : []) as Array<String>;

    // Récupérer les articles associés au menu depuis l'API des articles
    const articles: any[] = [];
    
    for (let index = 0; index < list_articles.length; index++) {
      const element = list_articles[index];
      const adresse = 'http://localhost:8000/articles/' + element;
      console.log(adresse);
      const article = await axios.get(adresse, {headers: {'Authorization': bearer}})
      articles.push(article.data);
    }

    return {menus: menu, articles: articles};
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
    return {menus: null, articles: null}
  }
};

async function getArticles(id: Object, req: Request, res: Response) {
  try {
    // Récupérer le menu depuis MongoDB
    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const list_articles = ((menu.id_article != null) ? menu.id_article : ["quoicoubeh"]) as Array<String>

    // Récupérer les articles associés au menu depuis l'API des articles
    const articles: any[] = [];
    
    for (let index = 0; index < list_articles.length; index++) {
      const element = list_articles[index];
      const adresse = 'http://localhost:3010/' + element
      const article = await axios.get(adresse)
      articles.push(article.data);
    }

    // Ajouter les articles au menu
    console.log("oue mon gars")
    return articles
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    console.error(err)
    return 0
  }
};

// Get all
export const getAllMyMenus = async (req: Request, res: Response) => {
  try {
    const menus = await Menu.find();

    const articles: any[] = [];
    for (let index = 0; index < menus.length; index++) {
      const article = await getArticles(menus[index]._id, req, res)
      console.log(article)
      articles.push(article)
    }
    console.log(articles)
    console.log('Récupération réussie')
    res.status(200).json({menus : menus, articles : articles});
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Get all
export const getAllRestaurantMenus = async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const menus = await Menu.find({id_restaurant: id});
    console.log(menus.length)
    let list_articles = []
    for (let index = 0; index < menus.length; index++) {
      const element = menus[index]._id;
      const articles = await getArticles(element, req, res)
      list_articles.push(articles)
    }
    res.status(200).json({menus: menus, articles: list_articles});
    return menus
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Create
export const createMenu = async (req: Request, res: Response) => {
  console.log(req.body)

  const menu = new Menu({
    id_restaurant: req.body.id_restaurant,
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    promotion: req.body.promotion,
    id_article: req.body.id_article,
  });

  console.log(typeof(menu))

  try {
    const newMenu = await menu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    console.error(err)
    res.status(400).json({ message: errMessage });
  }
};

// Update
export const updateMenu = async (req: Request, res: Response) => {
  console.log(req.body.id_article)
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMenu);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errMessage });
  }
};

// Delete
export const deleteMenu = async (req: Request, res: Response) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Menu deleted' });
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    console.error(err)
    res.status(500).json({ message: errMessage });
  }
};
