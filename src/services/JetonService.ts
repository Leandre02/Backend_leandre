/* Service pour générer les tokens JWT
 * Projet intégrateur - Dev web 3
 */

import { IUserLogin, User } from '@src/models/User';
import jwt from 'jsonwebtoken';

// **** Variables **** //

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';
export const INVALID_CREDENTIALS_ERR = 'Email ou mot de passe incorrect';

// **** Fonctions **** //

/**
 * Générer un token JWT pour un utilisateur
 */
async function generateToken(utilisateur: IUserLogin): Promise<string> {
  // check si l'utilisateur existe dans la BD
  const utilisateurBD = await User.findOne({ email: utilisateur.email });

  if (!utilisateurBD) {
    throw new Error(UTILISATEUR_NOT_FOUND_ERR);
  }

  // check si le mot de passe est correct
  if (utilisateurBD.motDePasse !== utilisateur.motDePasse) {
    throw new Error(INVALID_CREDENTIALS_ERR);
  }

  // générer le token avec l'id et l'email
  const token = jwt.sign(
    {
      id: utilisateurBD._id,
      email: utilisateurBD.email,
    },
    process.env.JWT_SECRET || 'secret_par_defaut',
    { expiresIn: '1d' },
  );

  return token;
}

// **** Export default **** //

export default {
  generateToken,
} as const;
