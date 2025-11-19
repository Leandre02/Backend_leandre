/* Routes et controllers pour les livres
 * Projet intégrateur - Dev web 3
 */

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

import { IReq, IRes } from './common/types';
import LivreService from '@src/services/LivreService';
import { ILivre } from '@src/models/Livre';
import mongoose from 'mongoose';

// **** Constantes **** //

export const LIVRE_NOT_FOUND_ERR = 'Livre introuvable';
export const INVALID_ID_ERR = 'ID de livre invalide';
export const INVALID_CATEGORIE_ERR = 'Catégorie invalide';
export const NO_BOOKS_FOUND_ERR = 'Aucun livre trouvé pour cette catégorie';

// **** Fonctions **** //

/**
 * Extraire tous les livres
 */
async function getAll(_: IReq, res: IRes) {
  const livres = await LivreService.getAll();
  res.status(HttpStatusCodes.OK).json({ livres });
}

/**
 * Extraire un livre par son ID
 */
async function getOne(req: IReq, res: IRes) {
  const id = req.params.id;

  // Vérifier si l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: INVALID_ID_ERR });
  } else {
    // continue
  }

  const livre = await LivreService.getOne(new mongoose.Types.ObjectId(id));

  // Check si le livre existe
  if (!livre || livre.titreLivre === '') {
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ error: LIVRE_NOT_FOUND_ERR });
  } else {
    return res.status(HttpStatusCodes.OK).json({ livre });
  }
}

/**
 * Extraire tous les livres disponibles
 */
async function getDisponibles(_: IReq, res: IRes) {
  const livres = await LivreService.getDisponibles();
  res.status(HttpStatusCodes.OK).json({ livres });
}

/**
 * Extraire tous les livres par catégorie
 */
async function getByCategorie(req: IReq, res: IRes) {
  const categorie = req.params.categorie;

  if (!categorie) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: INVALID_CATEGORIE_ERR });
  } else {
    // continue
  }

  const livres = await LivreService.getByCategorie(categorie);

  if (livres.length === 0) {
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ error: NO_BOOKS_FOUND_ERR });
  } else {
    return res.status(HttpStatusCodes.OK).json({ livres });
  }
}

/**
 * Ajouter un livre
 */
async function add(req: IReq, res: IRes) {
  const { livre } = req.body;

  try {
    await LivreService.addOne(livre as ILivre);
    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: 'Livre ajouté avec succès' });
  } catch (erreur: any) {
    // Erreur de validation Mongoose
    if (erreur.name === 'ValidationError') {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Erreur de validation', details: erreur.message });
    } else {
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur lors de l'ajout du livre" });
    }
  }
}

/**
 * Mettre à jour un livre
 */
async function update(req: IReq, res: IRes) {
  const { livre } = req.body;
  const id = req.params.id;

  // Vérifier si l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: INVALID_ID_ERR });
  } else {
    // continue
  }

  // On ajoute l'ID du paramètre au livre
  livre._id = new mongoose.Types.ObjectId(id);

  try {
    await LivreService.updateOne(livre as ILivre);
    res
      .status(HttpStatusCodes.OK)
      .json({ message: 'Livre modifié avec succès' });
  } catch (erreur: any) {
    if (erreur.message === LivreService.LIVRE_NOT_FOUND_ERR) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: LIVRE_NOT_FOUND_ERR });
    } else if (erreur.name === 'ValidationError') {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Erreur de validation', details: erreur.message });
    } else {
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erreur lors de la modification du livre' });
    }
  }
}

/**
 * Supprimer un livre
 */
async function deleteOne(req: IReq, res: IRes) {
  const id = req.params.id;

  // Vérifier si l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: INVALID_ID_ERR });
  } else {
    // continue
  }

  try {
    await LivreService.deleteOne(new mongoose.Types.ObjectId(id));
    res
      .status(HttpStatusCodes.OK)
      .json({ message: 'Livre supprimé avec succès' });
  } catch (erreur: any) {
    if (erreur.message === LivreService.LIVRE_NOT_FOUND_ERR) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: LIVRE_NOT_FOUND_ERR });
    } else {
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erreur lors de la suppression du livre' });
    }
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
