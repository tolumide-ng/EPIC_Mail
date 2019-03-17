import express from 'express';
import passport from 'passport';

import groupsControllers from './../controllers/groupsControllers';
import passportConf from './../passport';
import groupHelpers from './../helpers/groupsHelpers';

const { validateBody, schemas } = groupHelpers

const router = express.Router();

router.post('/:id/users', validateBody(schemas.addGroupMember), groupsControllers.addNewMember);
router.post('/', validateBody(schemas.createGroup), groupsControllers.createGroup);
router.get('/', groupsControllers.getAllGroups);
router.patch('/:id/:name', groupsControllers.editGroupName);
router.delete('/:id', groupsControllers.deleteSpecificGroup);
router.delete('/:groupId/users/:userId', groupsControllers.deleteSpecificUserFromGroup);
router.post('/:groupId/messages/', validateBody(schemas.broadCastMessage), groupsControllers.broadcastMessage);


export default router;