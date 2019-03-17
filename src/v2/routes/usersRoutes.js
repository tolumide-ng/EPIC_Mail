import express from 'express';
import passport from 'passport';

import usersHelpers from '../helpers/usersHelpers';
import usersControllers from '../controllers/usersControllers';
import passportConf from '../passport';

const { validateBody, schemas } = usersHelpers;

const router = express.Router();

router.post('/signup', validateBody(schemas.authSchema), usersControllers.createUser);
router.post('/login', validateBody(schemas.loginSchema), usersControllers.login);

export default router;
