import express from 'express';
import passport from 'passport';

import messagesControllers from '../controllers/messagesControllers';
import passportConf from '../passport';
import messageHelpers from '../helpers/messageHelpers';

const { validateBody, schemas } = messageHelpers;

// // For custom response after passport authentication
// const passportJWT = function (req, res, next) {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err) { return next(err); }
//     if (!user) {
//       return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' });
//     }
//   })(req, res, next);
//   next();
// };

const router = express.Router();

router.post('/', validateBody(schemas.composeMail), messagesControllers.composeMail);
router.get('/:id', messagesControllers.getSpecificMail);
router.delete('/:id', messagesControllers.deleteSpecificMail);

export default router;
