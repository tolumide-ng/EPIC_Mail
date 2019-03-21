import express from 'express';

import groupsControllers from '../controllers/groupsControllers';
import tokenVerification from '../helpers/tokenVerification';
import groupHelpers from '../helpers/groupsHelpers';
import trimmerjs from '../helpers/trimmer';

const { trimmer } = trimmerjs;
const {
  createGroup, addGroupMember, broadCastMessage, renameGroup,
} = groupHelpers;
const { verifyToken, validateToken } = tokenVerification;


const router = express.Router();

router.post('/:id/users', verifyToken, validateToken, trimmer, addGroupMember, groupsControllers.addNewMember);
router.post('/', verifyToken, validateToken, trimmer, createGroup, groupsControllers.createGroup);
router.get('/', verifyToken, validateToken, groupsControllers.getAllGroups);
router.patch('/:id/name', trimmer, renameGroup, verifyToken, validateToken, groupsControllers.editGroupName);
router.delete('/:id', verifyToken, validateToken, groupsControllers.deleteSpecificGroup);
router.delete('/:groupId/users/:userId', verifyToken, validateToken, groupsControllers.deleteSpecificUserFromGroup);
router.post('/:groupId/messages/', verifyToken, validateToken, broadCastMessage, groupsControllers.broadcastMessage);


export default router;
