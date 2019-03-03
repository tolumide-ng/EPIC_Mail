import uuid from 'uuid';

class User {
    constructor() {
        this.users = [];
    }

    signup(data) {
        const newUser = {
            id: uuid.v4(),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password
        };
        this.users.push(newUser);
        return newUser;
    }

    findUser(data) {
        return this.users.find(email => email => data.email);
    }
}

export default new User();