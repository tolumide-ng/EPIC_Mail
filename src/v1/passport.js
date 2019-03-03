import passport from 'passport';
import derivedPassportJwt from 'passport-jwt';
const JWTStrategy = derivedPassportJwt.Strategy;
import bcrypt from 'bcryptjs';
import { ExtractJwt } from 'passport-jwt';
import derivedPassportLocal from 'passport-local';
const LocalStrategy = derivedPassportLocal;

import dotenv from 'dotenv';

import usersModels from './models/usersModels';

dotenv.config();


// JSON WEB TOKENS STRATEGY
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.SECRET_KEY
}, async (payload, done) => {
    try {
        // Find the user specified in the token
        const userExist = usersModels.findUserById(payload.sub);

        // If user doesn't exist, handle it 
        if (!userExist) {
            return done(null, false);
        }
        done(null, userExist);

    } catch (err) {
        done(err, false);
    }
}));


// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    // Find the user with the given email
    const user = usersModels.findUserByEmail(email);

    // If the email does not exist, handle it
    if (!user) {
        return done(null, false);
    }

    // If the user is found, check if the password is correct 
    const passwordMatch = bcrypt.compareSync(password, user.password);

    // If not handle it 
    if (!passwordMatch) {
        return done(null, false);
    }
    // Otherwsise, success! return user
    done(null, user);
}))