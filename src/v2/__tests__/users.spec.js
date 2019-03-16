import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import mockData from './mockData';

chai.use(chaiHttp);

const should = chai.should();
const { expect } = chai;

const { user, incompleteUser, userLogin, faileduserLogin } = mockData;
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
    chai.request(server)
      .post(`${userRoute}/login`)
      .set('Accept', '/application/json')
      .send(userLogin)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body).to.have.property('token');
        res.body.should.be.a('object');
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

  it('should return a 422 status code for incomplete paramters', (done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(incompleteUser)
      .end((req, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.should.be.a('object');
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
      })
  })
});