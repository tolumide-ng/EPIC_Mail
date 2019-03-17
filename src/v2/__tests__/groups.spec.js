import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './../server';
import mockData from './mockData';

chai.use(chaiHttp);

const should = chai.should();
const { expect } = chai;

const { groupCreatedBy, groupDetail, groupUser } = mockData;

const groupRoute = '/api/v2/groups';
const userRoute = '/api/v2/auth';
const messagesRoute = '/api/v2/messages';


describe('Failed group cases', () => {
    const container = {};
    before((done) => {
        chai.request(server)
            .post(`${userRoute}/signup`)
            .set('Accept', '/application/json')
            .send(groupUser)
            .end((req, res) => {
                container.token = res.body.data[0].token;
                done();
            });
    });    

    it('should not get any groups, since none has been created by anyone yet', (done) => {
        chai.request(server)
            .get(`${groupRoute}/`)
            .set('Authorization', `${container.token}`)
            .end((req, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.have.property('error');
                expect(res.body).to.have.own.property('error', 'There are no resgistered groups at the moment');
                done();
            })
    })
});


describe('User Interaction with groups', () => {
    const generated = {};
    before((done) => {
        chai.request(server)
            .post(`${userRoute}/signup`)
            .set('Accept', '/application/json')
            .send(groupCreatedBy)
            .end((req, res) => {
                generated.token = res.body.data[0].token;
                done();
            });
    });

    it('should successfully create a group', (done) => {
        chai.request(server)
            .post(`${groupRoute}/`)
            .set('Authorization', `${generated.token}`)
            .send(groupDetail)
            .end((req, res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.have.property('data');
                expect(res.body.data[0]).to.have.own.property('createdby', 'rebeccAnalize@epic_mail.com');
                expect(res.body.data[0]).to.have.own.property('role', 'Sustaining developers growth');
                done();
            })
    });

    it('should get all existing groups', (done) => {
        chai.request(server)
            .get(`${groupRoute}/`)
            .set('Authorization', `${generated.token}`)
            .end((req, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('data');
                expect(res.body.data[0]).to.have.own.property('id', 1);
                done();
            })
    })
})