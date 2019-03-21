// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import server from '../server';
// import mockData from './mockData';

// chai.use(chaiHttp);

// const should = chai.should();
// const { expect } = chai;

// const {
//   groupCreatedBy, groupDetail, groupUser, groupDetailValidationError, secondGroupDetail,
//   loginGroupUser, thirdGroupDetail, kevinUser, fourthGroupDetail, elicGroup, rebecaGroup, broadcastMessage,
// } = mockData;

// const groupRoute = '/api/v2/groups';
// const userRoute = '/api/v2/auth';
// const messagesRoute = '/api/v2/messages';

// const container = {};

// describe('Failed group cases', () => {
//   before((done) => {
//     chai.request(server)
//       .post(`${userRoute}/signup`)
//       .set('Accept', '/application/json')
//       .send(groupUser)
//       .end((req, res) => {
//         container.token = res.body.data[0].token;
//         done();
//       });
//   });

//   it('should not get any groups, since none has been created by anyone yet', (done) => {
//     chai.request(server)
//       .get(`${groupRoute}/`)
//       .set('Authorization', `bearer ${container.token}`)
//       .end((req, res) => {
//         res.should.have.status(404);
//         res.should.be.json;
//         res.body.should.have.property('error');
//         expect(res.body).to.have.own.property('error', 'There are no resgistered groups at the moment');
//         done();
//       });
//   });
// });


// describe('User Interaction with groups', () => {
//   const generated = {};
//   before((done) => {
//     chai.request(server)
//       .post(`${userRoute}/signup`)
//       .set('Accept', '/application/json')
//       .send(groupCreatedBy)
//       .end((req, res) => {
//         generated.token = res.body.data[0].token;
//         done();
//       });
//   });

//   it('should encounter validation error in group creation', (done) => {
//     chai.request(server)
//       .post(`${groupRoute}/`)
//       .set('Authorization', `baearer ${generated.token}`)
//       .send(groupDetailValidationError)
//       .end((req, res) => {
//         res.should.have.status(400);
//         res.should.be.json;
//         res.body.should.have.property('error');
//         expect(res.body.error).to.have.own.property('error', 'Only name and role are required');
//         done();
//       });
//   });

//   it('should successfully create a group', (done) => {
//     chai.request(server)
//       .post(`${groupRoute}/`)
//       .set('Authorization', `bearer ${generated.token}`)
//       .send(groupDetail)
//       .end((req, res) => {
//         res.should.have.status(201);
//         res.should.be.json;
//         res.body.should.have.property('data');
//         expect(res.body.data[0]).to.have.own.property('createdby', 'rebeccAnalize@epic_mail.com');
//         expect(res.body.data[0]).to.have.own.property('role', 'Sustaining developers growth');
//         done();
//       });
//   });

//   before((done) => {
//     chai.request(server)
//       .post(`${groupRoute}/`)
//       .set('Authorization', `bearer ${generated.token}`)
//       .send(thirdGroupDetail)
//       .end((req, res) => {
//         done();
//       });
//   });

//   it('should get all existing groups', (done) => {
//     chai.request(server)
//       .get(`${groupRoute}/`)
//       .set('Authorization', `bearer ${generated.token}`)
//       .end((req, res) => {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.have.property('data');
//         expect(res.body.data[0]).to.have.own.property('id', 1);
//         done();
//       });
//   });

//   it('should succesfully edit the name of an existing group', (done) => {
//     chai.request(server)
//       .patch(`${groupRoute}/1/eminem Raps`)
//       .set('Authorization', `bearer ${generated.token}`)
//       .end((req, res) => {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.have.property('data');
//         expect(res.body.data[0]).to.have.own.property('name', 'eminem Raps');
//         done();
//       });
//   });

//   it('should not be able to edit the name of a non-existing group', (done) => {
//     chai.request(server)
//       .patch(`${groupRoute}/10/eminem Raps`)
//       .set('Authorization', `bearer ${generated.token}`)
//       .end((req, res) => {
//         res.should.have.status(404);
//         res.should.be.json;
//         res.body.should.have.property('error');
//         expect(res.body).to.have.own.property('error', 'Not Found: Please check the provided groupId');
//         done();
//       });
//   });

