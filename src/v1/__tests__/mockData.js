import faker from 'faker';

export default {
    user: {
        email: 'AdrianToelesky@gmail.com',
        firstName: 'Adrian',
        lastName: 'Toelesky', 
        password: 'invincitoe89'
    }, 

    incompleteUser: {
        email: 'AdrianToelesky@gmail.com',
        firstName: 'Adrian',
        password: 'invincitoe89'
    }, 

    userLogin: {
        email: 'AdrianToelesky@gmail.com', 
        password: 'invincitoe89'
    },

    failedLogin: {
        email: 'AdrianToelesky@gmail.com',
        password: 'badPassword'
    },

    validationErrorLogin: {
        email: 'AdrianToelesky@gmail.com'
    }
}