/* Service pour la logique métier des utilisateurs
 * Projet intégrateur - Dev web 3
 */
import { IUser } from '@src/models/User';
import UserRepo from '@src/repos/UserRepo';
import bcrypt from 'bcrypt';
import {
  UTILISATEUR_NOT_FOUND_ERR,
  INVALID_CREDENTIALS_ERR,
} from '@src/routes/JetonRoutes';


const costFactor = 10;

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
    const motDePasseHash = await bcrypt.hash(user.motDePasse, costFactor);
    const nouvelUser: IUser = {
      ...user,
      motDePasse: motDePasseHash,
    };
    await UserRepo.add(nouvelUser);
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
  else {
    const motDePasseValide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!motDePasseValide) {
      throw new Error(INVALID_CREDENTIALS_ERR);
    } 
    else {
      return user;
    }
  }
}

// **** Export default **** //
export default {
  register,
  findByEmail,
  validatePassword,
} as const;