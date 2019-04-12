import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import mockData from './mockData';

chai.use(chaiHttp);

const should = chai.should();
const { expect } = chai;

const {
  Basheer, chwuks, chwuksGroup, incompleteGroupDetails, basheerGroup, editBasheerGroupName, tomiwa, bambam, shortBroadcastMessage,
  validationMember, anotherBroadcastMessage, unRegisteredMember, tomiwaAddToGroup, bambamAddToGroup, alfredAddToGroup,
  broadcastMessageValidation, broadcastMessage, roleLength, emptyBroadcastMessage
} = mockData;

const groupRoute = '/api/v2/groups';
const userRoute = '/api/v2/auth';
const messagesRoute = '/api/v2/messages';

const globalContainer = {};

describe('Failed group cases', () => {
  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(Basheer)
      .end((req, res) => {
        globalContainer.basheerToken = res.body.data[0].token;
        done();
      });
  });

  it('should not get any groups, since none has been created by anyone yet', (done) => {
    chai.request(server)
      .get(`${groupRoute}/`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .set('Accept', '/application/json')
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'There are no resgistered groups at the moment');
        done();
      });
  });
});


describe('User Interaction with groups', () => {
  const container = {};

  // create  a New User to admin
  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(chwuks)
      .end((req, res) => {
        globalContainer.chwuksToken = res.body.data[0].token;
        container.chwuksToken = res.body.data[0].token;
        done();
      });
  });

  it('should encounter validation error in group creation', (done) => {
    chai.request(server)
      .post(`${groupRoute}/`)
      .set('Authorization', `baearer ${container.chwuksToken}`)
      .send(incompleteGroupDetails)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'role is required');
        done();
      });
  });

  it('should encounter validation error in group creation', (done) => {
    chai.request(server)
      .post(`${groupRoute}/`)
      .set('Authorization', `baearer ${container.chwuksToken}123`)
      .send(chwuksGroup)
      .end((req, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Unauthorized, Email or Password does not match');
        done();
      });
  });

  // It should encounter validation error because the length of the group role is too long
  it('should successfully create a group', (done) => {
    chai.request(server)
      .post(`${groupRoute}/`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(roleLength)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        done();
      });
  });

  it('should successfully create a group', (done) => {
    chai.request(server)
      .post(`${groupRoute}/`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(chwuksGroup)
      .end((req, res) => {
        globalContainer.chwuksGroupId = res.body.data[0].id;
        container.chwuksGroupId = res.body.data[0].id;
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('data');
        expect(res.body.data[0]).to.have.own.property('createdby', 'chukwudi@epicmail.com');
        expect(res.body.data[0]).to.have.own.property('name', 'Michigan developers');
        done();
      });
  });

  it('should get 404 if the requested group does not exist', (done) => {
    chai.request(server)
      .get(`${groupRoute}/79/`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .end((req, res) => {
        res.should.be.json;
        res.should.have.status(404);
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'There is no group with id=79');
        done();
      });
  });

  it('should get a 400 bad request if the id is not a number', (done) => {
    chai.request(server)
      .get(`${groupRoute}/abc`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .end((req, res) => {
        res.should.be.json;
        res.should.have.status(400);
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Please ensure the messageId is an integer');
        done();
      });
  });


  // Create members to be added to ChwuksGroup
  // Create Tomiwa
  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(tomiwa)
      .end((req, res) => {
        globalContainer.tomiwaToken = res.body.data[0].token;
        container.tomiwaToken = res.body.data[0].token;
        done();
      });
  });

  // Create Bambam
  before((done) => {
    chai.request(server)
      .post(`${userRoute}/signup`)
      .set('Accept', '/application/json')
      .send(bambam)
      .end((req, res) => {
        globalContainer.bambamToken = res.body.data[0].token;
        container.bambamToken = res.body.data[0].token;
        globalContainer.bamabamId = res.body.data[0].id;
        done();
      });
  });

  // Chwuks should be able to add members to the group he created
  it('should successfully add tomiwa to group', (done) => {
    chai.request(server)
      .post(`${groupRoute}/${globalContainer.chwuksGroupId}/users`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(tomiwaAddToGroup)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('data');
        done();
      });
  });

  // Add bambam to chwuks group
  it('should successfully add bambam to the group', (done) => {
    chai.request(server)
      .post(`${groupRoute}/${globalContainer.chwuksGroupId}/users`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(bambamAddToGroup)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('data');
        done();
      });
  });


  it('should get a specific group through the group id', (done) => {
    chai.request(server)
      .get(`${groupRoute}/${globalContainer.chwuksGroupId}/`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .end((req, res) => {
        res.should.be.json;
        res.should.have.status(200);
        res.body.should.have.property('data');
        done();
      });
  });

  // Send broadcast message to every member of the group
  it('should encounter validation error while trying to send broadcast message', (done) => {
    chai.request(server)
      .post(`${groupRoute}/${globalContainer.chwuksGroupId}/messages`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(broadcastMessageValidation)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'message is required');
        done();
      });
  });

  // Empty broadcast message should encounter validation error 
  it('should encounter validation error while trying to send broadcast message', (done) => {
    chai.request(server)
      .post(`${groupRoute}/${globalContainer.chwuksGroupId}/messages`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(emptyBroadcastMessage)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        done();
      });
  });

  // Send broadacast message to every group member
  it('should successfully send message to all members of the group', (done) => {
    chai.request(server)
      .post(`${groupRoute}/${globalContainer.chwuksGroupId}/messages`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(broadcastMessage)
      .end((req, res) => {
        console.log(res.error);
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('data');
        done();
      });
  });

  // Send broadacast message to every group member
  it('should fail to send a broadcast message beacasue the length is less than 3', (done) => {
    chai.request(server)
      .post(`${groupRoute}/${globalContainer.chwuksGroupId}/messages`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(shortBroadcastMessage)
      .end((req, res) => {
        console.log(res.body);
        console.log(res.error)
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        done();
      });
  });

  // It should not add an already existing member to the group
  it('should successfully add bambam to the group', (done) => {
    chai.request(server)
      .post(`${groupRoute}/${globalContainer.chwuksGroupId}/users`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(tomiwaAddToGroup)
      .end((req, res) => {
        res.should.have.status(409);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Conflict: The email already exists in this group');
        done();
      });
  });

  // It should not add a member to a group the user did not create
  it('should not be able to add a member to a group the user did not create', (done) => {
    chai.request(server)
      .post(`${groupRoute}/${globalContainer.chwuksGroupId}/users`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .send(alfredAddToGroup)
      .end((req, res) => {
        res.should.have.status(403);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Unauthorized: You do not have the authority to add a user to this group');
        done();
      });
  });

  // Validation error to add member
  it('should successfully add bambam to the group', (done) => {
    chai.request(server)
      .post(`${groupRoute}/${globalContainer.chwuksGroupId}/users`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(validationMember)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        done();
      });
  });

  // It should be able to delete a group member
  it('should be able to delete a group member', (done) => {
    chai.request(server)
      .delete(`${groupRoute}/${globalContainer.chwuksGroupId}/users/${globalContainer.bamabamId}`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('data');
        done();
      });
  });

  // Created a new group
  before((done) => {
    chai.request(server)
      .post(`${groupRoute}/`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .send(basheerGroup)
      .end((req, res) => {
        globalContainer.basheerGroupId = res.body.data[0].id;
        done();
      });
  });

  it('should get all existing groups', (done) => {
    chai.request(server)
      .get(`${groupRoute}/`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('data');
        expect(res.body.data[0]).to.have.own.property('id', 2);
        done();
      });
  });

  // It shpuld fail to edit the group name owing to validation errors
  it('should fail to edit the group name of existing group', (done) => {
    chai.request(server)
      .patch(`${groupRoute}/${globalContainer.basheerGroupId}/name`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .send({ name: 'ot' })
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        done();
      });
  });

  // It should fail to edit group name beacuse the new name is not supplied
  it('should fail to edit group name because the group name is not supplied', (done) => {
    chai.request(server)
      .patch(`${groupRoute}/${globalContainer.basheerGroupId}/name`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'name is required');
        done();
      });
  });

  it('should succesfully edit the name of an existing group', (done) => {
    chai.request(server)
      .patch(`${groupRoute}/${globalContainer.basheerGroupId}/name`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .send(editBasheerGroupName)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('data');
        expect(res.body.data[0]).to.have.own.property('name', 'Saudi Prince');
        done();
      });
  });

  it('should get a 400 Bad request status code', (done) => {
    chai.request(server)
      .patch(`${groupRoute}/akanbi/name`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .send(editBasheerGroupName)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        done();
      });
  });

  it('should not be able to edit the name of a non-existing group', (done) => {
    chai.request(server)
      .patch(`${groupRoute}/10/name`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .send(editBasheerGroupName)
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Not Found: Please check the provided groupId');
        done();
      });
  });

  it('should not be able to edit the name of an existing group not created by the user', (done) => {
    chai.request(server)
      .patch(`${groupRoute}/${globalContainer.basheerGroupId}/name`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .send(editBasheerGroupName)
      .end((req, res) => {
        res.should.have.status(403);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Unauthorized, You do not have the authority to rename this group');
        done();
      });
  });

  // User wants to edit groupName but does not provide adequate data VALIDATION ERROR
  it('should not be able to edit the groupName if adequate data is not provided', (done) => {
    chai.request(server)
      .patch(`${groupRoute}/${globalContainer.basheerGroupId}/name`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'name is required');
        done();
      });
  });


  it('should return 404 status code if user tries to delete a message they did not create', (done) => {
    chai.request(server)
      .delete(`${groupRoute}/${globalContainer.basheerGroupId}`)
      .set('Authorization', `bearer ${globalContainer.chwuksToken}`)
      .end((req, res) => {
        res.should.have.status(403);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', 'Unauthorized, You do not have the authority to delete this group');
        done();
      });
  });

  it('should be able to delete an existing group', (done) => {
    chai.request(server)
      .delete(`${groupRoute}/${globalContainer.basheerGroupId}`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('data');
        done();
      });
  });

  it('should get a 404 status code when trying to delete an existing group', (done) => {
    chai.request(server)
      .delete(`${groupRoute}/${globalContainer.basheerGroupId}`)
      .set('Authorization', `bearer ${globalContainer.basheerToken}`)
      .end((req, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.have.property('error');
        expect(res.body).to.have.own.property('error', `Not Found, There is no group with id=${globalContainer.basheerGroupId}`);
        done();
      });
  });
});