//   it('should not be able to edit the name of an existing group not created by the user', (done) => {
//     chai.request(server)
//       .patch(`${groupRoute}/1/eminem Raps`)
//       .set('Authorization', `bearer ${container.token}`)
//       .end((req, res) => {
//         res.should.have.status(401);
//         res.should.be.json;
//         res.body.should.have.property('error');
//         expect(res.body).to.have.own.property('error', 'Unauthorized, You do not have the authority to rename this group');
//         done();
//       });
//   });

//   it('should successfully delete a created group', (done) => {
//     chai.request(server)
//       .delete(`${groupRoute}/1`)
//       .set('Authorization', `bearer ${generated.token}`)
//       .end((req, res) => {
//         res.should.have.status(200);
//         res.should.be.json;
//         done();
//       });

//   });
// });


// describe('More user actions on groups', () => {
//   before((done) => {
//     chai.request(server)
//       .post(`${userRoute}/login`)
//       .set('Accept', '/application/json')
//       .send(loginGroupUser)
//       .end((req, res) => {
//         container.loginToken = res.body.data[0].token;
//         done();
//       });
//   });

//   before((done) => {
//     chai.request(server)
//       .post(`${groupRoute}/`)
//       .set('Authorization', `bearer ${container.token}`)
//       .send(secondGroupDetail)
//       .end((req, res) => {
//         done();
//       });
//   });

//   it('should get a 404 status code', (done) => {
//     chai.request(server)
//       .delete(`${groupRoute}/101`)
//       .set('Authorization', `bearer ${container.token}`)
//       .end((req, res) => {
//         res.should.have.status(404);
//         res.should.be.json;
//         expect(res.body).to.have.own.property('error', 'Not Found, There is no group with id=101');
//         done();
//       });
//   });

//   it('should get a 401 status code when trying to delete a group it didnt create', (done) => {
//     chai.request(server)
//       .delete(`${groupRoute}/2`)
//       .set('Authorization', `bearer ${container.token}`)
//       .end((req, res) => {
//         res.should.have.status(401);
//         res.should.be.json;
//         expect(res.body).to.have.own.property('error', 'Unauthorized, You do not have the authority to delete this group');
//         done();
//       });
//   });
// });


// const groupContainer = {};

// describe('Group membership', () => {
//   before((done) => {
//     chai.request(server)
//       .post(`${userRoute}/signup`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send(kevinUser)
//       .end((req, res) => {
//         groupContainer.token = res.body.data[0].token;
//         done();
//       });
//   });

//   before((done) => {
//     chai.request(server)
//       .post(`${groupRoute}/`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send(fourthGroupDetail)
//       .end((req, res) => {
//         done();
//       });
//   });

//   it('should successfully add a user to the group', (done) => {
//     chai.request(server)
//       .post(`${groupRoute}/4/users`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send({ userEmailAddress: 'vicotor@epic_mail.com', userRole: 'People Validation' })
//       .end((req, res) => {
//         res.should.be.json;
//         res.should.have.status(201);
//         expect(res.body.data[0]).to.have.own.property('groupid', 4);
//         done();
//       });
//   });

//   // Add user valid user to a non-existing group
//   it('should not be able to add a user to a non-existing group', (done) => {
//     chai.request(server)
//       .post(`${groupRoute}/75/users`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send({ userEmailAddress: 'vicotor@epic_mail.com', userRole: 'People Validation' })
//       .end((req, res) => {
//         res.should.be.json;
//         res.should.have.status(404);
//         expect(res.body).to.have.own.property('error', 'Not Found: There is no group with id=75');
//         done();
//       });
//   });

//   // Add a non-existing user to a valid group (404)
//   it('should not be able to add a user to a non-existing group', (done) => {
//     chai.request(server)
//       .post(`${groupRoute}/4/users`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send({ userEmailAddress: 'epokaipevj@epic_mail.com', userRole: 'Human Relations' })
//       .end((req, res) => {
//         res.should.be.json;
//         res.should.have.status(404);
//         expect(res.body).to.have.own.property('error', 'There is no registered user with the provided email');
//         done();
//       });
//   });

