function displayBlank(value) {
    if (!value) {
        return '';
    }
    return value;
}

const inboxMessagesDisplay = async () => {
    let inboxResponse = await requestResponse('GET', `${messagesUrl}/received`);
    const displayContainer = document.querySelector('#displayContainer');
    const inboxMessageContainer = displayContainer.querySelector('.inboxMessagesContainer');

    if (inboxResponse.status === 404) {
        inboxMessageContainer.innerHTML = '';
        inboxMessageContainer.innerHTML += `
        </div class='responseError'>${response.error}</div>`;
        return;
    }
    function whatStatus() {
        const contentStatus = inboxMessageContainer.querySelectorAll('.status');
        contentStatus.forEach((element) => {
            if (element.innerHTML === 'inbox' && !element.closest('.inboxMessage').classList.contains('unRead')) {
                // element.closest('.inboxMessage').classList.add('messageRead');
                // console.log(element.closest('inboxMessage'));
                element.closest('.inboxMessage').classList.add('unRead');
            }
        });
    }
    inboxMessageContainer.innerHTML = '';
    inboxResponse.forEach((content) => {
        const nd = new Date(content.createdon);
        inboxMessageContainer.innerHTML += `
        <div class='inboxMessage'>
            <div class='address'>${displayBlank(content.senderemail)}</div>
            <div class='mailTitle'>${displayBlank(content.subject)}</div>
            <div class='id visibility'>${displayBlank(content.id)}</div>
            <div class='messageContent visibility'>${displayBlank(content.message)}</div>
            <div class='sentTime'>${nd.getHours()}:${nd.getMinutes()}</div>
            <div class='sentDate'>${nd.getDate()}/${nd.getMonth()}/${nd.getFullYear()}</div>
            <div class='parentMessageId'>${displayBlank(content.parentmessageid)}</div>
            <div class='status visibility'>${content.status}</div>
        </div>`
    });
    whatStatus();

    displayContainer.addEventListener('click', viewInbox);
}

document.addEventListener('load', inboxMessagesDisplay);

const viewInbox = async (e) => {
    const inboxMessagesContainer = displayContainer.querySelector('.inboxMessagesContainer');

    if (!e.target.closest('.inboxMessage')) {
        return;
    }
    const theParent = e.target.closest('.inboxMessage');
    const theId = Number(theParent.querySelector('.id').innerHTML);

    const inboxMessage = await requestResponse('GET', `${messagesUrl}/${theId}`);
    const theInboxMessage = inboxMessage[0];
    function nd(date){
        return new Date(date.createdon);
    }

    inboxMessagesContainer.innerHTML= '';
    inboxMessagesContainer.innerHTML = `
    <div class='displayInboxMessageContainer'>
        <div class='inboxAddressContainer inboxContainer'><strong>From: </strong>
        ${displayBlank(theInboxMessage.senderemail)}</div>
        <div class='inboxMailTitleContainer inboxContainer'><strong>Subject:   </strong>
        ${displayBlank(theInboxMessage.subject)}</div>
        <div class='id visibility'>${displayBlank(theInboxMessage.id)}</div>
        <div class='inboxDateContainer inboxContainer'>
            <div class='inboxDate'> <strong> Date: </strong> ${nd(theInboxMessage).getDate()}/${nd(theInboxMessage).getMonth()}/${nd(theInboxMessage).getFullYear()}</div>
            <div class='inboxTime'> <strong> Time: </strong> ${nd(theInboxMessage).getHours()}:${nd(theInboxMessage).getMinutes()} <strong>Hrs</strong></div>
        </div>
        <div class='inboxReceivedMessage inboxContainer'> <strong>Message: </strong> <div class='theInboxReceivedMessage'> ${displayBlank(theInboxMessage.message)} </div> </div>
        <div class='inboxButtonContainer inboxContainer'>
            <button class='deleteInboxMessage'>Delete</button>
        </div>
    </div>`

const deleteButton = document.querySelector('.deleteInboxMessage');
deleteButton.addEventListener('click', deleteInboxFunction);
}


const deleteInboxFunction = async () => {
    const contentId = document.querySelector('.id').innerHTML;
    await requestResponse('DELETE', `${messagesUrl}/${contentId}`);
    displayContainer.innerHTML = `<div>Message Deleted</div>`

}