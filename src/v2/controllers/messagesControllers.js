import passport from 'passport';
import { request } from 'http';
import passportConf from '../passport';
import db from '../db/index';

const Mail = {
  // Method to create a new message
  async composeMail(req, res) {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) { return res.status(400).json({ status: 400, error: err }); }
      if (!user) {
        return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' });
      }
      const {
        receiverEmail, subject, message, parentMessageId,
      } = req.value.body;
      const generated = {};
      if (!parentMessageId) { generated.parentMessageId = null; }
      generated.senderEmail = await user.email;
      try {
        // const { rows } = await db.query(text, values);
        if (!receiverEmail) {
          generated.receiverEmail = null;
          generated.status = 'draft';
          const text = `INSERT INTO messagesTable(subject, message, parentMessageId, senderEmail, receiverEmail, status)
          VALUES($1, $2, $3, $4, $5, $6) returning *`;
          const values = [subject, message, parentMessageId || generated.parentMessageId, generated.senderEmail, receiverEmail || generated.receiverEmail, generated.status];
          const { rows } = await db.query(text, values);
          return res.status(201).json({ status: 201, data: [rows[0]] });
        }
        const text = `INSERT INTO messagesTable(subject, message, parentMessageId, senderEmail, receiverEmail, status)
        VALUES($1,$2,$3,$4,$5,$6) returning *`;
        const values = [subject, message, parentMessageId || generated.parentMessageId, generated.senderEmail, receiverEmail, 'inbox'];
        const { rows } = await db.query(text, values);
        return res.status(201).json({ status: 201, data: [rows[0]] });
      } catch (error) {
        return res.status(400).json({ status: 400, error: `${error.name}, ${error.message}` });
      }
    })(req, res);
  },
};


export default Mail;
