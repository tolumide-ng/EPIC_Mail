import dotenv from 'dotenv';
import db from '../db/index';

dotenv.config();

const Mail = {
  // Method to create a new message
  async composeMail(req, res) {
    const user = req.decodedToken, generated = {};
    const { receiverEmail, subject, message, parentMessageId,} = req.value.body;
      if (!parentMessageId) { generated.parentMessageId = null; }
      generated.senderEmail = user.email;
      try {
        if (!receiverEmail) {
          generated.receiverEmail = null;
          generated.status = 'draft';
          const text = `INSERT INTO messagesTable(subject, message, parentMessageId, senderEmail, receiverEmail, status)
          VALUES($1, $2, $3, $4, $5, $6) returning *`;
          const values = [subject, message, parentMessageId || generated.parentMessageId, user.email, receiverEmail || generated.receiverEmail, generated.status];
          const { rows } = await db.query(text, values);
          return res.status(201).json({ status: 201, data: [rows[0]] });
        }
        const text = `INSERT INTO messagesTable(subject, message, parentMessageId, senderEmail, receiverEmail, status)
        VALUES($1,$2,$3,$4,$5,$6) returning *`;
        const values = [subject, message, parentMessageId || generated.parentMessageId, generated.senderEmail, receiverEmail, 'inbox'];
        const { rows: theMessage } = await db.query(text, values);
        return res.status(201).json({ status: 201, data: [theMessage[0]] });
      } catch (error) {
        return res.status(400).json({ status: 400, error: `${error.name}, ${error.message}` });
      }
  },

  // Method to get a specific mail
  async getSpecificMail(req, res) {
    const user = req.decodedToken;
      const text = `SELECT * FROM messagesTable WHERE id=$1 AND (receiverEmail=$2 OR senderEmail=$2)`;
      const values = [req.params.id, user.email];
      try {
        const { rows } = await db.query(text, values);
        if (!rows[0]) {
          return res.status(404).json({ status: 404, error: `Not Found, you do not have a message with id=${req.params.id}` });
        }
        if(rows[0].receiverstatus === 'deleted' && rows[0].receiveremail === user.email){
          return res.status(404).json({ status: 404, error: `Not Found, you do not have a message with id=${req.params.id}` });
        }
        if(rows[0].senderstatus === 'deleted' && rows[0].senderemail === user.email){
          return res.status(404).json({ status: 404, error: `Not Found, you do not have a message with id=${req.params.id}` });
        }
        // If the receiver is the one making a request to the specific message
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
  },

  async deleteSpecificMail(req, res) {
    const user = req.decodedToken;
      const text = `SELECT * FROM messagesTable WHERE id=$1 AND (receiverEmail=$2 OR senderEmail=$2)`;
      try {
        const values = [req.params.id, user.email];
        const { rows } = await db.query(text, values);
        if (!rows[0]) {
          return res.status(404).json({ status: 404, error: `You do not have a mail with id=${req.params.id}` });
        }
        if((rows[0].receiveremail === user.email) && (receiverstatus === 'deleted')){
          return res.status(404).json({ status: 404, error: `You do not have a mail with id=${req.params.id}` });
        }
        if((rows[0].senderemail === user.email) && (rows[0].senderstatus === 'deleted')){
          return res.status(404).json({ status: 404, error: `You do not have a mail with id=${req.params.id}` });
        }
        // If the senderstatus || receiverstatus was already null, then delete the message completely
        if (rows[0].receiverstatus === 'deleted' || rows[0].senderstatus === 'deleted') {
          const deleteText = `DELETE FROM 
        messagesTable WHERE (receiverEmail=$1 OR senderEmail=$1) AND id=$2`;
          const deleteValue = [user.email, req.params.id];
          await db.query(deleteText, deleteValue);
          res.status(200).json({ status: 200, data: 'Message deleted' });
        }

        // who wants to delete, set status to null
        if (!rows[0].receiverstatus && rows[0].receiveremail === user.email) {
          const deleteValue = ['deleted', rows[0].id, user.email];
          const deleteText = `UPDATE messagesTable
              SET receiverstatus=$1 WHERE id=$2 AND receiverEmail=$3`;
          await db.query(deleteText, deleteValue);
        }
        if (rows[0].senderemail === user.email && !rows[0].senderstatus) {
          const deleteValue = ['deleted', rows[0].id, user.email];
          const deleteText = `UPDATE messagesTable
              SET senderstatus=$1 WHERE id=$2 AND senderEmail=$3`;
          await db.query(deleteText, deleteValue);
        }
        res.status(200).json({ status: 200, data: 'Message deleted' });
      } catch (error) {
        return res.status(400).json({ status: 400, error });
      }      
  },

  async unreadReceivedMails(req, res) {
    const user = req.decodedToken;
      const text = 'SELECT * FROM messagesTable WHERE receiverEmail=$1 AND status=$2';
      const values = [user.email, 'inbox'];
      try {
        const { rows } = await db.query(text, values);
        if (!rows[0] || rows[0].receiverstatus === 'deleted') {
          return res.status(404).json({ status: 404, error: 'Not Found, You do not have any unread emails at the moment' });
        }
        return res.status(200).json({ status: 200, data: rows });
      } catch (error) {
        return res.status(400).json({ status: 400, error });
      }
  },

  async allReceivedMails(req, res) {
    const user = req.decodedToken;
      const text = 'SELECT * FROM messagesTable WHERE receiverEmail=$1 AND (status=$2 OR status=$3) AND receiverstatus<>$4';
      const values = [user.email, 'inbox', 'read', 'deleted'];
      try {
        const { rows } = await db.query(text, values);
        if (!rows[0] || rows[0].receiverstatus === 'deleted') {
          return res.status(404).json({ status: 404, error: 'Not Found, You do not have any emails in your inbox at the moment' });
        }
        return res.status(200).json({ status: 200, data: rows });
      } catch (error) {
        return res.status(400).json({ status: 400, error });
      }
  },

  async allSentMails(req, res) {
    const user = req.decodedToken, values = [user.email];
      const text = 'SELECT * FROM messagesTable WHERE senderEmail=$1';
      try {
        const { rows } = await db.query(text, values);
        if (!rows[0] || rows[0].senderstatus === 'deleted') {
          return res.status(404).json({ status: 404, error: 'Not Found, You do not have any sent emails at the moment' });
        }
        return res.status(200).json({ status: 200, data: rows });
      } catch (error) {
        return res.status(400).json({ status: 400, error });
      }
  },
};


export default Mail;
