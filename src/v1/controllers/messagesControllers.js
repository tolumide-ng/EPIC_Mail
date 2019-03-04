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
    }




    // createMessage(req, res) {
    //     const request = req.value.body;
    //     const sendMessage = messagesModels.sendMail(request);
    //     return res.status(201).json({ status: 201, data: [sendMessage]});
    // }
}

export default Messages;
