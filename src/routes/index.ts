/* Setup des routers de l'API
 * Projet intégrateur - Dev web 3
 */

import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import LivreRoutes from './LivreRoutes';
import AuthRoutes from './AuthRoutes';
import JetonRoutes from './JetonRoutes';
import { verifierAuth } from '@src/middleware/authenticateToken';
import morgan from 'morgan';

// **** Setup **** //

const apiRouter = Router();

// ** Routers ** //

const livreRouter = Router();
const authRouter = Router();
const jetonRouter = Router();

// Routes pour l'authentification (publiques)
authRouter.post(Paths.Auth.Register, AuthRoutes.register);
authRouter.post(Paths.Auth.Login, AuthRoutes.login);

// Routes pour generation de token (publiques)
jetonRouter.post(Paths.GenerateToken.Get, JetonRoutes.generateToken);

// Routes pour les livres
// Routes publiques
livreRouter.get(Paths.Livres.GetAll, LivreRoutes.getAll);
livreRouter.get(Paths.Livres.GetDisponibles, LivreRoutes.getDisponibles);
livreRouter.get(Paths.Livres.GetByCategorie, LivreRoutes.getByCategorie);
livreRouter.get(Paths.Livres.GetById, LivreRoutes.getOne);

// Routes protegees (auth requise)
livreRouter.post(Paths.Livres.Add, verifierAuth, LivreRoutes.add);
livreRouter.put(Paths.Livres.Update, verifierAuth, LivreRoutes.update);
livreRouter.delete(Paths.Livres.Delete, verifierAuth, LivreRoutes.deleteOne);

// Ajouter les routers au router principal
apiRouter.use(Paths.Livres.Base, livreRouter);
apiRouter.use(Paths.Auth.Base, authRouter);
apiRouter.use(Paths.GenerateToken.Base, jetonRouter);

// Pour le logging des requetes
apiRouter.use(morgan('dev'));

// **** Export default **** //

export default apiRouter;
