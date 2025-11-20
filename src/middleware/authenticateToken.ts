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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // check si le token existe
  if (token == null) {
    return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
  }

  console.log(`Vérification du token: ${token}`);

  // vérifie le token
  jwt.verify(
    token,
    ENV.Jwtsecret as string,
    (err: any, user: any) => {
      if (err) {
        return res.sendStatus(HttpStatusCodes.FORBIDDEN);
      }
      // token valide
      next();
    },
  );
}

export default verifierAuth;
