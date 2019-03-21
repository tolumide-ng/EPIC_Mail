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
  eichUser, loginEich, eichsMessage, alfred, eichsDraft, eichsBadMessage, eichsOtherMessage, alfredLogin, brendaMessage, brenda, brendaMessageToAlfred, tolumide
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
        console.log(res.error);
        container.eichToken = res.body.data[0].token;
        globalDetail.eichToken = res.body.data[0].token;
        done();
      });
  });

  it('should return a 404 status code on succesful mail post', (done) => {
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

  it('should return a validation error on post message', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .send(eichsBadMessage)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Only subject and message are required, include receiverEmail if the message is not a draft');
        done();
      });
  });


  it('should return a 201 status code on succesful draft post', (done) => {
    chai.request(server)
      .post(`${messagesRoute}/`)
      .set('Authorization', `bearer ${container.eichToken}`)
      .send(eichsDraft)
      .end((req, res) => {
        console.log(res.error);
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
        console.log(res.error);
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
        console.log(res.error);
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
        console.log(res.body);
        container.brendaToken = res.body.data[0].token;
        globalDetail.brendaToken = res.body.data[0].token;
        done();
      });
  });

  // get sent messages when you have not sent any
  it('should return a 404 status code', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/sent`)
      .set('Authorization', `bearer ${container.brendaToken}`)
      .end((req, res) => {
        console.log(res.error);
        res.should.have.status(404);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('error', 'Not Found, You do not have any sent emails at the moment');
        expect(res.body).to.have.property('error');
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
        console.log(res.body);
        container.brendaMessageId = res.body.data[0].id;
        globalDetail.brendaMessageId = res.body.data[0].id;
        done();
      });
  });

  // Message sender checks messaged through id too
  it('should return a 200 status code on succesful get request', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/${container.brendaMessageId}`)
      .set('Authorization', `bearer ${container.brendaToken}`)
      .send(brendaMessage)
      .end((req, res) => {
        console.log(res.error);
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
        console.log(res.error);
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('status', 'inbox');
        expect(res.body).to.have.property('data');
        done();
      });
  });

  // Message receiver checks the mail too
  it('should return a 200 status code on getting a specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/${container.brendaMessageId}`)
      .set('Authorization', `bearer ${globalDetail.alfredToken}`)
      .end((req, res) => {
        console.log(res.error);
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('status', 'read');
        done();
      });
  });

  // Message receiver/sender checks a not-existing mail
  it('should return a 404 status code on getting all specific message', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/75`)
      .set('Authorization', `bearer ${globalDetail.alfredToken}`)
      .end((req, res) => {
        console.log(res.body);
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
        console.log(res.body);
        container.brendaMessageToAlfredId = res.body.data[0].id;
        globalDetail.brendaMessageToAlfredId = res.body.data[0].id;
        done();
      });
  });

  before((done) => {
    chai.request(server)
      .post(`${tolumide}/signup`)
      .set('Accept', '/application/json')
      .send(tolumide)
      .end((req, res) => {
        console.log(res.body);
        container.toluToken = res.body.data[0].token;
        globalDetail.toluToken = res.body.data[0].token;
        done();
      });
  });

  // get received messages when you have not received any
  it('should return a 404 status code', (done) => {
    chai.request(server)
      .get(`${messagesRoute}/received`)
      .set('Authorization', `bearer ${globalDetail.toluToken}`)
      .end((req, res) => {
        console.log(res.error);
        res.should.have.status(404);
        res.should.be.json;
        expect(res.body.data[0]).to.have.own.property('error', 'Not Found, You do not have any emails in your inbox at the moment');
        expect(res.body).to.have.property('error');
        done();
      });
  });

  // get received messages when you have not received any
  // it('should return a 404 status code', (done) => {
  //   chai.request(server)
  //     .get(`${messagesRoute}/sent`)
  //     .set('Authorization', `bearer ${globalDetail.toluToken}`)
  //     .end((req, res) => {
  //       console.log(res.error);
  //       res.should.have.status(404);
  //       res.should.be.json;
  //       expect(res.body.data[0]).to.have.own.property('error', 'Not Found, You do not have any emails in your inbox at the moment');
  //       expect(res.body).to.have.property('error');
  //       done();
  //     });
  // });
});
