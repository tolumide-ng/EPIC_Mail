import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import db from '../db/index';

dotenv.config();

const helper = {
  async hashPassword(password) {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  },

  async isValid(password, validMailPassword) {
    return await bcrypt.compare(password, validMailPassword);
  },
};

class User {
  static signToken(rows) {
    return jwt.sign({
      iss: 'tolumide',
      sub: rows,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    }, process.env.SECRET_KEY);
  }

  async createUser(req, res) {
    const {
      firstName, lastName, email, password,
    } = req.value.body;
    const searchText = 'SELECT * FROM usersTable WHERE email=$1';
    const searchValue = [email];
    const text = `INSERT INTO usersTable(firstName, lastName, email, password)
        VALUES($1, $2, $3, $4) returning *`;
    const theHashedPassword = await helper.hashPassword(password);
    const values = [firstName, lastName, email, theHashedPassword];

    try {
      const { rows } = await db.query(searchText, searchValue);
      if (!rows[0]) {
        const { rows } = await db.query(text, values);
        const token = await User.signToken(rows[0].id);
        return res.status(201).json({ status: 201, data: [{ token, email: rows[0].email }] });
      }
      return res.status(409).json({ status: 409, error: 'Please use a different email, Email already exists' });
    } catch (err) {
      return res.status(400).json({ status: 400, error: `${err.name}, ${err.message}` });
    }
  }


  // Method to login the user
  async login(req, res) {
    const request = req.value.body;
    const { email, password } = req.value.body;
    try {
      const text = 'SELECT * FROM usersTable WHERE email=$1';
      const { rows } = await db.query(text, [email]);
      if (!rows[0]) {
        return res.status(401).json({ status: 401, error: 'User authentication error, please confirm email/password' });
      }
      const confirmPasswordMatch = await helper.isValid(password, rows[0].password);
      if (!confirmPasswordMatch) {
        return res.status(401).json({ status: 401, error: 'User authentication error, please confirm email/password' });
      }
      const token = User.signToken(password, rows[0].password);
      return res.status(200).json({ status: 200, data: [{token}] });
    } catch (err) {
      return res.status(400).json({ status: 400, error: `${err.name}, ${err.message}` });
    }
    const token = await User.signToken(request.id);
    return res.status(200).json({ status: 200, data: [{ token }] });
    // There is no need for an error response here because all error cases has been handled by previous middlewares
  }
}

export default new User();
