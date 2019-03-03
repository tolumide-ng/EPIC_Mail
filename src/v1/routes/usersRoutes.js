import express from 'express';
import passport from 'passport';

import usersHelpers from './../helpers/usersHelpers';
import usersControllers from '../controllers/usersControllers';
const { validateBody, schemas } = usersHelpers;
const passportConf = require('./../passport');
const passportJWT = passport.authenticate('local', { session: false });

const router = express.Router();

router.post('/signup', validateBody(schemas.authSchema), usersControllers.signup);
router.post('/login', passportJWT, usersControllers.login);

export default router;
