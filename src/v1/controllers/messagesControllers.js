import messagesModels from './../models/messagesModels';

const Messages = {
    createMessage(req, res) {
        const request = req.body;
        const sendMessage = messagesModels.sendMail(request);
        return res.status(201).json({ status: 201, data: [sendMessage]});
    }
}

export default Messages;
