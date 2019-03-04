import express from 'express';
import passport from 'passport';

import messagesControllers from './../controllers/messagesControllers';
import messageHelpers from './../helpers/messagesHelpers';
const { validateBody, schemas } = messageHelpers;
import passportConf from './../passport';

// For passport custom authenitcation
const passportJWT = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, userExist, info) {
        if (err) { return next(err) }
        if (!userExist) {
            return res.status(401).json({ status: 401, error: 'Auth Error, Email and Password does not match' });
        }
    })(req, res, next)
    next();
}




const router = express.Router();

router.post('/', validateBody(schemas.authSchema), passportJWT, messagesControllers.createMessage);

export default router;