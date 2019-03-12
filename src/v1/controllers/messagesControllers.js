import passport from 'passport';
import messagesModels from '../models/messagesModels';
import passportConf from '../passport';


class Messages {
  // Method to create a new message
  createMessage(req, res) {
    passport.authenticate('jwt', { session: false }, (err, userExist) => {
      if (err) { return res.status(400).json({ status: 400, error: 'receiverEmail or reciverId cannot be empty' }); }
      if (!userExist) {
        return res.status(401).json({ status: 401, error: 'Authentication Error: Email or password does not match' });
      }
      const request = req.value.body;
      if (request.status !== 'draft' && !request.receiverId) {
        return res.status(400).json({ status: 400, error: 'reciverId cannot be empty' });
      }
      request.senderEmail = userExist.email;
      const sendMessage = messagesModels.sendMail(request);
      return res.status(201).json({ status: 201, data: [sendMessage] });
    })(req, res);
  }

  // Method to find all sent messages
  findSentMessage(req, res) {
    const allSentMessages = messagesModels.allSentMails();
    if (allSentMessages.length < 1) {
      return res.status(404).json({ status: 404, error: 'There are no sent messages at the moment' });
    }
    return res.status(200).json({ status: 200, data: [allSentMessages] });
  }

  // Method to find all Unread messages
  findUnreadMessages(req, res) {
    const allUnreadMessages = messagesModels.unreadMails();
    if (allUnreadMessages < 1) {
      return res.status(404).json({ status: 404, error: 'There are no unread messages at the moment' });
    }
    return res.status(200).json({ status: 200, data: [allUnreadMessages] });
  }

  // Method to find all received messages
  findReceivedMails(req, res) {
    const allReceievedMessages = messagesModels.receivedMails();
    if (allReceievedMessages.length < 1) {
      return res.status(404).json({ status: 404, error: 'There are no received messages at the moment' });
    }
    return res.status(200).json({ status: 200, data: [allReceievedMessages] });
  }

  // Method to find a specific message by its id
  findSpecificMail(req, res) {
    const specificMessage = messagesModels.specificMail(req.params.id);
    if (!specificMessage) {
      return res.status(404).json({ status: 404, error: 'There is no message with this messageId' });
    }
    return res.status(200).json({ status: 200, data: [specificMessage] });
  }

  // Method to delete a specific mail by its id
  deleteSpecificMail(req, res) {
    const specificMail = messagesModels.specificMail(req.params.id);
    if (!specificMail) {
      return res.status(404).json({ status: 404, error: 'Failed Delete, specified message does not exist' });
    }
    messagesModels.deleteMail(req.params.id);
    /* response here should be 204, but since,
    specification requires a res.body, I would be using 200 */
    return res.status(200).json({ status: 200, data: 'Message deleted' });
  }
}

export default new Messages();
