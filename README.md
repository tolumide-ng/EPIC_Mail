[![Build Status](https://travis-ci.com/tolumide-ng/EPIC_Mail.svg?branch=develop)](https://travis-ci.com/tolumide-ng/EPIC_Mail)  [![Coverage Status](https://coveralls.io/repos/github/tolumide-ng/EPIC_Mail/badge.svg?branch=develop)](https://coveralls.io/github/tolumide-ng/EPIC_Mail?branch=develop)     <a href="https://codeclimate.com/github/tolumide-ng/EPIC_Mail/maintainability"><img src="https://api.codeclimate.com/v1/badges/e97160d76d39b0cef6a3/maintainability" /></a>

***

# EPIC_Mail
EPIC_Mail is a web application that empowers it's users to exchange messages/information over the internet

***

## Epic_Mail Features
- Users can create an account, and become Registered users
- Registered Users can sign in
- Registered Users can post an email 
- Users can get all received emails
- Users can get all unread emails
- Users can get all sent emails
- Users can get specific email with the email's id
- Users can delete a specific email

***

## EPIC_Mail User interface
User interface for EPIC_Mail is hosted with [GitHub pages](https://tolumide-ng.github.io/EPIC_Mail/UI/index.html)

***

## Testing tools
EPIC_Mail is tested with [Mocha](https://mochajs.org/) and [Chai-http][https://www.chaijs.com/plugins/chai-http/]

***

## Getting Started

### Prerequisites
- You must have node.js and npm installed on your system.
- Installing [Node.js](https://nodejs.org/en/) would install both

***

### Installing 

- Clone the repository ````https://github.com/tolumide-ng/EPIC_Mail.git```` to your local system
- Cd into the repository on your local system
- Create a **.env** file and name a declare a variable with the name **SECRET_KEY**
- Install dependencies
> Run the command below
````
$ npm install
````
***

#### Setup

> To start the server, run the command below
````
$ npm run dev-start
````
***

#### Running the tests
This tests most of the endpoints of EPIC_Mail

> To test the code, run the command below
````
$ npm run test
````
***

### API Information 
EPIC_Mail is hosted on [heroku](https://epic--mail.herokuapp.com/)

API is documented on **swagger** can can be viewed at [EPIC_Mail](https://app.swaggerhub.com/apis/tolumide-ng/EPIC_MAIL/1#/)

| Method    |Description                  |Endpoint                   |
| --------  |:---------------------------:| -------------------------:| 
| POST      | User signup                 | /api/v1/auth/signup       |
| POST      | User login                  | /api/v1/auth/login        |
| POST      | Compose Mail                | /api/v1/messages          |
| GET       | Get all sent messages       | /api/v1/messages/sent     |
| GET       | Get all unread messages     | /api/v1/messages/unread   |
| GET       | Get all received messages   | /api/v1/messages/received |
| GET       | Get a specific message      | /api/v1/messages/:msg-id  |
| DELETE    | Delete a specific message   | /api/v1/messages/:msg-id  |

***

### Tools and Technologies used
- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express.js](https://expressjs.com/) - Minimalist, unopinionated web application framework for Node.js
- [ESLint](https://eslint.org/) - Pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.
- [Babel](https://babeljs.io/) - Free and open-source JavaScript compiler and configurable transpiler used in web development.
- [JWT](https://jwt.io/) - A compact URL-safe means of representing claims to be transferred between two parties
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs) - A password hashing function written in Javascript
- [passport.js](http://www.passportjs.org/) -  authentication middleware for Node.js.

*** 

## Author
- Shopein Tolumide

---