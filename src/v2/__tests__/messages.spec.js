import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import mockData from './mockData';

chai.use(chaiHttp);


const should = chai.should();
const { expect } = chai;

const messagesRoute = '/api/v2/messages';
const userRoute = '/api/v2/auth';
const {
  eichUser, loginEich, eichsMessage, alfred, eichsDraft, eichsBadMessage, eichsInvalidMessage, eichsOtherMessage, alfredLogin, brendaMessage, brenda, brendaMessageToAlfred, tolumide
} = mockData;

const globalDetail = {};

describe('ComposeMail Scenario', () => {
  const container = {};
  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(eichUser)
      .end((req, res) => {
        container.eichToken = res.body.data[0].token;
        globalDetail.eichToken = res.body.data[0].token;
        done();
      });
  });
  
  // get sent messages when you have not sent any
  it('should return a 404 status code', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/sent`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        expect(res.body).to.have.own.property('error', 'Not Found, You do not have any sent emails at the moment');
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should return a 404 status code when recipient does not exist', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .send(eichsOtherMessage)
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Receiver Not Found: Please ensure the receiverEmail is registered to epic mail');
        done();
      });
  });

  // User entered as recipient in save as draft does not exist
  it('should return a 404 status code', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/draft`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .send(eichsOtherMessage)
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Receiver Not Found: Please ensure the receiverEmail is registered to epic mail');
        done();
      });
  });

  it('should return a validation error on post message', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .send(eichsBadMessage)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'message is required');
        done();
      });
  });

  it('should return a validation error on post message', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .send(eichsInvalidMessage)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'receiverEmail must be a valid email');
        done();
      });
  });


  it('should return a 201 status code on succesful draft post', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .send(eichsDraft)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('status', 'draft');
        done();
      });
  });

  // Draft sent to the draft endpoint
  it('should return a 201 status code on succesful draft post', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/draft`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .send(eichsDraft)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('status', 'draft');
        done();
      });
  });

  // Create the receiver
  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(alfred)
      .end((req, res) => {
        container.alfredToken = res.body.data[0].token;
        globalDetail.alfredToken = res.body.data[0].token;
        done();
      });
  });

  it('should return a 201 status code on succesful mail post', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .send(eichsMessage)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        globalDetail.firstMessageId = res.body.data[0].id;
        done();
      });
  });
});

describe('Get mail', () => {
  const container = {};
  // signup one more user (brenda) - email sender
  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(brenda)
      .end((req, res) => {
        container.brendaToken = res.body.data[0].token;
        globalDetail.brendaToken = res.body.data[0].token;
        done();
      });
  });
  
  // brenda sends one more message
  before((done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `bearer ${container.brendaToken}`)
      .send(brendaMessage)
      .end((req, res) => {
        container.brendaMessageId = res.body.data[0].id;
        globalDetail.brendaMessageId = res.body.data[0].id;
        done();
      });
  });

  // Message sender checks specific messaged through id too
  it('should return a 200 status code on getting a specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/${container.brendaMessageId}`)
      .set('Authorization', `bearer ${container.brendaToken}`)
      .send(brendaMessage)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('status', 'inbox');
        expect(res.body).to.have.property('data');
        done();
      });
  });

  // Get all sent messages
  it('should return a 200 status code on succesful get request', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/sent`)
      .set('Authorization', `bearer ${container.brendaToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('status', 'inbox');
        expect(res.body).to.have.property('data');
        done();
      });
  });

  // Checek all received unread messages
  it('should return a 200 status code on getting a specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/unread`)
      .set('Authorization', `bearer ${globalDetail.alfredToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('status', 'inbox')
        done();
      });
  });

  // Checek all received unread messages but you have none
  it('should return a 200 status code on getting a specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/unread`)
      .set('Authorization', `bearer ${globalDetail.brendaToken}`)
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        expect(res.body).to.have.own.property('error', 'Not Found, You do not have any unread emails at the moment')
        done();
      });
  });

  // Message receiver checks the mail too
  it('should return a 200 status code on getting a specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/${container.brendaMessageId}`)
      .set('Authorization', `bearer ${globalDetail.alfredToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('status', 'read');
        done();
      });
  });

  // Message receiver checks received message
  it('should return a 200 status code on getting a specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/received`)
      .set('Authorization', `bearer ${globalDetail.alfredToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  // Sender deletes specific message
  it('should return a 200 status code on getting a specific message', (done) => {
    chai.request(server)
      .delete(`${messagesRoute}/${container.brendaMessageId}`)
      .set('Authorization', `bearer ${container.brendaToken}`)
      .send(brendaMessage)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        // expect(res.body.data[0]).to.have.own.property('data', 'Message deleted');
        expect(res.body).to.have.property('data');
        done();
      });
  });

  it('should return a 404 status code on getting a specific message', (done) => {
    chai.request(server)
      .delete(`${messagesRoute}/${container.brendaMessageId}`)
      .set('Authorization', `bearer ${container.brendaToken}`)
      .send(brendaMessage)
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.own.property('error', `You do not have a mail with id=${container.brendaMessageId}`)
        done();
      });
  });

  it('should return a 200 status code on deleting a specific message', (done) => {
    chai.request(server)
      .delete(`${messagesRoute}/${container.brendaMessageId}`)
      .set('Authorization', `bearer ${globalDetail.alfredToken}`)
      .send(brendaMessage)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body).to.have.property('data');
        done();
      });
  });

  // Message receiver/sender checks a not-existing mail
  it('should return a 404 status code on getting all specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/75`)
      .set('Authorization', `bearer ${globalDetail.alfredToken}`)
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        expect(res.body).to.have.own.property('error', 'Not Found, you do not have a message with id=75');
        done();
      });
  });
});

describe('Sign up a new user', () => {
  const container = {};
  before((done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `bearer ${globalDetail.brendaToken}`)
      .send(brendaMessageToAlfred)
      .end((req, res) => {
        container.brendaMessageToAlfredId = res.body.data[0].id;
        globalDetail.brendaMessageToAlfredId = res.body.data[0].id;
        done();
      });
  });

  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(tolumide)
      .end((req, res) => {
        container.toluToken = res.body.data[0].token;
        globalDetail.toluToken = res.body.data[0].token;
        done();
      });
  });
});
