const messagesUrl = 'https://epicmail-ng.herokuapp.com/api/v2/messages';

const menuList = document.querySelector('#menuList');
const displayContainer = document.querySelector('#displayContainer');


// Email inbox appears first when the Mail menu is clicked, so the action buttons should respond
inboxMessagesDisplay();


// Toggle the feature in view to the clicked menu content when any of the page specific menu is clicked
menuList.addEventListener('click', e => {
    if (e.target.closest('.menuListContent')) {
        const selectedContent = e.target.closest('.menuListContent').getAttribute('id');
        // console.log(selectedContent);
        displayContainer.innerHTML = '';
        const selectedDisplay = document.querySelector(`.${selectedContent}`);
        const clonedSelectedDisplay = selectedDisplay.cloneNode(true);
        // console.log(clonedSelectedDisplay);
        displayContainer.append(clonedSelectedDisplay);
        displayContainer.querySelector(`.${selectedContent}`).classList.toggle('visibility');
    }
    return;
})

// If the event Listeners for inbox/draft/sent/composeMail are left outsode the click event listener, 
// the variables would equal null since, the variables are declared in the context of displayContainer
// ...and if the variables are left outside with just document, then they would only work for the already
// invisible html elements


menuList.addEventListener('click', async e => {
    // if (e.target.closest('.menuListContent')) 
    const selectedContent = e.target.closest('.menuListContent').getAttribute('id');

    if (selectedContent === 'inbox') {
        inboxMessagesDisplay();
    } else if (selectedContent === 'draft') {
        // DRAFT MAIL
        draftMessagesDisplay();

    } else if (selectedContent === 'sent') {
        // SENT MAIL
        sentMessagesDisplay();

    } else if (selectedContent === 'compose') {
        // const composeMail = document.querySelector('.compose');
        const sender = document.querySelector('#sender');
        sender.innerHTML += localStorage.getItem('email');
        displayContainer.querySelector('#draftButton').addEventListener('click', sendMessageContainer(`${messagesUrl}/draft`));

        displayContainer.querySelector('#sendButton').addEventListener('click', sendMessageContainer(`${messagesUrl}/`));
    }

    return;


});

