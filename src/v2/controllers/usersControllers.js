import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

import db from '../db/index';

dotenv.config();

const helper = {
  async hashPassword(password) {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  },

  async isValid(password, validMailPassword) {
    const result = await bcrypt.compare(password, validMailPassword);
    return result;
  },
};

export default class User {
  static signToken(rows) {
    return jwt.sign({
      iss: 'tolumide',
      sub: rows,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    }, process.env.SECRET_KEY);
  }

  static async createUser(req, res) {
    const {
      firstName, lastName, email, password, secondaryEmail,
    } = req.value.body;

    if (!email.endsWith('@epicmail.com')) {
      return res.status(400).json({ status: 400, error: 'email must end with @epicmail.com' });
    }
    const modifyemail = email.toLowerCase();
    const modifySecondaryEmail = secondaryEmail.toLowerCase();

    const searchText = 'SELECT * FROM usersTable WHERE email=$1';
    const searchValue = [modifyemail];
    const text = `INSERT INTO usersTable(firstName, lastName, email, password, secondaryEmail)
        VALUES($1, $2, $3, $4, $5) returning *`;
    const theHashedPassword = await helper.hashPassword(password);
    const values = [firstName, lastName, modifyemail, theHashedPassword, modifySecondaryEmail];
    try {
      const { rows } = await db.query(searchText, searchValue);
      if (!rows[0]) {
        const { rows } = await db.query(text, values);
        const token = await User.signToken(rows[0].id);
        return res.status(201).json({
          status: 201,
          data: [{
            token,
            id: rows[0].id,
            email: rows[0].email,
            firstname: rows[0].firstname,
            lastname: rows[0].lastname,
            secondaryEmail: rows[0].secondaryemail,
          }],
        });
      }
      return res.status(409).json({ status: 409, error: 'Please use a different username, this username already exists' });
    } catch (err) {
      return res.status(500).json({ status: 400, error: `${err.name}, ${err.message}` });
    }
  }


  // Method to login the user
  static async login(req, res) {
    const request = req.value.body;
    const { email, password } = req.value.body;
    try {
      const text = 'SELECT * FROM usersTable WHERE email=$1';
      const { rows } = await db.query(text, [email.toLowerCase()]);
      if (!rows[0]) {
        return res.status(401).json({ status: 401, error: 'User authentication error, please confirm email/password' });
      }
      const confirmPasswordMatch = await helper.isValid(password, rows[0].password);
      if (!confirmPasswordMatch) {
        return res.status(401).json({ status: 401, error: 'User authentication error, please confirm email/password' });
      }
      const token = await User.signToken(rows[0].id);
      return res.status(200).json({
        status: 200,
        data: [{
          token, email: rows[0].email, firstName: rows[0].firstname, lastName: rows[0].lastname,
        }],
      });
    } catch (err) {
      return res.status(400).json({ status: 400, error: `${err.name}, ${err.message}` });
    }
  }

  // Method to reset user password
  static async passwordReset(req, res) {
    const resetEmail = req.body.email.toLowerCase();
    const findSecondaryText = 'SELECT * FROM  usersTable WHERE email=$1';
    const findSecondaryValue = [resetEmail];

    try {
      const { rows: findSecondaryEmail } = await db.query(findSecondaryText, findSecondaryValue);
      if (!findSecondaryEmail[0]) {
        return res.status(404).json({ status: 404, error: 'Not Found: Email specified for reset password does not exist' });
      }
      const { email, secondaryemail } = findSecondaryEmail[0];
      const newPassword = String(Math.random()).substr(4, 6) + secondaryemail.substr(3, 4);
      const theHashedPassword = await helper.hashPassword(newPassword);
      const updateText = 'UPDATE usersTable SET password=$1 WHERE email=$2 AND secondaryemail=$3 returning *';
      const updateValue = [theHashedPassword, email, secondaryemail];

      const resetPassword = await db.query(updateText, updateValue);
      if (!resetPassword) {
        return res.status(400).json({ status: 400, error: 'Password reset failed' });
      }

      const output = `Here is your new password for <strong>${email}:</strong> ${newPassword}`;

      async function main() {
        const testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
          },
        });

        const info = await transporter.sendMail({
          from: '"EPICMai Password reset" <tolumideshopein@gmail.com>',
          to: secondaryemail,
          subject: 'Password Reset',
          html: output,
        });
        // console.log('Message sent to: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      main().catch(console.error);
      return res.status(200).json({ status: 200, data: 'Please check the secondary email you used to register for your new password' });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  }
}
