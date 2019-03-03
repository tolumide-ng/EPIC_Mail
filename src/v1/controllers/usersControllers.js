import usersModels from './../models/usersModels';

const User = {
    signup(req, res) {
        const request = req.value.body;
        const confirmUserExist = usersModels.findUser(request);
        if (!confirmUserExist) {
            const createdUser = usersModels.signup(request);
            return res.status(201).json({ status: 201, data: [createdUser], });
        }
        return res.status(409).json({ status: 409, error: 'Email already exists' })
    }
}

export default User;