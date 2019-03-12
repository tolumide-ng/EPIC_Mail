import faker from 'faker';

export default {
    user: {
        email: 'AdrianToelesky@gmail.com',
        firstName: 'Adrian',
        lastName: 'Toelesky',
        password: 'invincitoe89'
    },

    userForComposeMail: {
        email: 'levante@gmail.com',
        firstName: 'Manuel',
        lastName: 'LevanteShrewd',
        password: 'lebronoe89'
    },

    specificUser: {
        email: 'lewandoski@gmail.com',
        firstName: 'Raymond',
        lastName: 'Enistein',
        password: 'ballerao20n'
    },

    userForMessageValidation: {
        email: 'Abramovich@gmail.com',
        firstName: 'DeleMovich',
        lastName: 'Ebevande',
        password: 'whytenin'
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

    validationErrorLogin: {
        email: 'AdrianToelesky@gmail.com'
    },

    message: {
        subject: "Mediocrity at Felmish",
        message: "I really found the level of mediocrity at a so-called Flemish company very disappointing",
        parentMessageId: "None",
        status: "sent",
        receiverId: '289h3g8598658902389b934v'
    },
    

    messageDraft: {
        subject: "Mediocrity at Felmish",
        message: "I really found the level of mediocrity at a so-called Flemish company very disappointing",
        parentMessageId: "None",
        status: "draft"
    },

    messageSent: {
        subject: "Mediocrity at Felmish",
        message: "I really found the level of mediocrity at a so-called Flemish company very disappointing",
        parentMessageId: "None",
        status: "sent"
    },

    incompleteMessage: {
        subject: "Mediocrity at Felmish",
        parentMessageId: "None",
        status: "Read"
    }
}