import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const signToken = userId => {
    return jwt.sign({
        iss: 'EPIC_Mail',
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.SECRET_KEY);
}

class User {
    constructor() {
        this.users = [];
    }

    signup(data) {
        console.log('is this the error source?')
        const newUser = {
            id: uuid.v4(),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password
        };
        // Generate token
        const token = signToken(newUser.id)
        this.users.push(newUser);
        return { token, newUser };
    }


    findUser(email) {
        return this.users.find(user => user.email === email);
    }

    findUserById(id) {
        return this.users.find(user => user.id === id);
    }
}

export default new User();