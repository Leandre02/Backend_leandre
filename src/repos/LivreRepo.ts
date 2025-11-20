/* Repository pour les requêtes MongoDB sur les livres
 * Projet intégrateur - Dev web 3
 */

import { ILivre, Livre } from '@src/models/Livre';
import mongoose from 'mongoose';

// **** Variables **** //

// Un livre vide pour les cas ou on trouve rien
const livreNull: ILivre = {
  _id: new mongoose.Types.ObjectId(),
  titreLivre: '',
  auteurPrincipal: '',
  datePublication: new Date(),
  nombrePages: 0,
  estDisponible: false,
  isbn: '',
  categories: [],
  prixAchat: 0,
};

// **** Fonctions **** //

/**
 * Extraire tous les livres
 */
async function getAll(): Promise<ILivre[]> {
  const livres = await Livre.find();
  return livres;
}

/**
 * Extraire un livre par son ID
 */
async function getOne(id: mongoose.Types.ObjectId): Promise<ILivre> {
  const livre = await Livre.findOne({ _id: id });
  if (!livre) {
    console.error(`Le livre avec l'ID ${id} est introuvable.`);
    return livreNull;
  } else {
    return livre;
  }
}

/**
 * Extraire tous les livres disponibles
 */
async function getDisponibles(): Promise<ILivre[]> {
  const livresDisponibles = await Livre.find({ estDisponible: true });
  return livresDisponibles;
}

/**
 * Extraire tous les livres par catégorie
 */
async function getByCategorie(categorie: string): Promise<ILivre[]> {
  const livres = await Livre.find({ categories: categorie });
  if (livres.length === 0) {
    console.error(`Aucun livre trouvé pour la catégorie: ${categorie}`);
  } 
  return livres;
}

/**
 * Ajoute un livre
 */
async function add(livre: ILivre): Promise<void> {
  const nouveauLivre = new Livre(livre);
  await nouveauLivre.save();
}



/**
 * Met à jour un livre
 */
async function update(livre: ILivre): Promise<ILivre> {
  const livreAModifier = await Livre.findOne({ _id: livre._id });
  if (!livreAModifier) {
    console.error(`Le livre avec l'ID ${livre._id} est introuvable.`);
    return livreNull;
  } else {
    // On met à jour tous les champs
    livreAModifier.titreLivre = livre.titreLivre;
    livreAModifier.auteurPrincipal = livre.auteurPrincipal;
    livreAModifier.datePublication = livre.datePublication;
    livreAModifier.nombrePages = livre.nombrePages;
    livreAModifier.estDisponible = livre.estDisponible;
    livreAModifier.isbn = livre.isbn;
    livreAModifier.categories = livre.categories;
    livreAModifier.prixAchat = livre.prixAchat;
    livreAModifier.evaluation = livre.evaluation;
    livreAModifier.commentairesPerso = livre.commentairesPerso;

    await livreAModifier.save();
    return livreAModifier;
  }
}

/**
 * Supprimer un livre
 */
async function deleteOne(id: mongoose.Types.ObjectId): Promise<boolean> {
  const resultat = await Livre.deleteOne({ _id: id });
  if (!resultat) {
    console.error(`Le livre avec l'ID ${id} est introuvable.`);
    return false;
  } else {
    return true;
  }
}

// **** Export default **** //

export default {
  getAll,
  getOne,
  getDisponibles,
  getByCategorie,
  add,
  update,
  deleteOne,
} as const;
