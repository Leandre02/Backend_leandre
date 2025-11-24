/* Service pour générer les tokens JWT
 * Projet intégrateur - Dev web 3
 */

import { IUserLogin, User } from '@src/models/User';
import jwt from 'jsonwebtoken';
import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ENV from '@src/common/constants/ENV';

// **** Variables **** //

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';
export const INVALID_CREDENTIALS_ERR = 'Email ou mot de passe incorrect';

// **** Fonctions **** //

/**
 * Génére un token JWT pour un utilisateur
 */
async function generateToken(utilisateur: IUserLogin): Promise<string> {
  // check si l'utilisateur existe dans la BD
  // TODO : JetonService.generateToken devrait appeler UserService.findByEmail au lieu de User.findOne.
  const utilisateurBD = await User.findOne({ email: utilisateur.email });

  if (!utilisateurBD) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, UTILISATEUR_NOT_FOUND_ERR);
  }

  // check si le mot de passe est correct
  if (utilisateurBD.motDePasse !== utilisateur.motDePasse) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_CREDENTIALS_ERR);
  }

  // générer le token avec l'id et l'email
  const token = jwt.sign(
    {
      id: utilisateurBD._id,
      email: utilisateurBD.email,
    },
    ENV.Jwtsecret as string,
  );

  return token;
}

// **** Export default **** //

export default {
  generateToken,
} as const;
