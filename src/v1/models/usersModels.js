import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const signToken = user => {
    return jwt.sign({
        iss: 'EPIC_Mail',
        sub: user,
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
        console.log(' what do you see now?')
        // Generate token
        const token = signToken(newUser.id)
        console.log('did the token return?');
        this.users.push(newUser);
        return { token, newUser };
    }


    findUser(data) {
        return this.users.find(email => email => data.email);
    }
}

export default new User();