import { Request, Response } from 'express';
import MyModel from '../models/myModel';

// Get all
export const getAllMyModels = async (req: Request, res: Response) => {
  try {
    const myModels = await MyModel.find();
    console.log('Récupération réussie')
    res.status(200).json(myModels);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Get specific one
export const getArticleRestaurant = async (req: Request, res: Response) => {
  try {
    console.log("restaurant n°")
    console.log(req.params)
    const myModel = await MyModel.find({id_restaurant: req.params.id});
    if (myModel == null) {
      return res.status(404).json({ message: 'Cannot find myModel' });
    }
    console.log(myModel);
    const restaurant_articles = []
    for (let index = 0; index < myModel.length; index++) {
      const element = myModel[index];
      
      const mapped_price = String(element.prix)
      const mapped_vegan = ((element.vegan == false) ? 'Non-végétarien' : 'Adapté au régime végétarien')
      const mapped_stock = ((element.stock == true) ? 'Disponible' : 'Rupture')
      const mapped_model = {
        id_article: element._id,
        id_restaurant: element.id_restaurant,
        title: element.title,
        description: element.description,
        image: element.image,
        stock: mapped_stock,
        prix: mapped_price,
        vegan: mapped_vegan,
        ingredients: element.ingredients
      }
      restaurant_articles.push(mapped_model)
    }
  
    res.status(200).json(restaurant_articles);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Get Article
export const getArticle = async (req: Request, res: Response) => {
  try {
    const myModel = (await MyModel.find({_id: req.params.id}))[0];
    if (myModel == null) {
      return res.status(404).json({ message: 'Cannot find myModel' });
    }
    const mapped_price = String(myModel.prix)
    const mapped_vegan = ((myModel.vegan == false) ? 'Non-végétarien' : 'Adapté au régime végétarien')
    const mapped_stock = ((myModel.stock == true) ? 'Disponible' : 'Rupture')

    const mapped_model = {
      id_article: myModel._id,
      id_restaurant: myModel.id_restaurant,
      title: myModel.title,
      description: myModel.description,
      image: myModel.image,
      stock: mapped_stock,
      prix: mapped_price,
      vegan: mapped_vegan,
      ingredients: myModel.ingredients
    }
    res.status(200).json(mapped_model)
    return mapped_model;
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Create
export const createMyModel = async (req: Request, res: Response) => {

  console.log(req.body)

  const mapped_price = Number(req.body.prix)
  const mapped_vegan = ((req.body.vegan == 'Non-Végétarien') ? false : true)
  const mapped_stock = ((req.body.stock == 'Disponible') ? true : false)

  const myModel = new MyModel({
    id_restaurant: req.body.id_restaurant,
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    stock: mapped_stock,
    prix: mapped_price,
    vegan: mapped_vegan,
    ingredients: req.body.ingredients,
  });
  try {
    const newMyModel = await myModel.save();
    res.status(201).json(newMyModel);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    console.error(err)
    res.status(400).json({ message: errMessage });
  }
};

// Update
export const updateMyModel = async (req: Request, res: Response) => {
  try {
    const updatedMyModel = await MyModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMyModel);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errMessage });
  }
};

// Delete
export const deleteMyModel = async (req: Request, res: Response) => {
  try {
    console.log(req.params)
    await MyModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'MyModel deleted' });
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    console.error(err)
    res.status(500).json({ message: errMessage });
  }
};
