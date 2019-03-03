import usersModels from './../models/usersModels';

const User = {
    signup(req, res) {
        const request = req.value.body;
        console.log(' request is here now');
        const confirmUserExist = usersModels.findUser(request);
        if (!confirmUserExist) {
            console.log('the user does not exist');
            const createdUser = usersModels.signup(request);
            console.log(' response gotten now');
            return res.status(201).json({ status: 201, data: [createdUser] });
        }
        return res.status(409).json({ status: 409, error: 'Email is already in use' })
    }
}

export default User;