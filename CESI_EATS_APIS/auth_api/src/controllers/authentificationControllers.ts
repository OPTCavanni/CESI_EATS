// Import des modules TypeScript
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { Pool } from 'pg';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Mise en place de l'utilisation des variables d'environnements
dotenv.config();

// Déclaration des variables globales
let listType : Number[] = new Array(1,2,3);

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT)
});

// Déclarations des méthodes 

// Création d'un utilisateur
export const createUser = async (req: Request, res: Response) => {
  // Déclaration des variables locales
  const { nom, prenom, sexe, adresse, pays, username, password, type, couleur, phone } = req.body;

  const mapped_sexe = ((sexe == 'Homme') ? true : false)

  const mapped_type = (()=>{
    switch (type) {
      case 'Client' : return 1;
      case 'Restaurateur' : return 2;
      case 'Livreur' : return 3;
    }
  })();
  
  // Gestion d'exception pour la réalisation d'une requête vers la BDD Postgres
  try {
      console.log(req.body);

      const results = await pool.query('CALL insert_user_data($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [nom, prenom, mapped_sexe, adresse, pays, username, password, mapped_type, couleur, phone])
      
      res.status(200).send('Account created');
  } catch (err) {
      const errMessage = err instanceof Error ? err.message : 'An error occurred';

      res.status(500).json({ message: errMessage });
  }
};

// Send User Type
export const sendUserType = async (req: Request, res: Response) => {
  // Déclarations des variables locales
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);
  // Gestion de l'exception "JWT Malformed"
  try {
    const payload = jwt.verify(token, String(process.env.JWT_SECRET)) 
    const user = payload as JwtPayload;
      
    console.log(user.p_log);

    if (!user.p_log) return res.sendStatus(403);

    res.status(200).json(user.p_log)
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}

// Connection d'un utilisateur 
export const login = async (req: Request, res: Response) => {
  // Déclaration des variables locales
  const username = req.body.username
  const password = req.body.password

  // Gestion d'exception pour la réalisation d'une requête vers la BDD Postgres
  try {
    console.log(req.body)

    const results = await pool.query("CALL user_login_bool($1, $2, 0)", [username, password])
    const user = results.rows[0];
    console.log(user)
    const kong_user = { p_log: user.p_log, username: username, kid: process.env.KID }

    /* Vérification du type de l'utilisateur qui vient de se connecter:
       - Client
       - Restaurateur
       - Livreur
    */
    if (!(listType.includes(user.p_log))) {
      console.log("No user found");
      res.status(500).send("L'utilisateur n'existe pas");
    } else {
      // Génération du token JWT
      const accessToken = jwt.sign(kong_user, String(process.env.JWT_SECRET), {expiresIn: '15m'});

      const refreshToken = jwt.sign(kong_user, String(process.env.REFRESH_JWT_SECRET), {expiresIn: '7d'})

      console.log(accessToken);
      console.log(refreshToken);

      res.status(200).json({accessToken, refreshToken});
    }
  } catch (err) {
    console.error(err)

    res.status(500).send(err)
  }
}

// Récupération de l'username à partir du token
function getUsername(req: Request , res: Response) {
  // Déclaration des variables locales
  const authBody = req.body.token;

  // Vérification d'existence
  if (authBody == null) return res.sendStatus(401);

  // Gestion de l'exception "JWT malformed"
  try {
    const payload = jwt.verify(authBody, String(process.env.REFRESH_JWT_SECRET)) 
    const user = payload as JwtPayload;
      
    console.log(user.username);
  
    // Vérification d'existence
    if (!user.username) return res.sendStatus(403);
  
    return user.username
  } catch (error) {
    console.error(error)
  }
 
}

// Rafraîchissement du token 
export const refresh = async (req: Request, res: Response) => {
  // Déclaration des variables locales
  const refreshToken = req.body.token; 

  console.log("oue mon gars")
  console.log(refreshToken)
  console.log(req.body)

  // Vérification d'existence
  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token is required' });
  }

  // Gestion d'exception sur la génération des nouveaux tokens
  try {
    const user: any = jwt.verify(refreshToken, String(process.env.REFRESH_JWT_SECRET));
    const username = getUsername(req, res)

    // Génération des nouveaux access tokens pour cet utilisateur
    const newAccessToken = jwt.sign({ p_log: user.p_log, username: username, kid: process.env.KID }, String(process.env.JWT_SECRET), { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ p_log: user.p_log, username: username, kid: process.env.KID }, String(process.env.REFRESH_JWT_SECRET), { expiresIn: '7d' });

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
}





