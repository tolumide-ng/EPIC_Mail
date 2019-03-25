import express from 'express';

import messagesControllers from '../controllers/messagesControllers';
import tokenVerification from '../helpers/tokenVerification';
import trimmerjs from '../helpers/trimmer';
import messageValidator from '../helpers/messageValidator';

const { trimmer } = trimmerjs;
const { verifyToken, validateToken } = tokenVerification;
const { composeMailValidator } = messageValidator;
const router = express.Router();

router.post('/', trimmer, composeMailValidator, verifyToken, validateToken, messagesControllers.composeMail);
router.get('/unread', verifyToken, validateToken, messagesControllers.unreadReceivedMails);
router.get('/received', verifyToken, validateToken, messagesControllers.allReceivedMails);
router.get('/sent', verifyToken, validateToken, messagesControllers.allSentMails);
router.get('/:id', verifyToken, validateToken, messagesControllers.getSpecificMail);
router.delete('/:id', verifyToken, validateToken, messagesControllers.deleteSpecificMail);
export default router;
