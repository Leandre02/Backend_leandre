/* Routes d'authentification
 * Projet intégrateur - Dev web 3
 */

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import jwt from 'jsonwebtoken';
import { IReq, IRes } from './common/types';
import ENV from '@src/common/constants/ENV';
import UserService, { USER_ALREADY_EXISTS_ERR} from '@src/services/UserService';
import {
  UTILISATEUR_NOT_FOUND_ERR,
  INVALID_CREDENTIALS_ERR,
} from '@src/routes/JetonRoutes';


// **** Constantes **** //
export const MISSING_FIELDS_ERR = 'Tous les champs sont requis';

// **** Fonctions **** //

/**
 * Inscription d'un nouvel utilisateur
 */
async function register(req: IReq, res: IRes) {
  const { nom, email, motDePasse } = req.body as {
    nom: string;
    email: string;
    motDePasse: string;
  };

  // check si tous les champs sont présents
  if (!nom || !email || !motDePasse) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: MISSING_FIELDS_ERR });
  }

  try {
    await UserService.register({
      nom,
      email,
      motDePasse,
      dateCreation: new Date(),
    });

    // créer le token JWT
    const token = jwt.sign({ email }, ENV.Jwtsecret as string);

    return res.status(HttpStatusCodes.CREATED).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: { nom, email },
    });
  } catch (erreur: any) {
    // erreur de validation Mongoose
    if (erreur.name === 'ValidationError') {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Erreur de validation', details: erreur.message });
    }
    if (erreur.message === USER_ALREADY_EXISTS_ERR) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: USER_ALREADY_EXISTS_ERR });
    }
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de l'inscription" });
  }
}

/**
 * Connexion d'un utilisateur
 */
async function login(req: IReq, res: IRes) {
  const { email, motDePasse } = req.body as {
    email: string;
    motDePasse: string;
  };

  // check si tous les champs sont présents
  if (!email || !motDePasse) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: MISSING_FIELDS_ERR });
  }

  try {
    // trouver l'utilisateur et valider password
    const user = await UserService.validatePassword(email, motDePasse);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      ENV.Jwtsecret as string,
    );

    return res.status(HttpStatusCodes.OK).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
      },
    });
  } catch (erreur: any) {
    if (erreur.message === INVALID_CREDENTIALS_ERR) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ error: INVALID_CREDENTIALS_ERR });
    }
    if (erreur.message === UTILISATEUR_NOT_FOUND_ERR) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ error: INVALID_CREDENTIALS_ERR });
    }
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erreur lors de la connexion' });
  }
}



// **** Export default **** //

export default {
  register,
  login,
} as const;
