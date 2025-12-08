import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import BaseRouter from '@src/routes';

import Paths from '@src/common/constants/Paths';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/util/route-errors';
import { NodeEnvs } from '@src/common/constants';
import cors from 'cors';

/******************************************************************************
                                Setup
******************************************************************************/

const app = express();

// **** CORS **** //
app.use(cors());

// **** Middleware **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}
// Swagger UI
const cheminDocApi = path.join(__dirname, 'config', 'documentation.json');
const documentation = JSON.parse(fs.readFileSync(cheminDocApi, 'utf-8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentation, {
  customSiteTitle: 'backend_bibliothèque - API docs',
}));



// Route de test du serveur
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

// **** FrontEnd Content **** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// rend disponible la documentation de l'interface logicielle
app.get('/api-docs/', async (req, res) => {
    res.set('Content-Security-Policy', 'script-src blob:');
    res.set('Content-Security-Policy', 'worker-src blob:');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// redirige vers api-docs
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
