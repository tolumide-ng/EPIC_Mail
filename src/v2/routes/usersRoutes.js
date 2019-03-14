import express from 'express';
import passport from 'passport';

import usersHelpers from '../helpers/usersHelpers';
import usersControllers from '../controllers/usersControllers';

const router = express.Router();
const { validateBody, schemas } = usersHelpers;

router.post('/signup', validateBody(schemas.authSchema), usersControllers.createUser);

export default router;
