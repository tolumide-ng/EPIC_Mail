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

}

export default Group;