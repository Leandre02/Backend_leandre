/* Modèle Mongoose pour les utilisateurs
 * Projet intégrateur - Dev web 3
 */

import mongoose, { Schema, model } from 'mongoose';
import { isString } from 'jet-validators';
import { parseObject, TParseOnError } from 'jet-validators/utils';

import { isRelationalKey, transIsDate } from '@src/common/util/validators';
import { IModel } from './common/types';



// Interface pour représenter un utilisateur
export interface IUser {
  _id: mongoose.Types.ObjectId;
  nom: string;
  email: string;
  motDePasse: string;
  dateCreation: Date;
}

const UserSchema = new Schema<IUser>(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est requis.'],
      minlength: [2, 'Le nom doit contenir au moins 2 caractères.'],
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères.'],
    },
    email: {
      type: String,
      required: [true, "L'email est requis."],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Le format de l'email est invalide."],
    },
    motDePasse: {
      type: String,
      required: [true, 'Le mot de passe est requis.'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.'],
    },
    dateCreation: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'users' },
);

// Hasher le mot de passe avant de sauvegarder
UserSchema.pre('save', async function (next) {
  // Si le mot de passe n'a pas été modifié, on continue
  if (!this.isModified('motDePasse')) {
    next();
  } else {
    // On hash le mot de passe
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    next();
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (
  motDePasseCandidat: string,
): Promise<boolean> {
  return await bcrypt.compare(motDePasseCandidat, this.motDePasse);
};

mongoose.pluralize(null);

export const User = model<IUser>('users', UserSchema);
