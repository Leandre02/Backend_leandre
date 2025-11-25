/* Repository pour les requêtes MongoDB sur les utilisateurs
 * Projet intégrateur - Dev web 3
* TODO : Ajouter les operations de modification et suppression d'utilisateur
 */

import { IUser, User } from '@src/models/User';

// **  Constantes  ** //
export const NOT_FOUND_ERR = 'Utilisateur introuvable';


/* *** Fonctions **** */

/**
 * Trouve un utilisateur par son email
 */
async function findByEmail(email: string): Promise<IUser | null> {
  const user = await User.findOne({ email });
  return user;
}

/**
 * Ajoute un nouvel utilisateur
 */
async function add(user: IUser): Promise<void> {
  const nouvelUser = new User(user);
  await nouvelUser.save();
}

 

// **** Export default **** //

export default {
  findByEmail,
  add,
} as const;