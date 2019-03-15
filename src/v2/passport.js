import passport from 'passport';
import derivedPassportJwt from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import derivedPassportLocal from 'passport-local';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import db from './db/index';

const JwtStrategy = derivedPassportJwt.Strategy;
const LocalStrategy = derivedPassportLocal.Strategy;

dotenv.config();

const helper = {
  async isValid(password, validMailPassword) {
    return await bcrypt.compare(password, validMailPassword);
  },
};


// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    // Does the email exist?
    const text = `SELECT * FROM usersTable WHERE email=$1`;
    const { rows } = await db.query(text, [email]);
    console.log(rows[0]);

    // If not, handle it
    if (!rows[0]) {
      return done(null, false);
    }
    console.log('didi you come here again?')
    // User exists, confirm password
    const confirmPasswordMatch = helper.isValid(password, rows[0].password);

    // If not, handle it
    if (rows[0] && !confirmPasswordMatch) {
      return 'no usert'
    }

    // Everything is okay, return the user
    done(null, rows[0]);
  } catch (err) {
    throw new Error(err);
  }
}));
