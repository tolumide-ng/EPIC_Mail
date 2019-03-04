import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './../../server';
import mockData from './mockData';

const { incompleteMessage, userForMessageValidation, message, userForComposeMail, messageDraft } = mockData;

chai.use(chaiHttp);

const should = chai.should();
const expect = chai.expect;

const messageRoute = '/api/v1/messages';
const userRoute = '/api/v1/auth'


describe('Test to get all sent emails', () => {
    it('should get a 404 status code', (done) => {
        chai.request(server)
            .get(`${messageRoute}/sent`)
            .end((req, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.have.property('error');
                res.body.should.be.a('object');
                done();
            })
    })
})

describe('User Compose messages', () => {

    it('should successfully create a message', (done) => {
        chai.request(server)
            .post(`${userRoute}/signup`)
            .set('Accept', '/application/json')
            .send(userForComposeMail)
            .end((req, res) => {
                let [tokenContainer] = res.body.data;

                chai.request(server)
                    .post(`${messageRoute}/`)
                    .set('Authorization', `${tokenContainer.token}`)
                    .send(message)
                    .end((req, res) => {
                        res.should.have.status(201);
                        res.should.be.json;
                        res.body.should.have.property('data');
                        res.body.should.be.a('object');

                        // test for a draft message without reciveremail/id
                        chai.request(server)
                            .post(`${messageRoute}/`)
                            .set('Authorization', `${tokenContainer.token}`)
                            .send(messageDraft)
                            .end((req, res) => {
                                res.should.have.status(400);
                                res.should.be.json;
                                res.body.should.have.property('error');
                                res.body.should.be.a('object');
                                done();
                            })
                    })
            });

    })
});



describe('Validation error to post message', () => {
    it('should return validation error for incomplete data', (done) => {
        chai.request(server)
            .post(`${userRoute}/signup`)
            .set('Accept', '/application/json')
            .send(userForMessageValidation)
            .end((req, res) => {
                let [tokenContainer] = res.body.data;

                chai.request(server)
                    .post(`${messageRoute}/`)
                    .set('Authorization', `${tokenContainer.token}`)
                    .send(incompleteMessage)
                    .end((req, res) => {
                        res.should.be.json;
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error')
                        done();
                    })
            })
    })
});

describe('Test to get all sent emails', () => {
    it('should successfully get all sent emails', (done) => {
        chai.request(server)
            .get(`${messageRoute}/sent`)
            .end((req, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('data');
                res.body.should.be.a('object');
                done();
            })
    })
})