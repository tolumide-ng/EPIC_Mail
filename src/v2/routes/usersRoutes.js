import express from 'express';

import usersHelpers from '../helpers/usersHelpers';
import usersControllers from '../controllers/usersControllers';
import trimmerjs from '../helpers/trimmer';
import userValidation from '../helpers/userValidation';

const { trimmer } = trimmerjs;
const { signUp, login } = usersHelpers;
const { signUpValidator } = userValidation;

const router = express.Router();

router.post('/signup', trimmer, signUpValidator, usersControllers.createUser);
router.post('/login', trimmer, login, usersControllers.login);

export default router;
