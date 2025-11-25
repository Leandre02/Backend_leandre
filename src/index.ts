import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import server from './server';
import { connect } from 'mongoose';

/******************************************************************************
                                Constants
******************************************************************************/
const PORT = process.env.PORT || ENV.Port || 3000;

const SERVER_START_MSG = `Express server started on port: ${PORT}`;

/******************************************************************************
                                  Run
******************************************************************************/

connect(ENV.Mongodb).then(() =>
  server.listen(ENV.Port, () => logger.info(SERVER_START_MSG)),
);
