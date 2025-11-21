/* Service pour la logique métier des livres
 * Projet intégrateur - Dev web 3
 */

import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import LivreRepo from '@src/repos/LivreRepo';
import { ILivre } from '@src/models/Livre';
import mongoose from 'mongoose';

// **** Constantes **** //

export const LIVRE_NOT_FOUND_ERR = 'Livre introuvable';

// **** Fonctions **** //

/**
 * Lire tous les livres
 */
function getAll(): Promise<ILivre[]> {
  return LivreRepo.getAll();
}

/**
 * Lire un livre par son ID
 */
function getOne(id: mongoose.Types.ObjectId): Promise<ILivre | null> {
  return LivreRepo.getOne(id);
}

/**
 * Lire tous les livres disponibles
 */
function getDisponibles(): Promise<ILivre[]> {
  return LivreRepo.getDisponibles();
}

/**
 * Lire tous les livres par catégorie
 */
function getByCategorie(categorie: string): Promise<ILivre[]> {
  return LivreRepo.getByCategorie(categorie);
}

/**
 * Ajouter un livre
 */
async function addOne(livre: ILivre): Promise<void> {
  return LivreRepo.add(livre);
}

/**
 * Mettre à jour un livre
 */
async function updateOne(livre: ILivre): Promise<ILivre> {
  const persists = await LivreRepo.getOne(livre._id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND,LIVRE_NOT_FOUND_ERR);
  } else {
    return LivreRepo.update(livre);
  }
}

/**
 * Supprimer un livre
 */
async function deleteOne(id: mongoose.Types.ObjectId): Promise<void> {
  const persists = await LivreRepo.getOne(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, LIVRE_NOT_FOUND_ERR);
  } else {
    await LivreRepo.deleteOne(id);
  }
}

// **** Export default **** //

export default {
  getAll,
  getOne,
  getDisponibles,
  getByCategorie,
  addOne,
  updateOne,
  deleteOne,
} as const;
