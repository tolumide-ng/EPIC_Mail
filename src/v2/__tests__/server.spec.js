import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

chai.use(chaiHttp);

const should = chai.should();
const { expect } = chai;


describe('Server.js endpoints', () => {
  it('should return a status of 200', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('data');
        res.body.should.be.a('object');
        done();
      });
  });

  it('should return a status code of 500', (done) => {
    chai.request(server)
      .get('/aNonExistingRoute')
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.should.be.a('object');
        done();
      });
  });
});
