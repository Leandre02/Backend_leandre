/* Setup pour les tests avec Supertest
 * Projet intégrateur - Dev web 3
 */

import { beforeAll } from 'vitest';
import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import app from '@src/server';

/******************************************************************************
                                    Run
******************************************************************************/

let agent: TestAgent<Test>;

beforeAll(async () => {
  agent = supertest.agent(app);
});

/******************************************************************************
                                    Export
******************************************************************************/

export { agent };
