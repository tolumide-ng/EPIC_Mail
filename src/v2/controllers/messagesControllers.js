import dotenv from 'dotenv';
import { isNull } from 'util';
import db from '../db/index';

dotenv.config();

const Mail = {
  // Method to create a new message
  async composeMail(req, res) {
    const user = req.decodedToken;
    const generated = {};
    const {
      receiverEmail, subject, message, receiveremail,
    } = req.value.body;
    // if (!parentMessageId) { generated.parentMessageId = null; }
    // Please note the difference in receiverEmail and receiveremail
    // receiveremail enabled to allow messages previously saved as draft using the saveDraft controller
    // to be edited or and sent to user
    generated.senderEmail = user.email;
    try {
      if (!receiverEmail && !receiveremail) {
        generated.receiverEmail = null;
        generated.status = 'draft';
        const text = `INSERT INTO messagesTable(subject, message, senderEmail, receiverEmail, status)
          VALUES($1, $2, $3, $4, $5) returning *`;
        const values = [subject, message, user.email, receiverEmail || generated.receiverEmail, generated.status];
        const { rows } = await db.query(text, values);
        return res.status(201).json({ status: 201, data: [rows[0]], message: 'Message saved as draft' });
      }

      const searchText = 'SELECT * FROM usersTable WHERE email=$1';
      const searchValue = [receiverEmail || receiveremail];
      const { rows: recipient } = await db.query(searchText, searchValue);
      if (!recipient[0]) {
        return res.status(404).json({ status: 404, error: 'Receiver Not Found: Please ensure the receiverEmail is registered to epic mail' });
      }
      const text = `INSERT INTO messagesTable(subject, message, senderEmail, receiverEmail, status)
        VALUES($1,$2,$3,$4,$5) returning *`;
      const values = [subject, message, generated.senderEmail, receiverEmail || receiveremail, 'inbox'];
      const { rows: theMessage } = await db.query(text, values);
      const dbResponse = theMessage[0];
      const responseText = {};
      Object.keys(dbResponse).forEach((key) => {
        const value = dbResponse[key];
        if (value) {
          Object.assign(responseText, { [key]: value });
        }
      });
      const theReceiver = () => {
        if (!receiveremail) {
          return receiverEmail;
        }
        if (!receiverEmail) {
          return receiveremail;
        }
      };

      return res.status(201).json({
        status: 201,
        data: [responseText],
        message: `Message sent to ${theReceiver()}`,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error: `${error.name}, ${error.message}` });
    }
  },

  async saveDraft(req, res) {
    const user = req.decodedToken;
    const generated = {};
    const { receiverEmail, subject, message } = req.value.body;
    generated.senderEmail = user.email;
    generated.status = 'draft';
    const searchText = 'SELECT * FROM usersTable WHERE email=$1';
    const searchValue = [receiverEmail];
    const text = `INSERT INTO messagesTable(subject, message, senderEmail, receiverEmail, status)
            VALUES($1, $2, $3, $4, $5) returning *`;
    const values = [subject, message, generated.senderEmail, receiverEmail, 'draft'];

    try {
      if (receiverEmail) {
        const { rows: receiverExists } = await db.query(searchText, searchValue);
        if (!receiverExists[0]) {
          return res.status(404).json({ status: 404, error: 'Receiver Not Found: Please ensure the receiverEmail is registered to epic mail' });
        }
      }
      const { rows: theDraft } = await db.query(text, values);
      return res.status(201).json({ status: 201, data: [theDraft[0]], message: 'Message saved as draft' });
    } catch (error) {
      return res.status(500).json({ status: 500, error: `${error.name}, ${error.message}` });
    }
  },

  // Method to get a specific mail
  async getSpecificMail(req, res) {
    const user = req.decodedToken;
    const text = 'SELECT * FROM messagesTable WHERE id=$1 AND (receiverEmail=$2 OR senderEmail=$2)';
    const values = [req.params.id, user.email];
    const idToNum = Number(req.params.id);
    if (isNaN(idToNum)) {
      return res.status(400).json({ status: 400, error: 'Bad request, please ensure the id is an integer' });
    }
    try {
      const { rows } = await db.query(text, values);
      console.log(rows[0]);

      // If the message does not exist
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: `Not Found, you do not have a message with id=${idToNum}` });
      }

      // Message exists but this is the first time the receiver is viewing it
      if (rows[0].status === 'inbox' && rows[0].receiveremail === user.email && rows[0].receiverstatus !== 'deleted') {
        const updateText = `UPDATE messagesTable
          SET status=$1 WHERE id=$2 AND receiverEmail=$3 returning *`;
        const updateValue = ['read', idToNum, user.email];
        const { rows: readMail } = await db.query(updateText, updateValue);
        const dbResponse = readMail[0];
        const responseText = {};
        Object.keys(dbResponse).forEach((key) => {
          const value = dbResponse[key];
          if (value) {
            Object.assign(responseText, { [key]: value });
          }
        });
        return res.status(200).json({ status: 200, data: [responseText] });
      }
      if (rows[0].senderemail === user.email && rows[0].senderstatus !== 'deleted') {
        return res.status(200).json({ status: 200, data: [rows[0]] });
      }
      if (rows[0].receiveremail === user.email && rows[0].receiverstatus !== 'deleted') {
        return res.status(200).json({ status: 200, data: [rows[0]] });
      }
      return res.status(404).json({ status: 404, error: `Not Found, you do not have a message with id=${idToNum}` });
    } catch (error) {
      return res.status(500).json({ status: 500, error: `${error.name}, ${error.message}` });
    }
  },

  async deleteSpecificMail(req, res) {
    const user = req.decodedToken;
    const text = 'SELECT * FROM messagesTable WHERE id=$1 AND (receiverEmail=$2 OR senderEmail=$2)';
    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({ status: 400, error: 'Please ensure the messageId is an integer' });
    }
    try {
      const values = [req.params.id, user.email];
      const { rows } = await db.query(text, values);
      if (!rows) {
        return res.status(404).json({ status: 404, error: `You do not have a mail with id=${req.params.id}` });
      }
      if ((rows[0].receiveremail === user.email || null) && (rows[0].receiverstatus === 'deleted')) {
        return res.status(404).json({ status: 404, error: `You do not have a mail with id=${req.params.id}` });
      }
      if ((rows[0].senderemail === user.email) && (rows[0].senderstatus === 'deleted')) {
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
      return res.status(500).json({ status: 500, error });
    }
  },

  async unreadReceivedMails(req, res) {
    const user = req.decodedToken;
    const text = 'SELECT * FROM messagesTable WHERE receiverEmail=$1 AND status=$2 ORDER BY id DESC';
    const values = [user.email, 'inbox'];
    try {
      const { rows } = await db.query(text, values);
      if (!rows[0] || rows[0].receiverstatus === 'deleted') {
        return res.status(404).json({ status: 404, error: 'Not Found, You do not have any unread emails at the moment' });
      }
      return res.status(200).json({ status: 200, data: rows });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },

  async allReceivedMails(req, res) {
    const user = req.decodedToken;
    const text = `SELECT * FROM messagesTable 
      WHERE receiverEmail=$1 AND receiverstatus IS NULL ORDER BY id DESC`;
    const values = [user.email];
    try {
      const { rows } = await db.query(text, values);
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: 'Not Found, You do not have any emails in your inbox at the moment' });
      }
      return res.status(200).json({ status: 200, data: rows });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },

  async getDraftMessages(req, res) {
    const user = req.decodedToken;
    const values = [user.email, 'draft'];
    const text = 'SELECT * FROM messagesTable WHERE senderEmail=$1 AND status=$2 ORDER BY id DESC';
    try {
      const { rows: draftMessages } = await db.query(text, values);
      if (!draftMessages[0]) {
        return res.status(404).json({ status: 404, error: 'Not Found: You do not have any draft messages at the moment' });
      }
      const dbResponse = [];
      for (const obj of draftMessages) {
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          if (key === 'senderstatus' && value !== 'deleted') {
            dbResponse.push(obj);
          }
        });
      }
      return res.status(200).json({ status: 200, data: dbResponse });
    } catch (err) {
      return res.status(500).json({ status: 500, error: err });
    }
  },

  async allSentMails(req, res) {
    const user = req.decodedToken;
    const values = [user.email, 'draft'];
    const text = 'SELECT * FROM messagesTable WHERE senderEmail=$1 AND status<>$2 ORDER BY id DESC';
    try {
      const { rows } = await db.query(text, values);
      if (!rows) {
        return res.status(404).json({ status: 404, error: 'Not Found, You do not have any sent emails at the moment' });
      }
      const dbResponse = [];
      for (const obj of rows) {
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          if (key === 'senderstatus' && value !== 'deleted') {
            dbResponse.push(obj);
          }
        });
      }
      if (dbResponse.length < 1) {
        return res.status(404).json({ status: 404, error: 'Not Found, You do not have any sent emails at the moment' });
      }
      return res.status(200).json({ status: 200, data: dbResponse });
    } catch (error) {
      return res.status(400).json({ status: 400, error });
    }
  },

  async retractMessage(req, res) {
    const user = req.decodedToken;
    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({ status: 400, error: 'Please ensure the messageId is an integer' });
    }
    const searchText = 'SELECT * FROM messagesTable WHERE senderemail=$1 AND id=$2';
    const value = [user.email, req.params.id];
    const text = 'DELETE FROM messagesTable WHERE senderemail=$1 AND id=$2';
    try {
      const { rows: messageExist } = await db.query(searchText, value);
      if (!messageExist[0]) {
        return res.status(404).json({ status: 404, error: `You do not have a mail with id=${req.params.id}` });
      }
      await db.query(text, value);
      return res.status(200).json({ status: 200, data: 'Message deleted', message: 'Message retracted succesfully' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: `${err.name} ${err.message}` });
    }
  },

  async updateDraftMessage(req, res) {
    const user = req.decodedToken;
    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({ status: 400, error: 'Please ensure the messageId is an integer' });
    }
    const { receiveremail, message, subject } = req.value.body;
    const searchText = 'SELECT * FROM messagesTable WHERE id=$1 AND senderEmail=$2';
    const searchValue = [req.params.id, user.email];
    const searchReceiverText = 'SELECT * FROM usersTable WHERE email=$1';
    const searchReceiverValue = [receiveremail];
    try {
      // if user updated receiver
      if (receiveremail) {
        const { rows: receiverExists } = await db.query(searchReceiverText, searchReceiverValue);
        if (!receiverExists[0]) {
          return res.status(404).json({ status: 404, error: 'Receiver Not Found: Please ensure the receiverEmail is registered to epic mail' });
        }
      }
      const { rows: searchRow } = await db.query(searchText, searchValue);
      if (!searchRow[0] || searchRow[0].status !== 'draft') {
        return res.status(404).json({ status: 404, error: 'Not Found, you do not have a draft with this id' });
      }
      const updateText = `UPDATE messagesTable 
      SET message=$1, receiveremail=$2, subject=$3 WHERE id=$4 AND senderemail=$5 returning *`;
      const updateValue = [message, receiveremail, subject, req.params.id, user.email];
      const { rows: readMail } = await db.query(updateText, updateValue);
      return res.status(200).json({ status: 200, data: readMail, message: 'Draft Updated' });

    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },
};


export default Mail;
