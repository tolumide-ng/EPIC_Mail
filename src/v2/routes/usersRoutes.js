import express from 'express';
import passport from 'passport';

import usersHelpers from '../helpers/usersHelpers';
import usersControllers from '../controllers/usersControllers';
import passportConf from '../passport';

const { validateBody, schemas } = usersHelpers;

const passportLocal = function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({ status: 401, err: 'Unauthorized, Email or passwod does not maych' });
    }
  })(req, res, next);
  next();
};

const router = express.Router();

router.post('/signup', validateBody(schemas.authSchema), usersControllers.createUser);
router.post('/login', validateBody(schemas.loginSchema), passportLocal, usersControllers.login);

export default router;
