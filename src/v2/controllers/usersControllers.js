import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import db from '../db/index';

dotenv.config();

const signToken = rows => jwt.sign({
  iss: 'tolumide',
  sub: rows,
  iat: new Date().getTime(),
  exp: new Date().setDate(new Date().getDate() + 1),
}, process.env.SECRET_KEY);

const helper = {
  async hashPassword(password) {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  },
};

const User = {
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
        const token = signToken(rows[0].id);
        return res.status(201).json({ status: 201, data: [{ token, email: rows[0].email }] });
      }
      return res.status(409).json({ status: 409, error: 'Please use a different email, Email already exists' });
    } catch (err) {
      return res.status(400).json({ status: 400, error: `${err.name}, ${err.message}` });
    }
  },


  // Method to login the user
  login(req, res) {
    const request = req.value.body;
    const token = signToken(request.id);
    return res.status(200).json({ status: 200, data: [{ token }] });
    // There is no need for an error response here because all error cases has been handled by previous middlewares
  },
};

export default User;
