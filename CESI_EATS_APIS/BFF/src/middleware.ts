import { Request, Response, NextFunction } from "express";
import { getUserType } from "./services/services";

export const authorize = (allowedIdentityTypes: Array<String>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const userType = getUserType(req, res);
        console.log(userType)
        if (!allowedIdentityTypes.includes(userType)) {
          res.status(403).json({ message: 'Forbidden' });
        } else {
          next();
        }  
      } catch (err) {
        res.status(500).json({ message: 'An error occurred' });
      }
    };
};