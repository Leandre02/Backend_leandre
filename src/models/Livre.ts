/* Projet intégrateur - Dev web 3
 * Modèle Mongoose pour les livres
 * By : Leandre Kanmegne
 */

import mongoose, { Schema, model } from 'mongoose';

// Interface pour représenter un livre
export interface ILivre {
  _id: mongoose.Types.ObjectId;
  titreLivre: string;
  auteurPrincipal: string;
  datePublication: Date;
  nombrePages: number;
  estDisponible: boolean;
  isbn: string;
  categories: string[];
  prixAchat: number;
  evaluation?: number; 
  commentairesPerso?: string;
}

// Liste des catégories possibles pour les livres
const categoriesValides = [
  'Fiction',
  'Science-Fiction',
  'Fantastique',
  'Classique',
  'Philosophie',
  'Histoire',
  'Jeunesse',
  'Humour',
  'Dystopie',
  'Spiritualité',
  'Aventure',
  'Romance',
];

/*Validation pour l'International Standard Book Number (ISBN)
* Doit commencer par 978 ou 979 et avoir 13 chiffres
* Fromat attendu: 978-X-XX-XXXXXX-X
* */
function validerISBN(isbn: string): boolean {
  const isbnSansTirets = isbn.replace(/-/g, '');

  if (!/^(978|979)\d{10}$/.test(isbnSansTirets)) {
    return false;
  } else {
    return true;
  }
}

/* Validation pour la date de publication */
function validerDatePublication(date: Date): boolean {
  const maintenant = new Date();
  if (date > maintenant) {
    return false;
  } else {
    return true;
  }
}

/* Validation pour les catégories */
function validerCategories(categories: string[]): boolean {
  if (categories.length === 0) {
    return false;
  }
  return categories.every((categorie) => categoriesValides.includes(categorie));
}

const LivreSchema = new Schema<ILivre>(
  {
    titreLivre: {
      type: String,
      required: [true, 'Le titre du livre est requis.'],
      minlength: [1, 'Le titre doit contenir au moins 1 caractère.'],
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères.'],
    },
    auteurPrincipal: {
      type: String,
      required: [true, "Le nom de l'auteur principal est requis."],
      minlength: [2, "Le nom de l'auteur doit contenir au moins 2 caractères."],
      maxlength: [
        100,
        "Le nom de l'auteur ne peut pas dépasser 100 caractères.",
      ],
    },
    datePublication: {
      type: Date,
      required: [true, 'La date de publication est requise.'],
      validate: {
        validator: validerDatePublication,
        message: 'La date de publication ne peut pas être dans le futur.',
      },
    },
    nombrePages: {
      type: Number,
      required: [true, 'Le nombre de pages est requis.'],
      min: [1, 'Le nombre de pages doit être au minimum 1.'],
      max: [10000, 'Le nombre de pages ne peut pas dépasser 10000.'],
    },
    estDisponible: {
      type: Boolean,
      required: [true, 'La disponibilité du livre est requise.'],
      default: true,
    },
    isbn: {
      type: String,
      required: [true, 'Le numéro ISBN est requis.'],
      validate: {
        validator: validerISBN,
        message:
          "Le format de l'ISBN est invalide. Format attendu: 978-X-XX-XXXXXX-X",
      },
    },
    categories: {
      type: [String],
      required: [true, 'Au moins une catégorie est requise.'],
      validate: {
        validator: validerCategories,
        message:
          'Les catégories doivent être valides et au moins une catégorie est requise.',
      },
    },
    prixAchat: {
      type: Number,
      required: [true, "Le prix d'achat est requis."],
      min: [0, "Le prix d'achat doit être positif ou zéro."],
      max: [100, "Le prix d'achat ne peut pas dépasser 100$."],
    },
    evaluation: {
      type: Number,
      required: false,
      min: [1, "L'évaluation doit être entre 1 et 5."],
      max: [5, "L'évaluation doit être entre 1 et 5."],
    },
    commentairesPerso: {
      type: String,
      required: false,
      maxlength: [
        500,
        'Les commentaires ne peuvent pas dépasser 500 caractères.',
      ],
    },
  },
  { collection: 'bibliotheque' },
);

mongoose.pluralize(null);

export const Livre = model<ILivre>('bibliotheque', LivreSchema);
