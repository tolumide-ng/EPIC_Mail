import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './../server';
import mockData from './mockData';

chai.use(chaiHttp);

const should = chai.should();
const { expect } = chai;

const { groupCreatedBy, groupDetail, groupUser, groupDetailValidationError, secondGroupDetail, loginGroupUser, thirdGroupDetail } = mockData;

const groupRoute = '/api/v2/groups';
const userRoute = '/api/v2/auth';
const messagesRoute = '/api/v2/messages';

    const container = {};

describe('Failed group cases', () => {
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

    it('should encounter validation error in group creation', (done) => {
        chai.request(server)
            .post(`${groupRoute}/`)
            .set('Authorization', `${generated.token}`)
            .send(groupDetailValidationError)
            .end((req, res) => {
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.have.property('error');
                expect(res.body.error).to.have.own.property("name", "ValidationError");
                done();
            })
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

    before((done) => {
        chai.request(server)
            .post(`${groupRoute}/`)
            .set('Authorization', `${generated.token}`)
            .send(thirdGroupDetail)
            .end((req, res) => {
                done();
            });
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
    });

    it('should succesfully edit the name of an existing group', (done) => {
        chai.request(server)
            .patch(`${groupRoute}/1/eminem Raps`)
            .set('Authorization', `${generated.token}`)
            .end((req, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('data');
                expect(res.body.data[0]).to.have.own.property('name', 'eminem Raps');
                done();
            })
    })

    it('should not be able to edit the name of a non-existing group', (done) => {
        chai.request(server)
            .patch(`${groupRoute}/10/eminem Raps`)
            .set('Authorization', `${generated.token}`)
            .end((req, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.have.property('error');
                expect(res.body).to.have.own.property('error', 'Not Found: Please check the provided groupId');
                done();
            })
    })

    it('should not be able to edit the name of an existing group not created by the user', (done) => {
        chai.request(server)
            .patch(`${groupRoute}/1/eminem Raps`)
            .set('Authorization', `${container.token}`)
            .end((req, res) => {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property('error');
                expect(res.body).to.have.own.property('error', 'Unauthorized, You do not have the authority to rename this group');
                done();
            })
    })

    it('should successfully delete a created group', (done) => {
        chai.request(server)
            .delete(`${groupRoute}/1`)
            .set('Authorization', `${generated.token}`)
            .end((req, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
        
    })
})


describe('More user actions on groups', () => {
    before((done) => {
        chai.request(server)
            .post(`${userRoute}/login`)
            .set('Accept', '/application/json')
            .send(loginGroupUser)
            .end((req, res) => {
                container.loginToken = res.body.data[0].token;
                done();
            });
    });

    before((done) => {
        chai.request(server)
            .post(`${groupRoute}/`)
            .set('Authorization', `${container.token}`)
            .send(secondGroupDetail)
            .end((req, res) => {
                done();
            })
    })

    it('should get a 404 status code', (done) => {
        chai.request(server)
            .delete(`${groupRoute}/101`)
            .set('Authorization', `${container.token}`)
            .end((req, res) => {
                res.should.have.status(404);
                res.should.be.json;
                expect(res.body).to.have.own.property('error', `Not Found, There is no group with id=101`);
                done();
            })
    })

    it('should get a 401 status code when trying to delete a group it didnt create', (done) => {
        chai.request(server)
            .delete(`${groupRoute}/2`)
            .set('Authorization', `${container.token}`)
            .end((req, res) => {
                res.should.have.status(401);
                res.should.be.json;
                expect(res.body).to.have.own.property('error', `Unauthorized, You do not have the authority to delete this group`);
                done();
            })
    })
})
