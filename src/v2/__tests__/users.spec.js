import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import mockData from './mockData';

chai.use(chaiHttp);

const should = chai.should();
const { expect } = chai;

const {
  user, incompleteUser, wrongRegExpName, oneMissingDetail, userLogin, faileduserLogin, incompleteLogin,
  invalidEmailLogin, userInputLessThan3, biodunUser, passwordReset, fakeEmail, noFirstName, invalidEmailReset,
  noPasswordLogin, shortPasswordLength
} = mockData;
const userRoute = '/api/v2/auth';

describe('Successful User action', () => {
  it('should return a 201 status code for a succesful sign up', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(user)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('data');
        expect(res.body.data[0]).to.be.a('object');
        expect(res.body.data[0]).to.have.property('token');
        res.body.should.be.a('object');
        done();
      });
  });

  it('should return a 200 status code for a succesful login', (done) => {
    const container = {};
    chai.request(server)
      .post(`${userRoute}/login`)
      .set('Accept', '/application/json')
      .send(userLogin)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body).to.have.property('data');
        res.body.should.be.a('object');
        container.token = res.body.data[0].token;
        expect(res.body.data[0]).to.have.own.property('token', `${container.token}`);
        done();
      });
  });

  // User signup without firstName or lastName
  it('should return a 200 status code for a succesful login', (done) => {
    const container = {};
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(noFirstName)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        expect(res.body).to.have.property('error');
        res.body.should.be.a('object');
        expect(res.body).to.have.own.property('error', 'Please ensure firstName is a valid string');
        done();
      });
  });
});


describe('Failed User actions', () => {
  it('should return a 409 status code for already existing email', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(user)
      .end((req, res) => {
        res.should.have.status(409);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.should.be.a('object');
        done();
      });
  });

  it('should return a 400 status code for incomplete paramters', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(incompleteUser)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.should.be.a('object');
        expect(res.body).to.have.own.property('error', 'lastName,secondaryEmail are required');
        done();
      });
  });

  it('should return a 400 status code for incomplete paramters', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(wrongRegExpName)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.should.be.a('object');
        expect(res.body).to.have.own.property('error', 'Please ensure email is a valid email');
        done();
      });
  });

  // A required parameter is required during signup
  it('should return a 400 status code for incomplete paramters', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(oneMissingDetail)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.should.be.a('object');
        expect(res.body).to.have.own.property('error', 'email is required');
        done();
      });
  });

  it('should return a 400 status code for incomplete paramters', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(userInputLessThan3)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.should.be.a('object');
        expect(res.body).to.have.own.property('error', 'Length of the value cannot be less than 3');
        done();
      });
  });

  it('should return a 400 status code for short password length', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(shortPasswordLength)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.should.be.a('object');
        expect(res.body).to.have.own.property('error', 'password must be alphanumeric and length must be more than 6');
        done();
      });
  });

  it('should return 401 for failed user login', (done) => {
    chai.request(server)
      .post(`${userRoute}/login`)
      .set('Accept', '/application/json')
      .send(faileduserLogin)
      .end((req, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.should.have.property('status');
        done();
      });
  });

  it('should return 400 for empty password during login', (done) => {
    chai.request(server)
      .post(`${userRoute}/login`)
      .set('Accept', '/application/json')
      .send(noPasswordLogin)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return validationError during login', (done) => {
    chai.request(server)
      .post(`${userRoute}/login`)
      .set('Accept', '/application/json')
      .send(incompleteLogin)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.should.have.property('status');
        expect(res.body).to.have.own.property('error', 'email is required');
        done();
      });
  });
});

it('should return validationError during login', (done) => {
  chai.request(server)
    .post(`${userRoute}/login`)
    .set('Accept', '/application/json')
    .send(invalidEmailLogin)
    .end((req, res) => {
      res.should.have.status(400);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      res.body.should.have.property('status');
      expect(res.body).to.have.own.property('error', 'Please ensure email is a valid email');
      done();
    });
});


describe('create a user and request password reset', () => {
  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(biodunUser)
      .end((req, res) => {
        done();
      });
  });

  it('should return a 404 status code for non-existing secondary email', (done) => {
    chai.request(server)
      .post(`${userRoute}/reset`)
      .set('Accept', '/application/json')
      .send(fakeEmail)
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return a 400 status code because the request body is empty', (done) => {
    chai.request(server)
      .post(`${userRoute}/reset`)
      .set('Accept', '/application/json')
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return a 200 status code for existing secondary email', (done) => {
    chai.request(server)
      .post(`${userRoute}/reset`)
      .set('Accept', '/application/json')
      .send(passwordReset)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('data');
        done();
      });
  });

  it('should return a 400 status code for invalid email', (done) => {
    chai.request(server)
      .post(`${userRoute}/reset`)
      .set('Accept', '/application/json')
      .send(invalidEmailReset)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Please ensure email is a valid email');
        done();
      });
  });
});
