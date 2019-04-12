import express from 'express';

import groupsControllers from '../controllers/groupsControllers';
import tokenVerification from '../helpers/tokenVerification';
import trimmerjs from '../helpers/trimmer';
import groupValidation from '../helpers/groupValidator';

const { trimmer } = trimmerjs;
const {
  createGroupValidator, addGroupMemberValidator, renameGroupValidator, broadCastMessageValidator,
} = groupValidation;
const { verifyToken, validateToken } = tokenVerification;

const router = express.Router();

router.post('/:id/users', verifyToken, validateToken, trimmer, addGroupMemberValidator, groupsControllers.addNewMember);
router.post('/', verifyToken, validateToken, trimmer, createGroupValidator, groupsControllers.createGroup);
router.get('/', verifyToken, validateToken, groupsControllers.getAllGroups);
router.get('/:id', verifyToken, validateToken, groupsControllers.viewSpecificGroup);
router.patch('/:id/name', trimmer, renameGroupValidator, verifyToken, validateToken, groupsControllers.editGroupName);
router.delete('/:id', verifyToken, validateToken, groupsControllers.deleteSpecificGroup);
router.delete('/:groupId/users/:userId', verifyToken, validateToken, groupsControllers.deleteSpecificUserFromGroup);
router.post('/:groupId/messages/', verifyToken, validateToken, broadCastMessageValidator, groupsControllers.broadcastMessage);

export default router;
