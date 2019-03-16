import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import mockData from './mockData';

chai.use(chaiHttp);


const should = chai.should();
const { expect } = chai;

const {
  theUser, theMessage, theDraft, withParentMessageId, messageValidationError,
} = mockData;
const messagesRoute = '/api/v2/messages';
const userRoute = '/api/v2/auth';

describe('Succesful User message actions', () => {
  const generated = {};
  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(theUser)
      .end((req, res) => {
        generated.token = res.body.data[0].token;
        done();
      });
  });
  it('should return a 201 status code on succesful mail post', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `${generated.token}`)
      .send(theMessage)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('data');
        res.body.should.be.a('object');
        expect(res.body.data[0]).to.be.a('object');
        done();
      });
  });

  it('should return a 201 status code on succesful mail post', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `${generated.token}`)
      .send(withParentMessageId)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('data');
        res.body.should.be.a('object');
        expect(res.body.data[0].parentMessageId).to.not.be.null;
        done();
      });
  });

  it('should return a 201 status code on succesful mail post', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `${generated.token}`)
      .send(theDraft)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('data');
        res.body.should.be.a('object');
        expect(res.body.data[0]).to.have.own.property('subject', 'Media and Telcoms');
        done();
      });
  });

  it('should return a 200 status code for an existing specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/1`)
      .set('Authorization', `${generated.token}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0]).to.have.own.property('subject', 'Mediocrity at Felmish');
        done();
      });
  });

  it('should return a 404 status code for an non-existing specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/21`)
      .set('Authorization', `${generated.token}`)
      .end((req, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.own.property('error', 'Not Found, you do not have a message with id=21');
        done();
      });
  });
});


describe('Failed Message attempts', () => {
//   it('should return a 401 status code', (done) => {
//     chai.request(server)
//       .post(`${messagesRoute}/`)
//       .set('Authorization', 'Bearer 2390t093ng3945gfakeToken123')
//       .send(theDraft)
//       .end((req, res) => {
//         res.should.have.status(401);
//         res.should.be.json;
//         res.body.should.have.property('error');
//         res.body.should.be.a('object');
//         done();
//       });
//   });

  it('should return a 422 status code', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', 'fakeToken123')
      .send(messageValidationError)
      .end((req, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.should.be.a('object');
        done();
      });
  });

});
