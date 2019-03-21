import express from 'express';

import messagesControllers from '../controllers/messagesControllers';
import messageHelpers from '../helpers/messageHelpers';
import tokenVerification from '../helpers/tokenVerification';
import trimmerjs from '../helpers/trimmer';

const { trimmer } = trimmerjs;
const { verifyToken, validateToken } = tokenVerification;
const { composeMail } = messageHelpers;
const router = express.Router();

router.post('/', trimmer, composeMail, verifyToken, validateToken, messagesControllers.composeMail);
router.get('/unread', verifyToken, validateToken, messagesControllers.unreadReceivedMails);
router.get('/received', verifyToken, validateToken, messagesControllers.allReceivedMails);
router.get('/sent', verifyToken, validateToken, messagesControllers.allSentMails);
router.get('/:id', verifyToken, validateToken, messagesControllers.getSpecificMail);
router.delete('/:id', verifyToken, validateToken, messagesControllers.deleteSpecificMail);
export default router;
