import express from 'express';

import usersHelpers from '../helpers/usersHelpers';
import usersControllers from '../controllers/usersControllers';
import trimmerjs from '../helpers/trimmer';

const { trimmer } = trimmerjs;
const { signUp, login } = usersHelpers;

const router = express.Router();

router.post('/signup', trimmer, signUp, usersControllers.createUser);
router.post('/login', trimmer, login, usersControllers.login);

export default router;
