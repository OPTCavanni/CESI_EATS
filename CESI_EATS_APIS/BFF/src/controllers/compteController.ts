import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import { getToken, getUsername } from '../services/services'

dotenv.config()

const compte = process.env.COMPTE_ADRESSE

// Create restaurant
export const createRestaurant = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'get-all-users'

    console.log(req.body)

    const data = await axios.post(
        adresse,
        { headers: { 'Authorization': bearer } },
        req.body    
    )
};

// get
export const getUser = async (req: Request, res: Response, id: string) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'user-data/' + id
    console.log(adresse)
    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
    
    return data.data
}

// get
export const getResto = async (req: Request, res: Response, id: string) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'restaurant-data/' + id
    console.log(adresse)
    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )

    return data.data
}

// display
export const displayUser = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'display-user'

    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
};

// Get restaurant
export const displayRestaurant = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'display-restaurant'

    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
};

// Get all
export const getAllUsers = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'get-all-users'

    const data = await axios.get(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
};

// Update account
export const updateMyAccount = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'get-all-users'

    console.log(req.body)

    const data = await axios.put(
        adresse,
        { headers: { 'Authorization': bearer } },
        req.body
    )
};

//Update credentials
export const updateMyCredentials = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'get-all-users'

    console.log(req.body)

    const data = await axios.put(
        adresse,
        { headers: { 'Authorization': bearer } },
        req.body
    )
};

// Create restaurant
export const updateRestaurant = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'get-all-users'

    console.log(req.body)

    const data = await axios.post(
        adresse,
        { headers: { 'Authorization': bearer } },
        req.body
    )
};

// Delete
export const deleteRestaurant = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'get-all-users'

    console.log(req.body)

    const data = await axios.delete(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
};

// Delete
export const deleteMyModel = async (req: Request, res: Response) => {
    const token = getToken(req, res)
    const bearer = 'Bearer ' + token
    const adresse = compte + 'get-all-users'

    console.log(req.body)

    const data = await axios.delete(
        adresse,
        { headers: { 'Authorization': bearer } }
    )
};
