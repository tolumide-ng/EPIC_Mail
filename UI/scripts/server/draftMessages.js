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
    // console.log(displayBlank(e.target.closest('.address')))
    const deleteDraftButton = document.querySelector('.deleteDraft');
    const updateDraftButton = document.querySelector('.updateDraft');
    const sendDraftButton = document.querySelector('.sendDraft');

    const alertDraft = async (message, theResponse) => {
        const draftIndication = document.querySelector('.draftIndication');
        draftIndication.innerHTML = '';
        console.log(theResponse[message])
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
        console.log('here now');
        console.log(response);
        let theResponseCont
        ent = await response.json();
        console.log('before we start')
        console.log(theResponseContent);
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
        console.log(draftDetails);

        let response = await fetch(`${messagesUrl}/draft/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(draftDetails)
        });
        console.log(response);
        let responseContent = await response.json();
        if (response.ok) {
            alertDraft('message', responseContent);
            return;
        }
        alertDraft('error', responseContent);
        return;
    })
}

