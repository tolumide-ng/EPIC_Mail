import usersModels from '../models/usersModels';

const User = {
  signup(req, res) {
    const request = req.value.body;
    const confirmUserExist = usersModels.findUserByEmail(request.email);
    if (!confirmUserExist) {
      const createdUser = usersModels.signup(request);
      return res.status(201).json({ status: 201, data: [createdUser] });
    }
    return res.status(409).json({ status: 409, error: 'Email is already in use' });
  },

  login(req, res) {
    const request = req.body;
    const loginDetails = usersModels.userLogin(request);
    return res.status(200).json({ status: 200, data: [loginDetails] });
  },
};

export default User;
