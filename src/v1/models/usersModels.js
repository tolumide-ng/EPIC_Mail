import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Token generator function
const signToken = userId => {
    return jwt.sign({
        iss: 'EPIC_Mail',
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.SECRET_KEY);
}

// Password hashing function
const hashPassword = password => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

class User {
    constructor() {
        this.users = [];
    }

    signup(data) {
        // Generate the salt
        const password = hashPassword(data.password);

        const newUser = {
            id: uuid.v4(),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: password
        };
        // Generate token
        const token = signToken(newUser.id);
        this.users.push(newUser);
        return { token, newUser };
    }


    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }


    findUserById(id) {
        return this.users.find(user => user.id === id);
    }

    userLogin(data) {
        const foundUser = this.findUserByEmail(data.email);
        const token = signToken(foundUser.id);
        return { token, foundUser };
    }
}

export default new User();