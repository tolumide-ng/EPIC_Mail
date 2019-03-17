import passport from 'passport';
import passportConf from './../passport';
import db from './../db/index';

const Group = {
    async createGroup(req, res) {
        passport.authenticate('jwt', {session: false}, async(err, user)=> {
            if(err) { return res.status(400).json({ status: 400, error: err });}
            if(!user) {
                return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' })
            }
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
        })(req, res);
    }, 

    async getAllGroups(req, res){
        passport.authenticate('jwt', {session: false}, async(err, user) => {
            if(err) { return res.status(400).json({ status: 400, error: err });
            if(!user) {
                return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' })
            }}
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
        })(req, res);
    },

    async editGroupName(req, res) {
        passport.authenticate('jwt', {session: false}, async(err, user) => {
            if(err) { return res.status(400).json({ status: 400, error: err })};
            if(!user) {
                return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' })
            }
            const { id, name } = req.params;
            const text = `SELECT * FROM groupTable 
            WHERE id=$1`;
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
                    const text= `UPDATE groupTable SET name=$1 returning *`;
                    const values = [name];
                    const {rows} = await db.query(text, values);
                    return res.status(200).json({status: 200, data: [rows[0]]})
                }
            } catch(error) {
                return res.status(400).json({status: 400, error })
            }
        })(req, res);
    },


    async deleteSpecificGroup(req, res) {
        passport.authenticate('jwt', {session: false}, async(err, user) => {
            if(err) { return res.status(400).json({ status: 400, error: err })};
            if(!user) {
                return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' })
            }
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
        })(req, res);
    }, 

    async addNewMember(req, res) {
        passport.authenticate('jwt', {session: false}, async(err, user) => {
            if(err) { return res.status(400).json({ status: 400, error: err })}
            if(!user) {
                return res.status(401).json({ status: 401, error: 'Unauthorized, Email or password does not match'})
            }
         const text = `SELECT * FROM groupTable WHERE id=$1`;
            const value = [req.params.id]

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
                        return res.status(201).json({ status: 201, data: [addMemberToGroup[0]] })
                        
                        }
                        
                    return res.status(401).json({ status: 401, error: 'Unauthorized: You do not have the authority to add a user to this group'});
            } catch(error) {
                return res.status(400).json({ status: 400, error})
            }
        })(req, res);
    },

}

export default Group;