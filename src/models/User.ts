/* Modèle Mongoose pour les utilisateurs
 * Projet intégrateur - Dev web 3
 */

import mongoose, { Schema, model } from 'mongoose';

// Interface pour représenter un utilisateur
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  nom: string;
  email: string;
  motDePasse: string;
  dateCreation: Date;
}

// Interface pour le login d'un utilisateur
export interface IUserLogin {
  email: string;
  motDePasse: string;
}

// Validation pour le format de l'email
function validerEmail(email: string): boolean {
  const regexEmail = /^\S+@\S+\.\S+$/;
  return regexEmail.test(email);
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
      required: [true, 'L\'email est requis.'],
      unique: true,
      lowercase: true,
      validate: {
        validator: validerEmail,
        message: 'Le format de l\'email est invalide.',
      },
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

mongoose.pluralize(null);

export const User = model<IUser>('users', UserSchema);
