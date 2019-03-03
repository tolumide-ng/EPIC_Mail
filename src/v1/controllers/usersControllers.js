import usersModels from './../models/usersModels';

const User = {
    signup(req, res) {
        const returnedInfo = usersModels.signup(req.body);
        return res.status(200).json({ status: 200, data: [returnedInfo], });
    }
}

export default User;