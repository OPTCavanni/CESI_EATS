import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import { getToken, getUsername } from '../services/services'

dotenv.config()

const articles = process.env.ARTICLES_ADRESSE

// Create restaurant
export const createArticle = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = articles + 'create-article'

    console.log(req.body)

    const data = await axios.post(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
};

// Display one
export const displayArticle = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const id = req.params.id
    const adresse = articles + id

    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )   
};

// Display one
export const displayArticlebyId = async (req: Request, res: Response, id: string) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = articles + id

    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
    console.log("article: ", data.data)
    return data.data
};

// Display all from restaurant
export const displayRestaurantArticles = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const id = req.params.id
    const adresse = articles + 'get/' + id
    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
};

// Update article
export const updateArticle = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const id = req.params.id
    const adresse = articles + id

    const data = await axios.put(
        adresse,
        { headers: { 'Authorization': bearer } },
        req.body
    )
};

// Delete
export const deleteArticle = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const id = req.params.id
    const adresse = articles + id

    console.log(req.body)

    const data = await axios.delete(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
};