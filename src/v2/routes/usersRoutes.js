import express from 'express';
import passport from 'passport';

import usersHelpers from '../helpers/usersHelpers';
import usersControllers from '../controllers/usersControllers';
import passportConf from '../passport';

const { validateBody, schemas } = usersHelpers;

// const passportLocal = function (req, res, next) {
//   passport.authenticate('local', { session: false }, function(err, user, info){
//     if (err) { return next(err); }
//     if(user) {
//       next();
//     }
//     if (!user) {
//       return res.status(401).json({ status: 401, error: 'Unauthorized, Email or password does not match' });
//     }
//   })(req, res, next);
// };

const router = express.Router();

router.post('/signup', validateBody(schemas.authSchema), usersControllers.createUser);
router.post('/login', validateBody(schemas.loginSchema), usersControllers.login);

export default router;
