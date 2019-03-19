import express from 'express';
import passport from 'passport';

import groupsControllers from './../controllers/groupsControllers';
import tokenVerification from './../helpers/tokenVerification';
import passportConf from './../passport';
import groupHelpers from './../helpers/groupsHelpers';

const { validateBody, schemas } = groupHelpers;
const { verifyToken, validateToken } = tokenVerification;

const router = express.Router();

router.post('/:id/users', verifyToken, validateToken, validateBody(schemas.addGroupMember), groupsControllers.addNewMember);
router.post('/', verifyToken, validateToken, validateBody(schemas.createGroup), groupsControllers.createGroup);
router.get('/', verifyToken, validateToken, groupsControllers.getAllGroups);
router.patch('/:id/:name', verifyToken, validateToken, groupsControllers.editGroupName);
router.delete('/:id', verifyToken, validateToken, groupsControllers.deleteSpecificGroup);
router.delete('/:groupId/users/:userId', verifyToken, validateToken, groupsControllers.deleteSpecificUserFromGroup);
// router.post('/:groupId/messages/', verifyToken, validateToken, validateBody(schemas.broadCastMessage), groupsControllers.broadcastMessage);


export default router;