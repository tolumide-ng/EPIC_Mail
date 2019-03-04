import messagesModels from './../models/messagesModels';
import passport from 'passport';
import passportConf from './../passport';


const Messages = {
    createMessage(req, res) {
        passport.authenticate('jwt', { session: false }, function (err, userExist) {
            if (err) { return res.status(400).json({ status: 400, error: 'receiverEmail or reciverId cannot be empty' }) }
            if (!userExist) {
                return res.status(401).json({ status: 401, error: 'Authentication Error: Email or password does not match' });
            }
            const request = req.value.body;
            if (request.status != 'draft' && !request.receiverId || !request.receiverEmail) {
                return res.status(400).json({ status: 400, error: 'receiverEmail or reciverId cannot be empty' });
            }
            request.senderId = userExist.id;
            request.senderEmail = userExist.email;
            const sendMessage = messagesModels.sendMail(request);
            return res.status(201).json({ status: 201, data: [sendMessage] });
        })(req, res)
    },

    findSentMessage(req, res) {
        const allSentMessages = messagesModels.allSentMails();
        if (allSentMessages.length < 1) {
            return res.status(404).json({ status: 404, error: 'There are no sent messages at the moment' });
        }
        return res.status(200).json({ status: 200, data: [allSentMessages] });
    },

    findUnreadMessages(req, res) {
        const allUnreadMessages = messagesModels.unreadMails();
        if (allUnreadMessages < 1) {
            return res.status(404).json({ status: 404, error: 'There are no unread messages at the moment' })
        }
        return res.status(200).json({ status: 200, data: [allUnreadMessages] });
    },

    findReceivedMails(req, res) {
        const allReceievedMessages = messagesModels.receivedMails();
        if (allReceievedMessages.length < 1) {
            return res.status(404).json({ status: 404, error: 'There are no received messages at the moment' });
        }
        return res.status(200).json({ status: 200, data: [allReceievedMessages] });
    },

    findSpecificMail(req, res) {
        const specificMessage = messagesModels.specificMail(req.params.id);
        if (!specificMessage) {
            return res.status(404).json({ status: 404, error: 'There is no message with this messageId' });
        }
        return res.status(200).json({ status: 200, data: [specificMessage] })
    },

    deleteSpecificMail(req, res) {
        const specificMail = messagesModels.specificMail(req.params.id);
        if(!specificMail) {
            return res.status(404).json({ status: 404, error: 'Failed Delete, specified message does not exist'})
        }
        messagesModels.deleteMail(req.params.id);
        return res.status(204).json({data: 'Message deleted'})
    }
}

export default Messages;
