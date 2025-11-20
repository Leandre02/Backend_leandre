/* Routes pour générer des tokens
 * Projet intégrateur - Dev web 3
 */

import JetonService from '@src/services/JetonService';
import { IUserLogin } from '@src/models/User';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IReq, IRes } from './common/types';

// **** Variables **** //

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';
export const INVALID_CREDENTIALS_ERR = 'Email ou mot de passe incorrect';

// **** Fonctions **** //

/**
 * Générer un token JWT
 */
async function generateToken(req: IReq, res: IRes) {
  try {
    const email = req.body.email as string;
    const motDePasse = req.body.motDePasse as string;

    // check si les champs sont présents
    if (!email || !motDePasse) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Email et mot de passe requis' });
    }

    const userLogin: IUserLogin = { email, motDePasse };
    const token = await JetonService.generateToken(userLogin);

    return res.send({ token: token });

  } catch (erreur) {
    // gestion des erreurs du service
    if (erreur.message === UTILISATEUR_NOT_FOUND_ERR) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: erreur.message });
    } else if (erreur.message === INVALID_CREDENTIALS_ERR) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ error: erreur.message });
    } else {
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erreur lors de la génération du token' });
    }
  }
}

// **** Export default **** //

export default {
  generateToken,
} as const;
