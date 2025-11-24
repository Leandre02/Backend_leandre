/* Tests unitaires pour les routes de livres
 * Projet intégrateur - Dev web 3
 */

import { beforeAll } from 'vitest';
import { IUser, User } from '@src/models/User';

import insertUrlParams from 'inserturlparams';
import { customDeepCompare } from 'jet-validators/utils';

import { LIVRE_NOT_FOUND_ERR } from '@src/services/LivreService';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

import Paths from './common/Paths';
import { TRes } from './common/util';
import { agent } from './support/setup';
import { Types } from 'mongoose';
import { ILivre, Livre } from '@src/models/Livre';

/******************************************************************************
                               Constants
******************************************************************************/
// Données de test pour les livres
const DB_LIVRES: ILivre[] = [
  {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    titreLivre: '1984',
    auteurPrincipal: 'George Orwell',
    datePublication: new Date('1949-06-08'),
    nombrePages: 328,
    estDisponible: true,
    isbn: '978-0-45-228423-4',
    categories: ['Fiction', 'Dystopie', 'Classique'],
    prixAchat: 25.99,
    evaluation: 5,
    commentairesPerso: "Un chef-d'oeuvre intemporel",
  },
  {
    _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
    titreLivre: 'Le Seigneur des Anneaux',
    auteurPrincipal: 'J.R.R. Tolkien',
    datePublication: new Date('1954-07-29'),
    nombrePages: 1178,
    estDisponible: false,
    isbn: '978-2-26-607200-8',
    categories: ['Fantastique', 'Aventure'],
    prixAchat: 45.5,
    evaluation: 5,
  },
  {
    _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
    titreLivre: 'Dune',
    auteurPrincipal: 'Frank Herbert',
    datePublication: new Date('1965-06-01'),
    nombrePages: 896,
    estDisponible: true,
    isbn: '978-0-44-117271-9',
    categories: ['Science-Fiction', 'Aventure'],
    prixAchat: 42.99,
  },
] as const;

let tokenValide: string;

const DB_USER_TOKEN: IUser = {
  _id: new Types.ObjectId('507f1f77bcf86cd799439021'),
  nom: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  motDePasse: 'password123',
  dateCreation: new Date(),
};


// Comparateur pour les livres
const compareLivresArrays = customDeepCompare({
  onlyCompareProps: ['titreLivre', 'auteurPrincipal', 'isbn', 'estDisponible'],
});

const mockify = require('@jazim/mock-mongoose');

/******************************************************************************
                                 Tests
******************************************************************************/

