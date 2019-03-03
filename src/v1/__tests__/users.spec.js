import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './../../server';
import mockData from './mockData'

const { user, incompleteUser } = mockData;

chai.use(chaiHttp);

const should = chai.should();
const expect = chai.expect;

const userRoute = '/api/v1/auth';

describe('Tests for userSignup endpoint', () => {
    it('should successfully create a user', (done) => {
        chai.request(server)
            .post(`/api/v1/auth/signup`)
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
            .post(`/api/v1/auth/signup`)
            .send(user)
            .end((req, res) => {
                res.should.have.status(409);
                res.should.be.json;
                res.body.should.have.property('error');
                res.body.should.be.a('object');
                done();
            })
    })

    it('should  fail to validation to create new User', (done) => {
        chai.request(server)
            .post(`/api/v1/auth/signup`)
            .send(incompleteUser)
            .end((req, res) => {
                res.should.have.status(400);
                done();
            })
    })
})