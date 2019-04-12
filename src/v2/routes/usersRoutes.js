import express from 'express';

import usersControllers from '../controllers/usersControllers';
import trimmerjs from '../helpers/trimmer';
import userValidation from '../helpers/userValidation';

const { trimmer } = trimmerjs;
const { signUpValidator, loginValidator, resetValidator } = userValidation;

const router = express.Router();

router.post('/reset', trimmer, resetValidator, usersControllers.passwordReset);
router.post('/signup', trimmer, signUpValidator, usersControllers.createUser);
router.post('/login', trimmer, loginValidator, usersControllers.login);

export default router;
