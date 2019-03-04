import express from 'express';
import passport from 'passport';

import messagesControllers from './../controllers/messagesControllers';

const router = express.Router();

router.post('/', messagesControllers.createMessage);

export default router;