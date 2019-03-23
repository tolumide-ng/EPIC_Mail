import db from '../db/index';

const Group = {
  async createGroup(req, res) {
    const user = req.decodedToken;
    const { role, name } = req.value.body;
    const text = `INSERT INTO groupTable(role, name, createdBy)
            VALUES($1, $2, $3) returning *`;
    const values = [role, name, user.email];
    try {
      const { rows } = await db.query(text, values);
      return res.status(201).json({ status: 201, data: [rows[0]] });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },

  async getAllGroups(req, res) {
    const user = req.decodedToken;
    const text = 'SELECT * FROM groupTable';
    // const values = [user[0].email];
    try {
      const { rows } = await db.query(text);
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: 'There are no resgistered groups at the moment' });
      }
      return res.status(200).json({ status: 200, data: rows });
    } catch (error) {
      return res.status(400).json({ status: 400, error });
    }
  },

  async editGroupName(req, res) {
    const user = req.decodedToken;
    const idToNum = Number(req.params.id);
    if (isNaN(idToNum)) {
      return res.status(400).json({ status: 400, error: 'Bad request: Please ensure that the groupId is an integer' });
    }
    console.log(idToNum);
    const { name } = req.value.body;
    const text = 'SELECT * FROM groupTable WHERE id=$1';
    const values = [idToNum];
    console.log('here mow');
    try {
      const { rows } = await db.query(text, values);

      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: 'Not Found: Please check the provided groupId' });
      }
      console.log('welcome back');
      if (rows[0].createdby !== user.email) {
        return res.status(403).json({ status: 403, error: 'Unauthorized, You do not have the authority to rename this group' });
      }
      if (rows[0].createdby === user.email) {
        const updateText = 'UPDATE groupTable SET name=$1 WHERE id=$2 returning *';
        const updateValues = [name, idToNum];
        const { rows: updated } = await db.query(updateText, updateValues);
        return res.status(200).json({ status: 200, data: [updated[0]] });
      }
    } catch (error) {
      return res.status(400).json({ status: 400, error });
    }
  },


  async deleteSpecificGroup(req, res) {
    const user = req.decodedToken;
    const text = 'SELECT * FROM groupTable WHERE id=$1';
    const idToNum = Number(req.params.id);
    if (isNaN(idToNum)) {
      return res.status(400).json({ status: 400, data: 'Bad request, Please ensure that the groupId supplied is an integer' });
    }
    const value = [idToNum];
    try {
      const { rows } = await db.query(text, value);
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: `Not Found, There is no group with id=${idToNum}` });
      }
      if (rows[0].createdby !== user.email) {
        return res.status(403).json({ status: 403, error: 'Unauthorized, You do not have the authority to delete this group' });
      }
      if (rows[0].createdby === user.email) {
        const deleteText = 'DELETE FROM groupTable WHERE id=$1 returning *';
        const { rows: deleteGroup } = await db.query(deleteText, [idToNum]);
        return res.status(200).json({ status: 200, data: 'Group has been successfully deleted' });
      }
    } catch (error) {
      return res.status(400).json({ status: 400, error });
    }
  },

  async addNewMember(req, res) {
    const user = req.decodedToken;
    const idToNum = Number(req.params.id);
    if (isNaN(idToNum)) {
      return res.status(400).json({ status: 400, error: 'Bad request, please ensure that the groupId is an integer' });
    }
    const value = [idToNum];
    const text = 'SELECT * FROM groupTable WHERE id=$1';

    const { userEmailAddress, userRole } = req.value.body;
    try {
      const { rows } = await db.query(text, value);
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: `Not Found: There is no group with id=${idToNum}` });
      }
      if (rows[0].createdby === user.email) {
        const userExistsText = 'SELECT * FROM usersTable WHERE email=$1';
        const userExistsValue = [userEmailAddress];

        // Confirm if the user to be added exists in the usersTable
        const { rows: userExists } = await db.query(userExistsText, userExistsValue);
        if (!userExists[0]) {
          return res.status(404).json({ status: 404, error: 'There is no registered user with the provided email' });
        }

        // Check if the user already exists in this group to prevent double occurence in the group
        const searchText = 'SELECT * FROM groupmemberstable WHERE (userid=$1 AND groupId=$2)';
        const searchValues = [userExists[0].id, idToNum];

        const { rows: memberExistInGroup } = await db.query(searchText, searchValues);

        if (memberExistInGroup[0]) {
          return res.status(409).json({ status: 409, error: 'Conflict: The email already exists in this group' });
        }
        // If the email does not already exist in the group
        const addMemberText = `INSERT INTO groupMembersTable(groupId, userId, userRole)
                            VALUES($1,$2,$3) returning *`;
        const addMemberValue = [idToNum, userExists[0].id, userRole];
        const { rows: addMemberToGroup } = await db.query(addMemberText, addMemberValue);
        return res.status(201).json({ status: 201, data: addMemberToGroup });
      }

      return res.status(403).json({ status: 403, error: 'Unauthorized: You do not have the authority to add a user to this group' });
    } catch (error) {
      return res.status(400).json({ status: 400, error });
    }
  },

  async deleteSpecificUserFromGroup(req, res) {
    const groupId = Number(req.params.groupId);
    const userId = Number(req.params.userId);
    if (isNaN(groupId) || isNaN(userId)) {
      return res.status(400).json({ status: 400, error: 'Please ensure the userId and groupId are numbers' });
    }
    const user = req.decodedToken;
    const theGroupText = 'SELECT * FROM groupTable WHERE id=$1';
    const theGroupValue = [groupId];

    try {
      // Search groupTable to see if the group exist, access the creator if it does
      const { rows: theGroup } = await db.query(theGroupText, theGroupValue);
      if (!theGroup[0]) {
        return res.status(404).json({ status: 404, error: 'There is no group with this id' });
      }
      // Group exists confirm and user owns the group
      if (theGroup[0].createdby === user.email) {
        const theMemberText = 'SELECT * FROM groupMembersTable WHERE groupId=$1 AND userId=$2';
        const theMemberValue = [groupId, userId];
        const { rows: theMember } = await db.query(theMemberText, theMemberValue);
        // The member to be deleted does not exist in the group
        if (!theMember[0]) {
          return res.status(404).json({ status: 404, error: `There is no user with userid=${req.params.userId} in the specified group` });
        }
        // Member exists, delete the member from the group
        const deleteText = 'DELETE FROM groupMembersTable WHERE groupId=$1 AND userId=$2 returning *';
        const deleteValues = [groupId, req.params.userId];
        const { rows: deletedMember } = await db.query(deleteText, deleteValues);
        return res.status(200).json({ status: 200, data: 'Member deleted from group successfully' });
      }
      return res.status(403).json({ status: 403, error: 'Unauthorized: You do not have authority to delete users from this group' });
    } catch (error) {
      res.status(400).json({ status: 400, error });
    }
  },

  async broadcastMessage(req, res) {
    const user = req.decodedToken;
    const { subject, message, parentMessagedId } = req.value.body;
    // Does the group exist?
    const groupExistText = 'SELECT * FROM groupTable WHERE id=$1';
    const groupExistValue = [req.params.groupId];
    try {
      const { rows: groupExist } = await db.query(groupExistText, groupExistValue);
      if (!groupExist[0]) {
        return res.status(404).json({ status: 404, error: 'Not Found: There is no group with the specified id' });
      }
      // If group exist, are there any members in the group
      const text = 'SELECT userId FROM groupMembersTable WHERE groupId=$1';
      const value = [req.params.groupId];
      const { rows } = await db.query(text, value);
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: 'Not Found: There are no members in the specified group' });
      }
      // Get all members of the group
      const emailContainer = [];
      const userIdContainer = [];
      rows.forEach(user => userIdContainer.push(user.userid));
      // Clean repetitions in userid
      const allMembers = Array.from(new Set(userIdContainer));
      allMembers.forEach(async (member) => {
        // Get email address of each member of the group
        const memberEmailText = 'SELECT * FROM usersTable WHERE id=$1';
        const { rows: membersEmail } = await db.query(memberEmailText, [member]);
        // emailContainer.push(membersEmail[0].email);;
        const sendInboxText = `INSERT INTO messagesTable(subject, message, parentMessageId, senderEmail, receiverEmail, status)
                  VALUES($1, $2, $3, $4, $5, $6) returning *`;
        const sendInboxValues = [subject, message, parentMessagedId || null, user.email, (membersEmail[0]).email, 'inbox'];
        const { rows: eachSentEmail } = await db.query(sendInboxText, sendInboxValues);

        emailContainer.push(eachSentEmail[0]);

        // Response is sent when the last email as been sent
        if (member === allMembers[allMembers.length - 1]) {
          return res.status(201).json({ status: 201, data: emailContainer });
        }
      });
    } catch (error) {
      return res.status(400).json({ error: 400, error });
    }
  },

  // async passwordReset(req, res) {
  //   const resetEmail = req.body.email;
  //   const findSecondaryText = 'SELECT * FROM  usersTable WHERE email=$1';
  //   const findSecondaryValue = [resetEmail];

  //   const { rows: findSecondaryEmail } = await db.query(findSecondaryText, findSecondaryValue);
  //   if (!findSecondaryEmail[0]) {
  //     return res.status(404).json({ status: 404, error: 'Not Found: Email specified for reset password does not exist' });
  //   }
  //   const { email, secondaryemail } = findSecondaryEmail;

  //   const resetText = 'INSERT INTO resetPassword(message, secondaryEmail, userEmail) VALUES($1, $2, $3) returning *';
  //   const message = 'Please find the link to reset your password here: bit.ly, link expires in 24 hours, goodluck'
  //   const resetValue = [message, secondaryemail, email];

  //   // Insert the message the database
  //   await db.query(resetText, resetValue);
  //   return res.status(201).json({ status: 201, data: { message, email } });
  // },
};

export default Group;
