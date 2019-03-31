const messagesUrl = 'http://localhost:3000/api/v2';

const messageResponse = async (message, responseContent) => {
    const popupMessage = document.querySelector('#popupMessage');
    popupMessage.innerHTML = '';
    popupMessage.insertAdjacentHTML('afterbegin', `<p>${responseContent[message]}</p>`);
    setTimeout(() => {
        popupMessage.innerHTML = '';
    }, 5000);
}

// When the SEND button is clicked, save as draft/send the message
const sendMessageContainer = (url) => {
    // Because event functions cannot take in extra parameters
    return sendMessage = async (e) => {
        let theMail = {};
        const receiverEmail = document.querySelector('#recipient').value;
        const subject = document.querySelector('#subject').value;
        const message = document.querySelector('#composedMessage').value;
        if (!receiverEmail) {
            theMail = { subject, message }
        } else if (receiverEmail) {
            theMail = { receiverEmail, subject, message };
        }
    
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(theMail)
        });
    
        let responseContent = await response.json();
        if (response.ok) {
            messageResponse('message', responseContent);
            // Clear all inputs after a successful post
            const contents = ['recipient', 'subject', 'composedMessage'];
            contents.forEach((content) => {
                document.querySelector(`#${content}`).value = '';
            })
            return;
        }
        messageResponse('error', responseContent);
        return;
    }
}





// const saveMessageAsDraft = async (e) => {
//     let theMail = {};
//     const receiverEmail = document.querySelector('#recipient').value, subject = document.querySelector('#subject').value, 
//     message = document.querySelector('#composedMessage').value;
//     if (!receiverEmail) {
//         theMail = { subject, message }
//     } else if (receiverEmail) {
//         theMail = { receiverEmail, subject, message };
//     }
//     let response = await fetch(`${messagesUrl}/messages/draft`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8',
//             'Authorization': `bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(theMail)
//     });

//     const popupMessage = document.querySelector('#popupMessage');
//     popupMessage.innerHTML='';
//     popupMessage.insertAdjacentHTML('afterbegin', '<p>Draft Saved</p>');
//     setTimeout(() => {
//         popupMessage.innerHTML = '';
//     }, 5000);
//     return;
// }