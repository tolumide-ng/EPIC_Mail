import express from 'express';
import passport from 'passport';

import groupsControllers from './../controllers/groupsControllers';
import passportConf from './../passport';
import groupHelpers from './../helpers/groupsHelpers';

const { validateBody, schemas } = groupHelpers

const router = express.Router();

router.post('/', validateBody(schemas.createGroup), groupsControllers.createGroup);

export default router;