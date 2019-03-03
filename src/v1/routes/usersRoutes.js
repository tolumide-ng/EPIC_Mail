import express from 'express';
import usersHelpers from './../helpers/usersHelpers';
import usersControllers from '../controllers/usersControllers';
const {validateBody, schemas} = usersHelpers;

const router = express.Router();

router.post('/signup', validateBody(schemas.authSchema), usersControllers.signup);

export default router;
