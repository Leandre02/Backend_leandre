/* Tests unitaires pour les routes d'authentification
 * Projet intégrateur - Dev web 3
 */

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { MISSING_FIELDS_ERR} from '@src/routes/AuthRoutes';
import{ USER_ALREADY_EXISTS_ERR} from '@src/services/UserService';
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

describe('AuthRouter', () => {
  // **** Tests REGISTER **** //

  describe(`'POST:${Paths.Auth.Register}'`, () => {
    // Succès
    it(
      `doit retourner le code '${HttpStatusCodes.CREATED}' et un token ` +
        "si l'inscription est réussie.",
      async () => {
        const nouvelUser = {
          nom: 'Paul Tremblay',
          email: 'paul.tremblay@example.com',
          motDePasse: 'motdepasse789',
        };

        // simulacre de Mongoose - user n'existe pas encore
        mockify(User).toReturn(null, 'findOne').toReturn(nouvelUser, 'save');

        const res: TRes<{ message: string; token: string; user: any }> =
          await agent
            .post(Paths.Auth.Register)
            .send(nouvelUser);

        expect(res.status).toBe(HttpStatusCodes.CREATED);
        expect(res.body.message).toBe('Utilisateur créé avec succès');
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe(nouvelUser.email);
      },
    );

    // Champs manquants
    it(
      'doit retourner une erreur et un code ' +
        `'${HttpStatusCodes.BAD_REQUEST}' si des champs sont manquants.`,
      async () => {
        const userIncomplet = {
          nom: 'Test',
          // email et motDePasse manquants
        };

        const res: TRes = await agent
          .post(Paths.Auth.Register)
          .send(userIncomplet);

        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(MISSING_FIELDS_ERR);
      },
    );

    // Utilisateur existe déjà
    it(
      'doit retourner une erreur ' +
        `'${USER_ALREADY_EXISTS_ERR}' et un code ` +
        `'${HttpStatusCodes.BAD_REQUEST}' si l\'email existe déjà.`,
      async () => {
        const userExistant = {
          nom: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          motDePasse: 'password123',
        };

        // simulacre - user existe déjà
        mockify(User).toReturn(DB_USERS[0], 'findOne');

        const res: TRes = await agent
          .post(Paths.Auth.Register)
          .send(userExistant);

        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(USER_ALREADY_EXISTS_ERR);
      },
    );
  });

  // **** Tests LOGIN **** //

  describe(`'POST:${Paths.Auth.Login}'`, () => {
    // Succès
    it(
      `doit retourner le code '${HttpStatusCodes.OK}' et un token ` +
        'si la connexion est réussie.',
      async () => {
        const credentials = {
          email: 'jean.dupont@example.com',
          motDePasse: 'password123',
        };

        // simulacre - user existe avec bon mot de passe
        mockify(User).toReturn(DB_USERS[0], 'findOne');

        const res: TRes<{ message: string; token: string; user: any }> =
          await agent.post(Paths.Auth.Login).send(credentials);

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.message).toBe('Connexion réussie');
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe(credentials.email);
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
          .post(Paths.Auth.Login)
          .send(credentialsIncomplets);

        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(MISSING_FIELDS_ERR);
      },
    );

    // Utilisateur non trouvé
    it(
      'doit retourner une erreur ' +
        `'${UTILISATEUR_NOT_FOUND_ERR}' et un code ` +
        `'${HttpStatusCodes.NOT_FOUND}' si l\'utilisateur n\'existe pas.`,
      async () => {
        const credentials = {
          email: 'non.existant@example.com',
          motDePasse: 'password123',
        };

        // simulacre - user n'existe pas
        mockify(User).toReturn(null, 'findOne');

        const res: TRes = await agent.post(Paths.Auth.Login).send(credentials);

        expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
        expect(res.body.error).toBe(INVALID_CREDENTIALS_ERR);
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

        const res: TRes = await agent.post(Paths.Auth.Login).send(credentials);

        expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
        expect(res.body.error).toBe(INVALID_CREDENTIALS_ERR);
      },
    );
  });
});
