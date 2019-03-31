const menuList = document.querySelector('#menuList');
const displayContainer = document.querySelector('#displayContainer');
function inboxMessagesDisplay() {
    const inboxMessageContainer = displayContainer.querySelector('.inboxMessagesContainer');
    const inboxMessage = displayContainer.querySelectorAll('.inboxMessage');
    inboxMessageContainer.addEventListener('click', e => {
        console.log(inboxMessage);
        const theinboxMessage = e.target.closest('.inboxMessage');
        if (theinboxMessage) {
            theinboxMessage.style.backgroundColor = 'blue';
            setTimeout(() => {
                theinboxMessage.style.backgroundColor = '';
            }, 0);
            displayContainer.innerHTML = '';
            theinboxMessage.lastElementChild.classList.toggle('visibility');

            displayContainer.innerHTML = `
        <div class='spaceContent'><strong> To: </strong> ${theinboxMessage.children[0].textContent} </div>

        <div class='spaceContent'> <strong> Subject: </strong> ${theinboxMessage.children[1].textContent} </div>

        <div class='spaceContent'> <strong> Message: </strong> <div class='theMessageDisplayed'> ${theinboxMessage.lastElementChild.textContent} </div> </div>
        `;
            console.log(theinboxMessage.children);
        }
    });
}

// Email inbox appears first when the Mail menu is clicked, so the action buttons should respond
inboxMessagesDisplay();


// Toggle the feature in view to the clicked menu content when any of the page specific menu is clicked
menuList.addEventListener('click', e => {
    if (e.target.closest('.menuListContent')) {
        const selectedContent = e.target.closest('.menuListContent').getAttribute('id');
        console.log(selectedContent);
        displayContainer.innerHTML = '';
        const selectedDisplay = document.querySelector(`.${selectedContent}`);
        const clonedSelectedDisplay = selectedDisplay.cloneNode(true);
        console.log(clonedSelectedDisplay);
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
        const draftMessageContainer = displayContainer.querySelector('.draftMessagesContainer');
        const draftMessage = displayContainer.querySelectorAll('.draftMessage');
        draftMessageContainer.addEventListener('click', e => {
            console.log('welcome to drafts');
            const theDraftMessage = e.target.closest('.draftMessage');
            if (theDraftMessage) {
                theDraftMessage.style.backgroundColor = 'blue';

                setTimeout(() => {
                    theDraftMessage.style.backgroundColor = '';
                }, 0);
            }

            displayContainer.innerHTML = '';
            theDraftMessage.lastElementChild.classList.toggle('visibility');
            displayContainer.innerHTML = `
        <div class='spaceContent'><strong> To: </strong> ${theDraftMessage.children[0].textContent} </div>

        <div class='spaceContent'> <strong> Subject: </strong> ${theDraftMessage.children[1].textContent} </div>

        <div class='spaceContent'> <strong> Message: </strong> <div class='theMessageDisplayed'> ${theDraftMessage.lastElementChild.textContent} </div> </div>

        <div class='buttonContainer'>
        <button class='buttonsOfDraft'>send</button> <button class='buttonsOfDraft'>Delete</button>
        </div>
        `;
            console.log(theDraftMessage.children);
        });

    } else if (selectedContent === 'sent') {
        // SENT MAIL
        const sentMessageContainer = displayContainer.querySelector('.sentMessagesContainer');
        const sentMessage = displayContainer.querySelectorAll('.sentMessage');
        sentMessageContainer.addEventListener('click', e => {
            console.log('welcome to sent mails');
            if (e.target.closest('.sentMessage')) {
                e.target.closest('.sentMessage').style.backgroundColor = 'blue';

                setTimeout(() => {
                    e.target.closest('.sentMessage').style.backgroundColor = '';
                }, 0);

                displayContainer.innerHTML = '';
                // ID of the selected target
                // displayContainer.append(e.target.closest('.sentMessage').childrenElement);
                e.target.closest('.sentMessage').lastElementChild.classList.toggle('visibility');

                displayContainer.innerHTML = `
        <div class='spaceContent'><strong> To: </strong> ${(e.target.closest('.sentMessage').children[0].textContent)} </div>

        <div class='spaceContent'> <strong> Subject: </strong> ${e.target.closest('.sentMessage').children[1].textContent} </div>

        <div class='spaceContent'> <strong> Message: </strong> <div class='theMessageDisplayed'> ${(e.target.closest('.sentMessage').lastElementChild.textContent)} </div> </div>
        
        <div class='buttonContainer'>
        <button class='retract'>Retract message</button>
        </div>
        `;
                console.log((e.target.closest('.sentMessage').children));
            }
            return;
        });

    } else if (selectedContent === 'compose') {
        const composeMail = document.querySelector('.compose');
        const sender = document.querySelector('#sender');
        sender.innerHTML += localStorage.getItem('email');
        displayContainer.querySelector('#draftButton').addEventListener('click', sendMessageContainer(`${messagesUrl}/messages/draft`));
        
        displayContainer.querySelector('#sendButton').addEventListener('click', sendMessageContainer(`${messagesUrl}/messages`));
    }

    return;


});

