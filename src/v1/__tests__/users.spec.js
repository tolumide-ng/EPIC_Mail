import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import mockData from './mockData';

const {
  user, incompleteUser, userLogin, failedLogin, validationErrorLogin,
} = mockData;

chai.use(chaiHttp);

const should = chai.should();
const { expect } = chai;

const userRoute = '/api/v1/auth';

describe('Tests for userSignup endpoint', () => {
  it('should successfully create a user', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(user)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('data');
        expect(res.body.data[0]).to.have.property('token');
        res.body.should.be.a('object');
        done();
      });
  });

  it('should  fail to create a newUser with same email', (done) => {
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

  it('should  fail validation to create new User', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(incompleteUser)
      .end((req, res) => {
        res.should.have.status(400);
        done();
      });
  });
});

describe('User signin tests', () => {
  it('should return a 200 status code', (done) => {
    chai.request(server)
      .post(`${userRoute}/login`)
      .set('Accept', '/application/json')
      .send(userLogin)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        expect(res.body.data[0]).to.have.property('token');
        done();
      });
  });

  it('should return a 400 status code for Validation error', (done) => {
    chai.request(server)
      .post(`${userRoute}/login`)
      .set('Accept', '/application/json')
      .send(validationErrorLogin)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});
