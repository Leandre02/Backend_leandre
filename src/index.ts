import logger from 'jet-logger';
import mongoose, { connect } from 'mongoose';

import ENV from '@src/common/constants/ENV';
import server from './server';

/******************************************************************************
                                 Constants
******************************************************************************/

const PORT = process.env.PORT || ENV.Port || 3000;

const SERVER_START_MSG = `Express server started on port: ${PORT}`;

/******************************************************************************
                                   Run
******************************************************************************/

// Patch temporaire pour gérer la connexion asynchrone à MongoDB avant de démarrer le serveur
async function start() {
  try {
    // On essaye d'abord de se connecter à Mongo
    await connect(ENV.Mongodb, { dbName: 'mycharacters' });
    logger.info('MongoDB connecté: db="${mongoose.connection.name}');
    logger.info(
      `Collections visibles: ${Object.keys( mongoose.connection.collections,
      ).join(', ')}`,
    );
  } catch (err) {
    // On log l'erreur mais on ne bloque pas le démarrage du serveur
    logger.err('Erreur de connexion MongoDB', true);
  }

  // On démarre le serveur dans tous les cas
  server.listen(PORT, () => {
    logger.info(SERVER_START_MSG);
  });
}

start();
