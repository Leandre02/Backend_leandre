import insertUrlParams from 'inserturlparams';
import { customDeepCompare } from 'jet-validators/utils';

import LivreRepo
import Livre  from '@src/models/Livre';
import {LIVRE_NOT_FOUND_ERR} from '@src/services/LivreService';


import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { ValidationError } from '@src/common/util/route-errors';

import Paths from '@src/common/constants/Paths';
import { parseValidationErr, TRes } from './common/util';
import { agent } from './support/setup';

// Données bidon pour les tests ( simulacre de Get)
const livresTest = [
    LivreService.