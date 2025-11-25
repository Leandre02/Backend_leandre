/* Middleware d'authentification JWT
 * Projet intégrateur - Dev web 3
 */

import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ENV from '@src/common/constants/ENV';

/**
 * Middleware pour authentifier le token JWT
 */
export function verifierAuth(req: Request, res: Response, next: NextFunction) {
  
  // Ne pas vérifier le token si l'url est celui de la liste des exceptions
  const routesPubliques = [
    '/api/generatetoken/',
    '/api/generatetoken',
    '/api/auth/register/',
    '/api/auth/register',
    '/api/auth/login/',
    '/api/auth/login',
  ];

  if (routesPubliques.includes(req.originalUrl)) {
    return next();
  }


  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  // check si le token existe
  if (token == null) {
    return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
  }

  // console.log(`Vérification du token: ${token}`);

  // vérifie le token
  jwt.verify(token, ENV.Jwtsecret, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(HttpStatusCodes.FORBIDDEN);
    }
    // token valide
    next();
  });
}

export default verifierAuth;
