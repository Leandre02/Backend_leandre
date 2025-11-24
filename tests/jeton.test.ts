/* Tests unitaires pour les routes de génération de tokens
 * Projet intégrateur - Dev web 3
 */

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import {
  UTILISATEUR_NOT_FOUND_ERR,
  INVALID_CREDENTIALS_ERR,
} from '@src/routes/JetonRoutes';

import Paths from './common/Paths';
import { TRes } from './common/util';
import { agent } from './support/setup';
import { Types } from 'mongoose';
import { IUser, User } from '@src/models/User';

/******************************************************************************
                               Constants
******************************************************************************/

// Données de test pour les utilisateurs
const DB_USERS: IUser[] = [
  {
    _id: new Types.ObjectId('507f1f77bcf86cd799439021'),
    nom: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    motDePasse: 'password123',
    dateCreation: new Date(),
  },
  {
    _id: new Types.ObjectId('507f1f77bcf86cd799439022'),
    nom: 'Marie Martin',
    email: 'marie.martin@example.com',
    motDePasse: 'secure456',
    dateCreation: new Date(),
  },
] as const;

const mockify = require('@jazim/mock-mongoose');

/******************************************************************************
                                 Tests
******************************************************************************/

describe('JetonRouter', () => {
  // **** Tests GENERATE TOKEN **** //

  describe(`'POST:${Paths.GenerateToken.Get}'`, () => {
    // Succès
    it(
      `doit retourner le code '${HttpStatusCodes.OK}' et un token ` +
        'si les credentials sont valides.',
      async () => {
        const credentials = {
          email: 'jean.dupont@example.com',
          motDePasse: 'password123',
        };

        // simulacre - user existe avec bon mot de passe
        mockify(User).toReturn(DB_USERS[0], 'findOne');

        const res: TRes<{ token: string }> = await agent
          .post(Paths.GenerateToken.Get)
          .send(credentials);

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.token).toBeDefined();
        expect(typeof res.body.token).toBe('string');
      },
    );

    // Champs manquants
    it(
      'doit retourner une erreur et un code ' +
        `'${HttpStatusCodes.BAD_REQUEST}' si des champs sont manquants.`,
      async () => {
        const credentialsIncomplets = {
          email: 'jean.dupont@example.com',
          
        };

        const res: TRes = await agent
          .post(Paths.GenerateToken.Get)
          .send(credentialsIncomplets);

        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe('Email et mot de passe requis');
      },
    );

    // Utilisateur non trouvé
    it(
      'doit retourner une erreur ' +
        `'${UTILISATEUR_NOT_FOUND_ERR}' et un code ` +
        `'${HttpStatusCodes.NOT_FOUND}' si l\'utilisateur n\'existe pas.`,
      async () => {
        const credentials = {
          email: 'inconnu@example.com',
          motDePasse: 'password123',
        };

        // simulacre - user n'existe pas
        mockify(User).toReturn(null, 'findOne');

        const res: TRes = await agent
          .post(Paths.GenerateToken.Get)
          .send(credentials);

        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(UTILISATEUR_NOT_FOUND_ERR);
      },
    );

    // Mot de passe incorrect
    it(
      'doit retourner une erreur ' +
        `'${INVALID_CREDENTIALS_ERR}' et un code ` +
        `'${HttpStatusCodes.UNAUTHORIZED}' si le mot de passe est incorrect.`,
      async () => {
        const credentials = {
          email: 'jean.dupont@example.com',
          motDePasse: 'mauvais_password',
        };

        // simulacre - user existe mais mauvais mot de passe
        mockify(User).toReturn(DB_USERS[0], 'findOne');

        const res: TRes = await agent
          .post(Paths.GenerateToken.Get)
          .send(credentials);

        expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
        expect(res.body.error).toBe(INVALID_CREDENTIALS_ERR);
      },
    );
  });
});
