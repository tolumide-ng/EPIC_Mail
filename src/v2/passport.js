import passport from 'passport';
import derivedPassportJwt from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import derivedPassportLocal from 'passport-local';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import db from './db/index';

const JwtStrategy = derivedPassportJwt.Strategy;

dotenv.config();

const helper = {
  async isValid(password, validMailPassword) {
    return await bcrypt.compare(password, validMailPassword);
  },
};


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET_KEY,
}, async (payload, done) => {
  try {
    // find the if user specified in token exists
    const text = 'SELECT * FROM usersTable WHERE id=$1';
    const { rows } = await db.query(text, [payload.sub]);

    // If the user does not exist, handle it
    if (!rows[0]) {
      return done(null, false);
    }

    // Otherwise return the user
    if (rows[0]) {
      const user = rows[0];
      done(null, user);
    }
  } catch (err) {
    throw new Error(err);
  }
}));
