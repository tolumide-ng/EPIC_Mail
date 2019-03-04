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
            receiverEmail: data.receiverEmail,
            parentMessageId: data.parentMessageId,
            status: data.status
        }
        this.messages.push(newMessage);
        return newMessage;
    }

    allSentMails() {
        const allMessages = this.messages;
        return allMessages.filter(message => message.status == 'sent');
    }

    unreadMails(){
        const allMessages = this.messages;
        return allMessages.filter(message => message.status != 'read');
    }

    receivedMails() {
        const allMessages = this.messages;
        return allMessages.filter(message => message.status == 'sent' || 'read');
    }

    specificMail(messageId) {
        const allMessages = this.messages;
        return allMessages.find(message => message.id === messageId);
    }
}

export default new Messages ();
