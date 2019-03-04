import uuid from 'uuid';

class Messages {
    constructor() {
        this.messages = [];
    }

    sendMail(data) {
        const newMessage = {
            id: uuid.v4(),
            createdOn: new Date(),
            subject: data.subject,
            message: data.message,
            senderId: data.senderId,
            receiverId: data.receiverId,
            senderEmail: data.senderEmail,
            receiverEmail: data.reciverEmail,
            parentMessageId: data.parentMessageId,
            status: data.status
        }
        this.messages.push(newMessage);
        return newMessage;
    }
}

export default new Messages ();