//   // Add a user to a group they already exist (409)
//   it('should return 409 status code', (done) => {
//     chai.request(server)
//       .post(`${groupRoute}/4/users`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send({ userEmailAddress: 'vicotor@epic_mail.com', userRole: 'People Validation' })
//       .end((req, res) => {
//         res.should.be.json;
//         res.should.have.status(409);
//         expect(res.body).to.have.own.property('error', 'Conflict: The email already exists in this group');
//         done();
//       });
//   });

//   // User does not have authority to add members to a group
//   it('should return 401 status code', (done) => {
//     chai.request(server)
//       .post(`${groupRoute}/3/users`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send(elicGroup)
//       .end((req, res) => {
//         res.should.be.json;
//         res.should.have.status(401);
//         expect(res.body).to.have.own.property('error', 'Unauthorized: You do not have the authority to add a user to this group');
//         done();
//       });
//   });

//   // User does not have authority to delete members from this group
//   it('should return 401 status code', (done) => {
//     chai.request(server)
//       .delete(`${groupRoute}/3/users/1`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .end((req, res) => {
//         res.should.be.json;
//         res.should.have.status(401);
//         expect(res.body).to.have.own.property('error', 'Unauthorized: You do not have authority to delete users from this group');
//         done();
//       });
//   });

//   // Validation error for Incomplete information
//   it('should return 422 status code', (done) => {
//     chai.request(server)
//       .post(`${groupRoute}/3/users`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send({ userEmailAddress: 'vicotor@epic_mail.com' })
//       .end((req, res) => {
//         res.should.have.status(400);
//         res.should.be.json;
//         res.body.should.have.property('error');
//         expect(res.body.error).to.have.own.property('error', 'Only userEmailAddress and userRole are required');
//         done();
//       });
//   });
// });

// describe('Populate all group contents', () => {
//   before((done) => {
//     chai.request(server)
//       .post(`${groupRoute}/4/users`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send(elicGroup)
//       .end((req, res) => {
//         done();
//       });
//   });

//   before((done) => {
//     chai.request(server)
//       .post(`${groupRoute}/4/users`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .send(rebecaGroup)
//       .end((req, res) => {
//         done();
//       });
//   });


//   // Succesfully delete the member of a group
//   it('should return 200 status code', (done) => {
//     chai.request(server)
//       .delete(`${groupRoute}/4/users/1`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .end((req, res) => {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.have.property('data');
//         done();
//       });
//   });

//   // Group to delete from does not exist
//   it('should return 404 status code', (done) => {
//     chai.request(server)
//       .delete(`${groupRoute}/22/users/1`)
//       .set('Authorization', `bearer ${groupContainer.token}`)
//       .end((req, res) => {
//         res.should.have.status(404);
//         res.should.be.json;
//         res.body.should.have.property('error');
//         expect(res.body).to.have.own.property('error', 'There is no group with this id');
//         done();
//       });
//   });


//   // Send a broadcast message to a group
//   // it('should return 201 status code', (done) => {
//   //     chai.request(server)
//   //         .post(`${groupRoute}/4/messages`)
//   //         .set('Authorization', `bearer ${groupContainer.token}`)
//   //         .send(broadcastMessage)
//   //         .end((req, res) => {
//   //             res.should.be.json;
//   //             res.should.have.status(201);
//   //             expect(res.body.data[0]).to.have.own.property('subject', 'WuraAndFadaka');
//   //             done();
//   //         })
//   // });

//   // There is no group with the specified id
//   // it('should return 404 status code', (done) => {
//   //     chai.request(server)
//   //         .post(`${groupRoute}/17/messages`)
//   //         .set('Authorization', `bearer ${groupContainer.token}`)
//   //         .send(broadcastMessage)
//   //         .end((req, res) => {
//   //             res.should.be.json;
//   //             res.should.have.status(404);
//   //             expect(res.body).to.have.own.property('error', 'Not Found: There is no group with the specified id');
//   //             done();
//   //         })
//   // });

//   // it('should return 404 status code', (done) => {
//   //     chai.request(server)
//   //         .post(`${groupRoute}/3/messages`)
//   //         .set('Authorization', `bearer ${groupContainer.token}`)
//   //         .send(broadcastMessage)
//   //         .end((req, res) => {
//   //             res.should.be.json;
//   //             res.should.have.status(404);
//   //             expect(res.body).to.have.own.property('error', 'Not Found: There are no members in the specified group');
//   //             done();
//   //         })
//   // });
// });
