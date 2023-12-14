// Import des modules TypeScript
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Pool } from 'pg';

// Déclaration des variables globales
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
});

/*********************/
/* Méthodes globales */ 
/*********************/

// Get all compte
export const getAllAccount = async (req: Request, res: Response) => {
  // Gestion d'exception pour la requête sur la mongodb
  try {
    const results = await pool.query('SELECT * FROM public."user_Compte"');
    console.log(results.rows)
    res.status(200).json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// Get username depuis le token
function getUsername(req: Request , res: Response) {
  // Déclaration des variables locales
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);
  try{
    const payload = jwt.verify(token, String(process.env.JWT_SECRET)) 
    
    const user = payload as JwtPayload;
      
    console.log(user.username);

    if (!user.username) return res.sendStatus(403);

    return user.username
  } catch (error) {
    console.error(error)
  }
}

// Affichage des informations d'un compte
export const displayAccount = async (req: Request, res: Response) => {
  // Déclaration des variables locales
  const username = await getUsername(req, res)

  // Gestion d'exception pour la requête sur la mongodb
  try  {
    const results = (await pool.query("CALL display_user_data($1, 'nom', 'prenom', false, 'adresse', 'pays', 'couleur', 'phone')", [username])).rows[0];
    
    const mapped_sexe = ((results.o_user_sexe == true) ? 'Homme' : 'Femme')

    const mapped_result = {
      o_user_nom: results.o_user_nom,
      o_user_prenom: results.o_user_prenom,
      o_user_sexe: mapped_sexe,
      o_user_adresse: results.o_user_adresse,
      o_user_pays: results.o_user_pays,
      o_user_color: results.o_user_color,
      o_user_phone: results.o_user_phone,
    }
    
    res.status(200).send(mapped_result)  
  }catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
};

// Update account
export const updateMyAccount = async (req: Request, res: Response) => {
  // Déclaration des variables locales
  const username = getUsername(req, res)
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const sexe = req.body.sexe;
  const adresse = req.body.adresse;
  const pays = req.body.pays;
  const color = req.body.color;
  const phone = req.body.phone;

  const mapped_sexe = ((sexe == 'Homme') ? true : false)

  console.log(req)

  // Gestion d'exception pour la requête sur la mongodb
  try {
    const results = await pool.query("CALL update_compte_data($1, $2, $3, $4, $5, $6, $7, $8);", [username, nom, prenom, mapped_sexe, adresse, pays, color, phone]);
    console.log(results.rows)
    res.status(201).send('Info compte updated');
  }catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

//Update credentials
export const updateMyCredentials = async (req: Request, res: Response) => {
  // Déclaration des variables locales
  const username = getUsername(req, res);
  const password = req.body.password;
  const new_username = req.body.new_username;
  const new_password = req.body.new_password;

  // Gestion d'exception pour la requête sur la mongodb
  try {
    const results = await pool.query("CALL update_credential_data($1, $2, $3, $4)", [username, password, new_username, new_password])
    res.status(201).send("Credentials changé")
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}

// Delete account
export const deleteMyModel = async (req: Request, res: Response) => {
  // Déclaration des variables locales
  console.log(req.headers)
  const username = getUsername(req, res);

  // Gestion d'exception pour la requête sur la mongodb
  try {
    const results = await pool.query("CALL delete_user_data($1)", [username])
    res.status(200).send("User deleted")
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
};

// Create restaurant
export const createRestaurant = async (req: Request, res: Response) => {
  // Déclaration des variables locales
  const username = getUsername(req, res)
  const restaurant = {
    name: req.body.name,
    adresse: req.body.adresse,
    description: req.body.description,
    type: req.body.type,
    pays: req.body.pays,
    email: req.body.email
  };

  // Gestion d'exception pour la requête sur la mongodb
  try {
    const newRestaurant = await pool.query('CALL create_restaurant_data($1, $2, $3, $4, $5, $6, $7)', [username, restaurant.name, restaurant.adresse, restaurant.description, restaurant.type, restaurant.pays, restaurant.email]);
    res.status(201).json(newRestaurant);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    console.error(err)
    res.status(400).json({ message: errMessage });
  }
}

// Get restaurant
export const displayRestaurant = async (req: Request, res: Response) => {
  const username = getUsername(req, res);

  // Gestion d'exception des requêtes dans la base mongodb
  try {
    const results = (await pool.query("CALL get_restorer_data('Bobo', 0, '', '', '', '', '', '')")).rows[0]
    console.log(results)
    const mapped_results = {
      o_user_id: results.p_id_restaurant,
      o_user_nom: results.p_nom_restaurant,
      o_user_desc: results.p_descr_restaurant,
      o_user_adresse: results.p_adresse_restaurant,
      o_user_pays: results.p_pays_restaurant,
      o_user_type: results.p_type_restaurant,
      o_user_email: results.p_email_restaurant,
    }
    res.status(201).json(mapped_results);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    console.error(err)
    res.status(400).json({ message: errMessage });
  }
}
