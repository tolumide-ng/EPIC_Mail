[![Build Status](https://travis-ci.com/tolumide-ng/EPIC_Mail.svg?branch=develop)](https://travis-ci.com/tolumide-ng/EPIC_Mail)  [![Coverage Status](https://coveralls.io/repos/github/tolumide-ng/EPIC_Mail/badge.svg?branch=develop)](https://coveralls.io/github/tolumide-ng/EPIC_Mail?branch=develop)     <a href="https://codeclimate.com/github/tolumide-ng/EPIC_Mail/maintainability"><img src="https://api.codeclimate.com/v1/badges/e97160d76d39b0cef6a3/maintainability" /></a>

***

# EPIC_Mail
EPIC_Mail is a web application that empowers it's users to exchange messages/information over the internet

***

## Epic_Mail Features
- Users can create an account, and become Registered users
- Registered Users can sign in
- Registered Users can post an email
- Registered User can specifically save a message as draft
- Users can get all received emails
- Users can specifically request for all draft messages
- Users can get all unread emails
- Users can get all sent emails
- Users can edit a draft message
- Users can retract a sent message
- Users can get specific email with the email's id
- Users can delete a specific email
- Users can create a group
- Users can view a specific group
- User who created the group can add new members to a group they created 
- User who created the group can delete a member in the group
- Users can search for all groups present on epicmail
- Users in the group can send a broadcast message to all members of the group
- User who created the group can delete such group
- User who created a group can delete such group


***

## EPIC_Mail User interface
User interface for EPIC_Mail is hosted with [GitHub pages](https://tolumide-ng.github.io/EPIC_Mail/UI/index.html)

***

## Testing tools
EPIC_Mail is tested with [Mocha](https://mochajs.org/) and [Chai-http](https://www.chaijs.com/plugins/chai-http/)

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
EPIC_Mail version 2 is hosted on [heroku](https://the-epicmail.herokuapp.com)

API is documented on **[swagger](https://inspector.swagger.io/)** can can be viewed at [EPIC_Mail](https://app.swaggerhub.com/apis/tolumide-ng/EPIC_Mail/1)

| Method    |Description                          | Endpoint                                |
| --------  |-------------------------------------| ----------------------------------------| 
| POST      | User signup                         | `/api/v2/auth/signup`                   |
| POST      | User login                          | `/api/v2/auth/login`                    |
| POST      | Compose Mail                        | `/api/v2/messages`                      |
| POST      | Specifically save message as draft  | `/api/v2/messages/draft`                |
| GET       | Get all sent messages               | `/api/v2/messages/sent`                 |
| GET       | Get all draft messages              | `/api/v2/messages/draft`                |
| GET       | Get all unread messages             | `/api/v2/messages/unread`               |
| GET       | Get all received messages           | `/api/v2/messages/received`             |
| GET       | Get a specific message              | `/api/v2/messages/:msd-id`              |
| PUT       | Edit a draft message                | `/api/v2/messages/:id`                  | 
| DELETE    | Delete a specific message           | `/api/v2/messages/:msd-id`              |
| POST      | Create a group                      | `/api/v2/groups/`                       |
| GET       | Get all groups on epicMail          | `/api/v2/groups/`                       |
| GET       | Get a specific group                | `/api/v2/groups/:id`                    |
| PATCH     | Edit a group                        | `/api/v2/groups/:id/name`               |
| DELETE    | Delete a created group              | `/api/v2/groups/:id`                    |
| POST      | Send Broadcast message to group     | `/api/v2/groups/:groupId/messages`      |
| POST      | Add a user to the group             | `/api/v2/groups/:id/users`              |
| DELETE    | Delete a group member from a group  | `/api/v2/groups/:groupId/users/:userId` |





***

### Tools and Technologies used
- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express.js](https://expressjs.com/) - Minimalist, unopinionated web application framework for Node.js
- [ESLint](https://eslint.org/) - Pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.
- [Babel](https://babeljs.io/) - Free and open-source JavaScript compiler and configurable transpiler used in web development.
- [JWT](https://jwt.io/) - A compact URL-safe means of representing claims to be transferred between two parties
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs) - A password hashing function written in Javascript
*** 

## Author
- Shopein Tolumide

---