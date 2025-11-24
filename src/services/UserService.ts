/* Service pour la logique métier des utilisateurs
 * Projet intégrateur - Dev web 3
 */
import { IUser } from '@src/models/User';
import UserRepo from '@src/repos/UserRepo';
import {
  UTILISATEUR_NOT_FOUND_ERR,
  INVALID_CREDENTIALS_ERR,
} from '@src/routes/JetonRoutes';



// **** Constantes **** //
export const USER_ALREADY_EXISTS_ERR = 'Un utilisateur avec cet email existe déjà';

// **** Fonctions **** //

/**
 * Enregistre un nouvel utilisateur
 */
async function register(user: IUser): Promise<void> {
  const utilisateurExiste = await UserRepo.findByEmail(user.email);
  if (utilisateurExiste) {
    throw new Error(USER_ALREADY_EXISTS_ERR);
  } else {
    await UserRepo.add(user);
  }
}


/**
 * Trouve un utilisateur par son email
 */
async function findByEmail(email: string): Promise<IUser> {
  const user = await UserRepo.findByEmail(email);
  if (!user) {
    throw new Error(UTILISATEUR_NOT_FOUND_ERR);
  }
  return user;
}


/** 
 * Validation du mot de passe d'un utilisateur
 */
async function validatePassword(email: string, motDePasse: string): Promise<IUser> {
  const user = await UserRepo.findByEmail(email);
    if (!user) {
        throw new Error(UTILISATEUR_NOT_FOUND_ERR);
    }

  if (user.motDePasse !== motDePasse) {
    throw new Error(INVALID_CREDENTIALS_ERR);
  }
  return user;
}

// **** Export default **** //
export default {
  register,
  findByEmail,
  validatePassword,
} as const;