import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../db';

dotenv.config();

export default {
  verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers.authorization;
    if (bearerHeader !== undefined) {
      // Split token at the space
      const bearer = bearerHeader.split(' ');
      // Get token from the array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      next();
    } else {
      return res.status(401).json({ status: 401, error: 'Unauthorized, Please include token in the header and prepend with `bearer `' });
    }
  },

  validateToken(req, res, next) {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
      if(err) {
        return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match'});
      }
      try {
        const getDetailsText = `SELECT * FROM usersTable WHERE id=$1`;
        const getDetailsValue = [authData.sub];
        const {rows: getDetails} = await db.query(getDetailsText, getDetailsValue);
        if(!getDetails[0]){
          return res.status(404).json({ status: 404, error: 'Unauthorized, session expired'})
        }
        req.decodedToken = getDetails[0];
        next();
      } catch(error) {
        return res.status(500).json({ status: 500, error })
      }
    })
  }
};
