/* Routes pour générer des tokens
 * Projet intégrateur - Dev web 3
 */

import JetonService from '@src/services/JetonService';
import { IUserLogin } from '@src/models/User';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IReq, IRes } from './common/types';

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';
export const INVALID_CREDENTIALS_ERR = 'Email ou mot de passe incorrect';

// **** Fonctions **** //

/**
 * Générer un jeton.
 */
async function generateToken(req: IReq, res: IRes) {
  const email = req.body.email as string;
  const motDePasse = req.body.motDePasse as string;

  // validation minimale — retourne 400 si champs manquants
  if (!email || !motDePasse) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Email et mot de passe requis' });
  }

  const userLogin: IUserLogin = { email, motDePasse };
  const token = await JetonService.generateToken(userLogin);
  return res.send({ token });
}

// **** Export default **** //

export default {
  generateToken,
} as const;
