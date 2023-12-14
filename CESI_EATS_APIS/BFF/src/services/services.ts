import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import axios, { AxiosStatic } from 'axios';
import dotenv from 'dotenv';

dotenv.config();


// Get token
export function getToken(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    return token
}

// Get Username
export function getUsername(req: Request, res: Response) {
    const token = getToken(req, res)
    if (token == null) return res.sendStatus(401);
    try {
        const payload = jwt.verify(token, String(process.env.JWT_SECRET))

        const user = payload as JwtPayload;

        console.log(user);

        if (!user.username) return res.sendStatus(403);

        return user.username
    } catch (error) {
        console.error(error)
    }
}

// Get Username
export function getUserType(req: Request, res: Response): String {
    const token = getToken(req, res)
    if (token == null){
        res.sendStatus(401) 
        return ""
    } 
    try {
        const payload = jwt.verify(token, String(process.env.JWT_SECRET))

        const user = payload as JwtPayload;

        console.log(user);

        if (!user.p_log){
            res.sendStatus(403);
            return ""
        } 

        switch (user.p_log) {
            case 1:
                return "Client"
            case 2:
                return "Restaurant"
            case 3:
                return "Livreur"
            default:
                return ""
        }
    } catch (error) {
        console.error(error)
        return ""
    }
}

// Make axios request
export async function makeAxiosRequest(method: String, adresse: string, req: Request, res: Response) {
    const token = getToken(req, res);
    const bearer = 'Bearer ' + token;
    
    try {
        let data: any;
        switch (method) {
            case 'get':
                data = await axios.get(
                    adresse,
                    { headers: { 'Authorization': bearer } }
                );
                break;
            case 'put':
                data = await axios.put(
                    adresse,
                    { headers: { 'Authorization': bearer } },
                    req.body
                );
                break;
            case 'post':
                data = axios.post(
                    adresse,
                    { headers: { 'Authorization': bearer } },
                    req.body
                );
                break;
            case 'delete':
                data = await axios.delete(
                    adresse,
                    { headers: { 'Authorization': bearer } }
                );
                break;
            default:
                break;
        }
    return data;  
    } catch (error) {
        console.error(error)
    }
    
}