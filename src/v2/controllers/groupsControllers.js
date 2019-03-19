import passport from 'passport';
import passportConf from './../passport';
import db from './../db/index';

const Group = {
    async createGroup(req, res) {
        const user = req.decodedToken;
            const { role, name } = req.value.body;
            const text = `INSERT INTO groupTable(role, name, createdBy)
            VALUES($1, $2, $3) returning *`;
            const values = [role, name, user.email];
            try {
                const { rows } = await db.query(text, values);
                return res.status(201).json({
                    status: 201, data: [rows[0]]
                });
            }catch(error){
                return res.status(400).json({ status: 400, error})
            }
    }, 

    async getAllGroups(req, res){
        const user = req.decodedToken;
            const text = `SELECT * FROM groupTable`;
            const values = [];
            try {
                const {rows} = await db.query(text);
                if(!rows[0]){
                    return res.status(404).json({ status: 404, error: 'There are no resgistered groups at the moment'});
                }
                return res.status(200).json({ status: 200, data: rows })
            } catch (error) {
                return res.status(400).json({status: 400, error})
            }
    },

    async editGroupName(req, res) {
        const user = req.decodedToken;
            const { id, name } = req.params;
            const text = `SELECT * FROM groupTable WHERE id=$1`;
            const values = [id];
            try {
                const { rows } = await db.query(text, values);
                
                if(!rows[0]){
                    return res.status(404).json({ status: 404, error: 'Not Found: Please check the provided groupId'})
                }
                if(rows[0].createdby !== user.email){
                    return res.status(401).json({status: 401, error: 'Unauthorized, You do not have the authority to rename this group'});
                }
                if(rows[0].createdby === user.email){
                    const text= `UPDATE groupTable SET name=$1 WHERE id=$2 returning *`;
                    const values = [name, id];
                    const {rows} = await db.query(text, values);
                    return res.status(200).json({status: 200, data: [rows[0]]})
                }
            } catch(error) {
                return res.status(400).json({status: 400, error })
            }
    },


    async deleteSpecificGroup(req, res) {
        const user = req.decodedToken
            const text = `SELECT * FROM groupTable WHERE id=$1`
            const value = [req.params.id];
            try {
                const {rows} = await db.query(text, value);
                if(!rows[0]){
                    return res.status(404).json({ status: 404, error: `Not Found, There is no group with id=${req.params.id}`});
                }
                if(rows[0].createdby !== user.email){
                    return res.status(401).json({ status: 401, error: `Unauthorized, You do not have the authority to delete this group`});
                }
                if(rows[0].createdby === user.email) {
                    const text = `DELETE FROM groupTable WHERE id=$1 returning *`;
                    try {
                        const {rows} = await db.query(text, [req.params.id]);
                        return res.status(200).json({ status: 200, data: 'Group has been successfully deleted'});
                    } catch(error) {
                        return res.status(400).json({ status: 400, error })
                    }
                }
            }catch(error){
                return res.status(400).json({status: 400, error})
            }
    }, 

    async addNewMember(req, res) {
        const user = req.decodedToken, value = [req.params.id];
         const text = `SELECT * FROM groupTable WHERE id=$1`;

            const {userEmailAddress, userRole} = req.value.body;
            try {
                const {rows} = await db.query(text, value);
                if(!rows[0]){
                    return res.status(404).json({ status: 404, error: `Not Found: There is no group with id=${req.params.id}`});
                }
                if(rows[0].createdby === user.email) {
                    const userExistsText = `SELECT * FROM usersTable WHERE email=$1`
                    const userExistsValue = [userEmailAddress]
                    
                    // Confirm if the user to be added exists in the usersTable
                    const {rows: userExists} = await db.query(userExistsText, userExistsValue);
                        if(!userExists[0]){
                            return res.status(404).json({status: 404, error: `There is no registered user with the provided email`})
                        }

                        // Check if the user already exists in this group to prevent double occurence in the group
                        const searchText=`SELECT * FROM groupmemberstable WHERE (userid=$1 AND groupId=$2)`;
                        const searchValues = [userExists[0].id, req.params.id];

                        const { rows: memberExistInGroup} = await db.query(searchText, searchValues);

                        if(memberExistInGroup[0]){
                            return res.status(409).json({ status: 409, error: 'Conflict: The email already exists in this group'});
                        }
                        // If the email does not already exist in the group
                        const addMemberText = `INSERT INTO groupMembersTable(groupId, userId, userRole)
                            VALUES($1,$2,$3) returning *`;
                        const addMemberValue = [req.params.id, userExists[0].id, userRole]
                        const { rows: addMemberToGroup } = await db.query(addMemberText, addMemberValue);
                        return res.status(201).json({ status: 201, data: addMemberToGroup })
                        
                        }
                        
                    return res.status(401).json({ status: 401, error: 'Unauthorized: You do not have the authority to add a user to this group'});
            } catch(error) {
                return res.status(400).json({ status: 400, error})
            }
    },

    async deleteSpecificUserFromGroup(req, res) {
        const user = req.decodedToken;
            const theGroupText=`SELECT * FROM groupTable WHERE id=$1`
            const theGroupValue= [req.params.groupId];

            try {
                 // Search groupTable to see if the group exist, access the creator if it does
                const { rows: theGroup } = await db.query(theGroupText, theGroupValue);
                if(!theGroup[0]){
                    return res.status(404).json({status: 404, error: 'There is no group with this id'})
                }
                // Group exists confirm and user owns the group
                if(theGroup[0].createdby === user.email){
                    const theMemberText = `SELECT * FROM groupMembersTable WHERE groupId=$1 AND userId=$2`
                    const theMemberValue = [req.params.groupId, req.params.userId];
                    const { rows: theMember } = await db.query(theMemberText, theMemberValue);
                    // The member to be deleted does not exist in the group
                    if(!theMember[0]){
                        return res.status(404).json({ status: 404, error: `There is no user with userid=${req.params.userId} in the specified group`})
                }
                // Member exists, delete the member from the group
                const deleteText = `DELETE FROM groupMembersTable WHERE groupId=$1 AND userId=$2 returning *`;
                const deleteValues = [req.params.groupId, req.params.userId];
                const { rows: deletedMember} = await db.query(deleteText, deleteValues);
                return res.status(200).json({ status: 200, data: `Member deleted from group successfully`});
                }
                return res.status(401).json({ status: 401, error: 'Unauthorized: You do not have authority to delete users from this group'})
            } catch(error){
                res.status(400).json({ status: 400, error })
            }
    },

    // async broadcastMessage(req, res) {
    //     const user = req.decodedToken;
    //         const {subject, message, parentMessagedId} = req.value.body;
    //         // Does the group exist?
    //         const groupExistText = `SELECT * FROM groupTable WHERE id=$1`;
    //         const groupExistValue = [req.params.groupId];
    //         try {
    //             const { rows: groupExist} = await db.query(groupExistText, groupExistValue);
    //             if(!groupExist[0]){
    //                 return res.status(404).json({ status: 404, error: 'Not Found: There is no group with the specified id'})
    //             }
    //             // If group exist, are there any members in the group
    //             const text = `SELECT userId FROM groupMembersTable WHERE groupId=$1`
    //             const value = [req.params.groupId];
    //             const { rows } = await db.query(text, value);
    //             if(!rows[0]){
    //                 return res.status(404).json({ status: 404, error: 'Not Found: There are no members in the specified group'});
    //             }
    //             //Get all members of the group
    //             const emailContainer = [];
    //             const allMembers = Array.from(new Set(rows[0].userid));
    //             allMembers.forEach( async member => {
    //                 const memberEmailText = `SELECT * FROM usersTable WHERE id=$1`;
    //                 const {rows: membersEmail} = await db.query(memberEmailText, member);
    //                 emailContainer.push(rows[0].email)
    //                 membersEmail[0].forEach(async email => {
    //                 const sendInboxText = `INSERT INTO messagesTable(subject, message, parentMessageId, senderEmail, receiverEmail, status)
    //                 VALUES($1, $2, $3, $4, $5, $6) returning *`
    //                 const sendInboxValues = [subject, message, parentMessagedId||null, user.email, member, 'inbox'];
    //                 const {rows: allSentMessages} = await db.query(sendInboxText, sendInboxValues);
    //                     // emailContainer.push(email);
    //                 return res.status(201).json({ status: 201, data: allSentMessages})
    //                 })
    //             });

    //         } catch (error) {
    //             return res.status(400).json({ error: 400, error })
    //         }
    // }

}

export default Group;