const draftMessagesDisplay = async () => {
    function displayBlank(value) {
        if (!value) {
            return '';
        }
        return value;
    }
    const draftMessagesContainer = displayContainer.querySelector('.draftMessagesContainer');
    let response = await requestResponse('GET', `${messagesUrl}/draft`);
    // console.log(response);
    if (response.status === 404) {
        draftMessagesContainer.innerHTML = '';
        draftMessagesContainer.innerHTML += `
        <div class='responseError>${response.error}</div>`;
        return;
    }
    
    draftMessagesContainer.innerHTML = '';
    response.forEach((content) => {
        const nd = new Date(content.createdon);
        draftMessagesContainer.innerHTML += `
        <div class='draftMessage'>
            <div class='address'>${displayBlank(content.receiveremail)}</div>
            <div class='mailTitle'>${displayBlank(content.subject)}</div>
            <div class='id visibility'>${displayBlank(content.id)}</div>
            <div class='sentTime'>${nd.getHours()}:${nd.getMinutes()}</div>
            <div class='sentDate'>${nd.getDate()}/${nd.getMonth()}/${nd.getFullYear()}</div>
            <div class='parent visibility'>${content.parentmessageid}</div>
            <div class='messageContent visibility'>${displayBlank(content.message)}</div>
        </div>`
    });
    displayContainer.addEventListener('click', viewDraft);
}



const viewDraft = e => {
    const draftMessagesContainer = displayContainer.querySelector('.draftMessagesContainer');
    function confirmBlank(content) {
        if (!content.innerHTML) {
            return '';
        }
        return content.innerHTML
    }

    if (!e.target.closest('.draftMessage')) {
        return;
    }
    const theDraft = e.target.closest('.draftMessage')
    draftMessagesContainer.innerHTML = '';
    // console.log(e.target.closest('.draftMessage'));
    displayContainer.innerHTML = `
    <div class='displayDraftMessagesContainer'>
        <div class='draftAddressContainer draftDivContainer'> <strong>To: </strong>
            <input class ='addressDraft' value='${confirmBlank(theDraft.children[0])}'>
        </div>
        <div class='draftMailTitleContainer draftDivContainer'> <strong> Subject: </strong>
            <input class='mailTitleDraft' value='${confirmBlank(theDraft.children[1])}'>
        </div>
        <div class='draftIdContainer draftDivContainer visibility'>
            <input class='idDraft visibility' value='${confirmBlank(theDraft.children[2])}'>
        </div>
        <div class='draftDateContainer draftDivContainer'> <strong>Draft Created: </strong>
            <p class='dateDraft'> ${confirmBlank(theDraft.children[3])}<strong>Hrs</strong>  --  ${confirmBlank(theDraft.children[4])}</p> 
        </div>
        <div class='messageDraftContainer draftDivContainer'> <strong> Message: </strong>
            <textarea class='messageDraft' cols='20' rows='10'>${confirmBlank(theDraft.children[6])}</textarea>
        </div>
        <div class='draftDivContainer draftIndication'></div>
        <div class='buttonDraftContainer draftDivContainer'>
            <button class='updateDraft'>update</button>
            <button class='deleteDraft'>delete</button>
            <button class='sendDraft'>send</button>
        </div>
    </div>`
    const deleteDraftButton = document.querySelector('.deleteDraft');
    const updateDraftButton = document.querySelector('.updateDraft');
    const sendDraftButton = document.querySelector('.sendDraft');

    const alertDraft = async (message, theResponse) => {
        const draftIndication = document.querySelector('.draftIndication');
        draftIndication.innerHTML = '';
        draftIndication.innerHTML = `<p>${theResponse[message]}</p>`;
        setTimeout(() => {
            draftIndication.innerHTML = '';
        }, 5000);
    }

    deleteDraftButton.addEventListener('click', async e => {
        const contentId = document.querySelector('.draftIdContainer');
        const theId = Number(contentId.children[0].value);
        await requestResponse('DELETE', `${messagesUrl}/${theId}`);
        // return;

        displayContainer.innerHTML = '';
        displayContainer.innerHTML = `<div>Draft Deleted</div>`
    });

    sendDraftButton.addEventListener('click', async e => {
        const receiveremail = document.querySelector('.addressDraft').value;
        const subject = document.querySelector('.mailTitleDraft').value;
        const message = document.querySelector('.messageDraft').value;
        const contentId = document.querySelector('.draftIdContainer');
        const id = Number(contentId.children[0].value);
        const draftDetails = { receiveremail, subject, message};

        let response = await fetch(`${messagesUrl}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(draftDetails)
        });
        let theResponseCont
        ent = await response.json();
        if (response.ok) {
            const contentId = document.querySelector('.draftIdContainer');
            const theId = Number(contentId.children[0].value);
            alertDraft('message', theResponseContent);
            await requestResponse('DELETE', `${messagesUrl}/${theId}`);
            return;
        }
        alertDraft('error', theResponseContent)
        return;
    });

    updateDraftButton.addEventListener('click', async e => {
        const receiveremail = document.querySelector('.addressDraft').value;
        const subject = document.querySelector('.mailTitleDraft').value;
        const message = document.querySelector('.messageDraft').value;
        const contentId = document.querySelector('.draftIdContainer');
        const id = Number(contentId.children[0].value);
        const draftDetails = { receiveremail, subject, message};

        let response = await fetch(`${messagesUrl}/draft/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(draftDetails)
        });
        let responseContent = await response.json();
        if (response.ok) {
            alertDraft('message', responseContent);
            return;
        }
        alertDraft('error', responseContent);
        return;
    })
}

