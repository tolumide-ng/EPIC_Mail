import express from 'express';
import usersControllers from '../controllers/usersControllers';

const router = express.Router();

router.post('/signup', usersControllers.signup);

export default router;
