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

  // Method to get a specific mail
  async getSpecificMail(req, res) {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) { return res.status(400).json({ status: 400, error: err }); }
      if (!user) {
        return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' });
      }
      const text = `SELECT * FROM messagesTable 
      WHERE id=$1 AND (receiverEmail=$2 OR senderEmail=$2)`;
      const values = [req.params.id, user.email];
      try {
        const { rows } = await db.query(text, values);
        if (!rows[0]) {
          return res.status(404).json({ status: 404, error: `Not Found, you do not have a message with id=${req.params.id}` });
        }
        // If the receiver is the one mjaking a request to the specific message
        // Then the message status should change to read if it was not yet read
        if (rows[0].status === 'inbox' && rows[0].receiveremail === user.email) {
          const updateText = `UPDATE messagesTable
          SET status=$1`;
          const updateValue = ['read'];
          await db.query(updateText, updateValue);
        }
        return res.status(200).json({ status: 200, data: [rows[0]] });
      } catch (error) {
        return res.status(400).json({ status: 400, error: `${error.name}, ${error.message}` });
      }
    })(req, res);
  },

  async deleteSpecificMail(req, res) {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (err) { return res.status(400).json({ status: 400, error: err }); }
      if (!user) {
        return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' });
      }
      const text = `SELECT * FROM messagesTable 
      WHERE id=$1 AND (receiverEmail=$2 OR senderEmail=$2)`;
      try {
        const values = [req.params.id, user.email];
        const { rows } = await db.query(text, values);
        if (!rows[0]) {
          return res.status(404).json({ status: 404, error: `You do not have a mail with id=${req.params.id}` });
        }
        if (rows[0].receiveremail === null || rows[0].senderemail === null) {
          const deleteText = `DELETE FROM 
        messagesTable WHERE (receiverEmail=$1 OR senderEmail=$1) AND id=$2`;
          const deleteValue = [user.email, req.params.id];
          await db.query(deleteText, deleteValue);
          res.status(200).json({ status: 200, data: 'Message deleted' });
        }

        if (rows[0].receiveremail || rows[0].senderemail === user.email) {
          const nullValue = [null, rows[0].id, user.email];
          const nullText = `UPDATE messagesTable
              SET receiverEmail=$1 WHERE id=$2 AND receiverEmail=$3`;
          await db.query(nullText, nullValue);
        }
        if (rows[0].senderemail === user.email) {
          const nullValue = [null, rows[0].id, user.email];
          const nullText = `UPDATE messagesTable
              SET senderEmail=$1 WHERE id=$2 AND senderEmail=$3`;
          await db.query(nullText, nullValue);
        }
        res.status(200).json({ status: 200, data: 'Message deleted' });
      } catch (error) {
        return res.status(400).json({ status: 400, error });
      }
    })(req, res);
  },

  async unreadReceivedMails(req, res) {
    passport.authenticate('jwt', {session:false}, async(err, user) => {
      if (err) { return res.status(400).json({ status: 400, error: err }); }
      if (!user) {
        return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' });
      }
      const text = `SELECT * FROM messagesTable WHERE receiverEmail=$1 AND status=$2`;
      const values = [user.email, 'inbox'];
      try {
        const {rows} = await db.query(text, values);
        if(!rows[0]){
          return res.status(404).json({status: 404, error: `Not Found, You do not have any unread emails at the moment`});
        }
        return res.status(200).json({ status: 200, data: rows })
      } catch (error) {
        return res.status(400).json({status: 400, error })
      }
    })(req, res);
  }, 
  
  async allReceivedMails(req, res) {
    passport.authenticate('jwt', {session:false}, async(err, user) => {
      if (err) { return res.status(400).json({ status: 400, error: err }); }
      if (!user) {
        return res.status(401).json({ status: 401, error: 'Unauthorized, Email or Password does not match' });
      }
      const text = `SELECT * FROM messagesTable WHERE receiverEmail=$1 AND (status=$2 OR status=$3)`;
      const values = [user.email, 'inbox', 'read'];
      try {
        const {rows} = await db.query(text, values);
        if(!rows[0]){
          return res.status(404).json({status: 404, error: `Not Found, You do not have any emails in your inbox at the moment`});
        }
        return res.status(200).json({ status: 200, data: rows })
      } catch (error) {
        return res.status(400).json({status: 400, error })
      }
    })(req, res);
  }, 
};


export default Mail;
