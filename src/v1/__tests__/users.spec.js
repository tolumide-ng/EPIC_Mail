import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './../../server';
import mockData from './mockData'

const { user, incompleteUser, userLogin, failedLogin, validationErrorLogin } = mockData;

chai.use(chaiHttp);

const should = chai.should();
const expect = chai.expect;

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
                res.body.should.be.a('object');
                done();
            })
    })

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
            })
    })

    it('should  fail validation to create new User', (done) => {
        chai.request(server)
            .post(`${userRoute}/signup`)
            .set('Accept', '/application/json')
            .send(incompleteUser)
            .end((req, res) => {
                res.should.have.status(400);
                done();
            })
    })
})

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
                done();
            })
    })

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
            })
    })

    it('should return unauthorized for fake login attempt', (done) => {
        chai.request(server)
            .post(`${userRoute}/login`)
            .send(failedLogin)
            .end((req, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                done();
            })
    })
})