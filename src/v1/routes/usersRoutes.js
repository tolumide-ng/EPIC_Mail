import express from 'express';
import passport from 'passport';

import usersHelpers from '../helpers/usersHelpers';
import usersControllers from '../controllers/usersControllers';

const { validateBody, schemas } = usersHelpers;
import passportConf from './../passport';
// const passportLocal = passport.authenticate('local', { session: false });
const passportLocal = function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({ status: 401, error: 'Unauthorized, Email or password does not match' });
    }
  })(req, res, next);
  next();
};

const router = express.Router();

router.post('/signup', validateBody(schemas.authSchema), usersControllers.signup);
router.post('/login', validateBody(schemas.loginSchema), passportLocal, usersControllers.login);

export default router;
