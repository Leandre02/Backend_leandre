import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import server from './server';
import { connect } from 'mongoose';

/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MSG =
  'Express server started on port: ' + ENV.Port.toString();

/******************************************************************************
                                  Run
******************************************************************************/

connect(ENV.Mongodb).then(() =>
  server.listen(ENV.Port, () => logger.info(SERVER_START_MSG)),
);
