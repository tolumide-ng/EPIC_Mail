import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import mockData from './mockData';

chai.use(chaiHttp);

const should = chai.should();
const { expect } = chai;

const { user, incompleteUser } = mockData;
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
});
