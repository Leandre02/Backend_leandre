/* Routes d'authentification
 * Projet intégrateur - Dev web 3
 */

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { User } from '@src/models/User';
import jwt from 'jsonwebtoken';
import { IReq, IRes } from './common/types';

// **** Constantes **** //

export const USER_ALREADY_EXISTS_ERR =
  'Un utilisateur avec cet email existe déjà';
export const INVALID_CREDENTIALS_ERR = 'Email ou mot de passe incorrect';
export const MISSING_FIELDS_ERR = 'Tous les champs sont requis';

// **** Fonctions **** //

/**
 * Inscription d'un nouvel utilisateur
 */
async function register(req: IReq, res: IRes) {
  try {
    const { nom, email, motDePasse } = req.body;

    // check si tous les champs sont présents
    if (!nom || !email || !motDePasse) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: MISSING_FIELDS_ERR });
    } else {
      // continue
    }

    // check si l'utilisateur existe déjà
    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: USER_ALREADY_EXISTS_ERR });
    } else {
      // continue
    }

    // créer le nouvel utilisateur
    const nouvelUser = new User({
      nom,
      email,
      motDePasse,
    });

    await nouvelUser.save();

    // créer le token JWT
    const token = jwt.sign(
      { id: nouvelUser._id, email: nouvelUser.email },
      process.env.JWT_SECRET || 'secret_par_defaut',
      { expiresIn: '7d' },
    );

    res.status(HttpStatusCodes.CREATED).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: nouvelUser._id,
        nom: nouvelUser.nom,
        email: nouvelUser.email,
      },
    });
  } catch (erreur: any) {
    // erreur de validation Mongoose
    if (erreur.name === 'ValidationError') {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Erreur de validation', details: erreur.message });
    } else {
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur lors de l'inscription" });
    }
  }
}

/**
 * Connexion d'un utilisateur
 */
async function login(req: IReq, res: IRes) {
  try {
    const { email, motDePasse } = req.body;

    // check si tous les champs sont présents
    if (!email || !motDePasse) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: MISSING_FIELDS_ERR });
    } else {
      // continue
    }

    // trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ error: INVALID_CREDENTIALS_ERR });
    } else {
      // continue
    }

    // check le mot de passe (comparaison simple, pas de hash)
    if (user.motDePasse !== motDePasse) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ error: INVALID_CREDENTIALS_ERR });
    } else {
      // continue
    }

    // créer le token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret_par_defaut',
      { expiresIn: '7d' },
    );

    res.status(HttpStatusCodes.OK).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        nom: user.nom,
        email: user.email,
      },
    });
  } catch (erreur) {
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
