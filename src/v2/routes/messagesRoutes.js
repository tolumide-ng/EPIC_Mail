import express from 'express';
import passport from 'passport';

import messagesControllers from '../controllers/messagesControllers';
import passportConf from '../passport';
import messageHelpers from '../helpers/messageHelpers';

const { validateBody, schemas } = messageHelpers;

const router = express.Router();

router.post('/', validateBody(schemas.composeMail), messagesControllers.composeMail);
router.get('/unread', messagesControllers.unreadReceivedMails);
router.get('/:id', messagesControllers.getSpecificMail);
router.delete('/:id', messagesControllers.deleteSpecificMail);
export default router;
