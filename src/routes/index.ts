/* Setup des routers de l'API
 * Projet intégrateur - Dev web 3
 */

import { Router } from 'express';
import Paths from '@src/common/constants/Paths';
import LivreRoutes from './LivreRoutes';
import JetonRoutes from './JetonRoutes';
import { verifierAuth } from '@src/middleware/authenticateToken';
import morgan from 'morgan';

// **** Setup **** //

const apiRouter = Router();

// ** Routers ** //

const livreRouter = Router();
const authRouter = Router();
const tokenRouter = Router();
const userRouter = Router();

// Generate Token
tokenRouter.get(Paths.GenerateToken.Get, JetonRoutes.generateToken);

// ** Add tokenRouter ** //
apiRouter.use(Paths.GenerateToken.Base, tokenRouter);

// Routes pour les livres
// Routes publiques
livreRouter.get(Paths.Livres.GetAll, LivreRoutes.getAll);
livreRouter.get(Paths.Livres.GetDisponibles, LivreRoutes.getDisponibles);
livreRouter.get(Paths.Livres.GetByCategorie, LivreRoutes.getByCategorie);
livreRouter.get(Paths.Livres.GetById, LivreRoutes.getOne);

// Routes protégées (auth requise)
livreRouter.post(Paths.Livres.Add, verifierAuth, LivreRoutes.add);
livreRouter.put(Paths.Livres.Update, verifierAuth, LivreRoutes.update);
livreRouter.delete(Paths.Livres.Delete, verifierAuth, LivreRoutes.deleteOne);

// Routes pour l'authentification
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);


// Ajouter les routers au router principal
apiRouter.use(Paths.Livres.Base, livreRouter);
apiRouter.use(Paths.Auth.Base, authRouter);
apiRouter.use(Paths.Users.Base, userRouter);

// Pour le logging des requêtes
apiRouter.use(morgan('dev'));


// **** Export default **** //

export default apiRouter;
