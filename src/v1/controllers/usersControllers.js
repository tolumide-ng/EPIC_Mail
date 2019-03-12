import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import usersModels from '../models/usersModels';

dotenv.config();


class User {
  static signToken(userId) {
    return jwt.sign({
      iss: 'EPIC_Mail',
      sub: userId,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    }, process.env.SECRET_KEY);
  }

  // Password hashing function
  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  // Static Method to create a new user
  static createThisNewUser(data) {
    // Generate the salt
    const password = User.hashPassword(data.password);
    const newUser = {
      id: uuid.v4(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password,
    };
    // Generate token
    const token = User.signToken(newUser.id);
    usersModels.users.push(newUser);
    return { token, id: newUser.id };
  }

  // Static method to login an existing user
  static loginTheUser(data) {
    const foundUser = usersModels.findUserByEmail(data.email);
    const token = User.signToken(foundUser.id);
    return { token, id: foundUser.id };
  }

  // Method to signup the user
  signup(req, res) {
    const request = req.value.body;
    const confirmUserExist = usersModels.findUserByEmail(request.email);
    if (!confirmUserExist) {
      const createdUser = User.createThisNewUser(request);
      return res.status(201).json({ status: 201, data: [createdUser] });
    }
    return res.status(409).json({ status: 409, error: 'Email is already in use' });
  }

  // Method to login the user
  login(req, res) {
    const request = req.value.body;
    const loginDetails = User.loginTheUser(request);
    return res.status(200).json({ status: 200, data: [loginDetails] });
    /* There is no need for an error message since all scenarios of error has been checked
    the user only gets to this controller when all input are right */
  }
}

export default new User();