describe('LivreRouter', () => {

  beforeAll(async () => {
  // simulacre - pour que /generatetoken trouve un user
  mockify(User).toReturn(DB_USER_TOKEN, 'findOne');

  const res = await agent
    .post(Paths.GenerateToken.Get)
    .send({
      email: DB_USER_TOKEN.email,
      motDePasse: DB_USER_TOKEN.motDePasse,
    });

  tokenValide = res.body.token;
});


  // **** Tests GET ALL **** //

  // Extraire tous les livres
  describe(`'GET:${Paths.Livres.GetAll}'`, () => {
    // Succès
    it(
      'doit retourner un JSON avec tous les livres et un code ' +
        `'${HttpStatusCodes.OK}' si réussi.`,
      async () => {
        // simulacre de Mongoose
        const data = [...DB_LIVRES];
        mockify(Livre).toReturn(data, 'find');

        // Requête HTTP GET
        const res: TRes<{ livres: ILivre[] }> = await agent.get(
          Paths.Livres.GetAll,
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(compareLivresArrays(res.body.livres, DB_LIVRES)).toBeTruthy();
      },
    );
  });

  // **** Tests GET BY ID **** //

  describe(`'GET:${Paths.Livres.GetById}'`, () => {
    const getPath = (id: string | Types.ObjectId) =>
      insertUrlParams(Paths.Livres.GetById, { id: id.toString() });

    // Succès
    it(
      `doit retourner un livre et un code '${HttpStatusCodes.OK}' ` +
        "si l'ID est valide.",
      async () => {
        const livre = DB_LIVRES[0];

        // simulacre de Mongoose
        mockify(Livre).toReturn(livre, 'findOne');

        // Requête HTTP GET avec ID valide
        const res: TRes<{ livre: ILivre }> = await agent.get(
          getPath(livre._id),
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.livre.titreLivre).toBe(livre.titreLivre);
      },
    );

    // ID invalide
    it(
      'doit retourner une erreur et un code ' +
        `'${HttpStatusCodes.BAD_REQUEST}' si l\'ID est invalide.`,
      async () => {
        // Requête HTTP GET avec un string invalide comme ID
        const res: TRes = await agent.get(getPath('id_invalide'));

        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe('ID de livre invalide');
      },
    );

    // Livre non trouvé
    it(
      'doit retourner une erreur et un code ' +
        `'${HttpStatusCodes.NOT_FOUND}' si le livre n\'existe pas.`,
      async () => {
        // simulacre qui retourne null
        mockify(Livre).toReturn(null, 'findOne');

        // Requête HTTP GET avec un ID valide mais inexistant
        const res: TRes = await agent.get(getPath('507f1f77bcf86cd799439999'));

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe('Livre introuvable');
      },
    );
  });

  // **** Tests GET DISPONIBLES **** //

  describe(`'GET:${Paths.Livres.GetDisponibles}'`, () => {
    // Succès
    it(
      'doit retourner uniquement les livres disponibles et un code ' +
        `'${HttpStatusCodes.OK}'.`,
      async () => {
        const livresDisponibles = DB_LIVRES.filter(
          (livre) => livre.estDisponible,
        );

        // simulacre de Mongoose
        mockify(Livre).toReturn(livresDisponibles, 'find');

        // Requête HTTP GET pour les livres disponibles
        const res: TRes<{ livres: ILivre[] }> = await agent.get(
         Paths.Livres.GetDisponibles,
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.livres.length).toBe(livresDisponibles.length);
      },
    );
  });

  // **** Tests GET BY CATEGORIE **** //

  describe(`'GET:${Paths.Livres.GetByCategorie}'`, () => {
    const getPath = (categorie: string) =>
      insertUrlParams(Paths.Livres.GetByCategorie, { categorie });

    // Succès
    it(
      'doit retourner les livres de la catégorie demandée et un code ' +
        `'${HttpStatusCodes.OK}'.`,
      async () => {
        const categorie = 'Science-Fiction';
        const livresCategorie = DB_LIVRES.filter((livre) =>
          livre.categories.includes(categorie),
        );

        // simulacre de Mongoose
        mockify(Livre).toReturn(livresCategorie, 'find');

        // Requête HTTP GET pour les livres par catégorie
        const res: TRes<{ livres: ILivre[] }> = await agent.get(
          getPath(categorie),
        );

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.livres.length).toBe(livresCategorie.length);
      },
    );

    // Aucun livre trouvé
    it(
      'doit retourner une erreur et un code ' +
        `'${HttpStatusCodes.NOT_FOUND}' si aucun livre n\'est trouvé.`,
      async () => {
        // simulacre qui retourne tableau vide
        mockify(Livre).toReturn([], 'find');

        // Requête HTTP GET pour une catégorie inexistante
        const res: TRes = await agent.get(getPath('CategorieInexistante'));

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe('Aucun livre trouvé pour cette catégorie');
      },
    );
  });

  // **** Tests POST **** //

  describe(`'POST:${Paths.Livres.Add}'`, () => {
    // Succès
    it(
      `doit retourner le code '${HttpStatusCodes.CREATED}' ` +
        "si l'ajout est réussi.",
      async () => {
        const nouveauLivre: ILivre = {
          _id: new Types.ObjectId('507f1f77bcf86cd799439014'),
          titreLivre: 'Fondation',
          auteurPrincipal: 'Isaac Asimov',
          datePublication: new Date('1951-05-01'),
          nombrePages: 256,
          estDisponible: true,
          isbn: '978-2-29-033158-2',
          categories: ['Science-Fiction'],
          prixAchat: 21.5,
          evaluation: 4,
        };

        // simulacre de Mongoose
        mockify(Livre).toReturn(nouveauLivre, 'save');

        // Requête HTTP POST pour ajouter un nouveau livre
        const res = await agent
          .post(Paths.Livres.Add)
          .set('Authorization', `Bearer ${tokenValide}`)
          .send({ livre: nouveauLivre });

        expect(res.status).toBe(HttpStatusCodes.CREATED);
      },
    );

    // Validation échouée
    it(
      'doit retourner une erreur et un code ' +
        `'${HttpStatusCodes.BAD_REQUEST}' si la validation échoue.`,
      async () => {
        const res: TRes = await agent
          .post(Paths.Livres.Add)
          .set('Authorization', `Bearer ${tokenValide}`)
          .send({ livre: null });

        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe('Erreur de validation');
      },
    );
  });

  // **** Tests PUT **** //

  describe(`'PUT:${Paths.Livres.Update}'`, () => {
    const getPath = (id: string | Types.ObjectId) =>
      insertUrlParams(Paths.Livres.Update, { id: id.toString() });

    // Succès
    it(
      `doit retourner un code '${HttpStatusCodes.OK}' ` +
        'si la modification est réussie.',
      async () => {
        const livre = { ...DB_LIVRES[0] };
        livre.evaluation = 4;

        // simulacre de Mongoose
        mockify(Livre).toReturn(livre, 'findOne').toReturn(livre, 'save');

        // Requête HTTP PUT pour modifier un livre (avec l'ID dans l'URL)
        const res = await agent
          .put(getPath(livre._id))
          .set('Authorization', `Bearer ${tokenValide}`)
          .send({ livre });

        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Livre non trouvé
    it(
      'doit retourner une erreur ' +
        `'${LIVRE_NOT_FOUND_ERR}' et un code ` +
        `'${HttpStatusCodes.NOT_FOUND}' si le livre n\'existe pas.`,
      async () => {
        // simulacre qui retourne null
        mockify(Livre).toReturn(null, 'findOne');
        const livreIntrouvable = {
          ...DB_LIVRES[0],
          _id: new Types.ObjectId('507f1f77bcf86cd799439999'),
        };

        // Requête HTTP PUT pour modifier un livre inexistant
        const res: TRes = await agent
          .put(getPath(livreIntrouvable._id))
          .set('Authorization', `Bearer ${tokenValide}`)
          .send({ livre: livreIntrouvable });

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(LIVRE_NOT_FOUND_ERR);
      },
    );
  });

  // **** Tests DELETE (suppression) **** //

  describe(`'DELETE:${Paths.Livres.Delete}'`, () => {
    const getPath = (id: string | Types.ObjectId) =>
      insertUrlParams(Paths.Livres.Delete, { id: id.toString() });

    // Succès
    it(
      `doit retourner un code '${HttpStatusCodes.OK}' ` +
        'si la suppression est réussie.',
      async () => {
        const livre = DB_LIVRES[0];

        // simulacre de Mongoose
        mockify(Livre)
          .toReturn(livre, 'findOne')
          .toReturn({ deletedCount: 1 }, 'deleteOne');

        const res = await agent
        .delete(getPath(livre._id))
        .set('Authorization', `Bearer ${tokenValide}`);

        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Livre non trouvé
    it(
      'doit retourner une erreur ' +
        `'${LIVRE_NOT_FOUND_ERR}' et un code ` +
        `'${HttpStatusCodes.NOT_FOUND}' si le livre n\'existe pas.`,
      async () => {
        // simulacre qui retourne null
        mockify(Livre).toReturn(null, 'findOne');

        const res: TRes = await agent
        .delete(
          getPath('507f1f77bcf86cd799439999'),
        )
        .set('Authorization', `Bearer ${tokenValide}`);

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(LIVRE_NOT_FOUND_ERR);
      },
    );

    // ID invalide
    it(
      'doit retourner une erreur et un code ' +
        `'${HttpStatusCodes.BAD_REQUEST}' si l\'ID est invalide.`,
      async () => {
        const res: TRes = await agent
        .delete(getPath('id_invalide'))
        .set('Authorization', `Bearer ${tokenValide}`);

        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe('ID de livre invalide');
      },
    );
  });
});
