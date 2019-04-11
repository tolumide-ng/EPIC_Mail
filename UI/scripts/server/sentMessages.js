const sentMessagesDisplay = async () => {
    function displayBlank(value) {
        if (!value) {
            return '';
        }
        return value;
    }
    let response = await requestResponse('GET', `${messagesUrl}/sent`);
        // The obtained response is an array, now lets loop through it
        const sentMessagesContainer = document.querySelector('.sentMessagesContainer');
        if (response.status === 404) {
            sentMessagesContainer.innerHTML = '';
            sentMessagesContainer.innerHTML += `
            <div> ${response.error} </div>`;
            return;
        }
        response.forEach(message => {
            // console.log(message);
            const nd = new Date(message.createdon);
            sentMessagesContainer.innerHTML += `
            <div class='sentMessage'>
                <div class='address'>${displayBlank(message.receiveremail)}</div>
                <div class='mailTitle'>${displayBlank(message.subject)}</div>
                <div class='id visibility'>${message.id}</div>
                <div class='sentTime'>${nd.getHours()}:${nd.getMinutes()}</div>
                <div class='sentDate'>${nd.getDate()}/${nd.getMonth()}/${nd.getFullYear()}</div>
                <div class='parent visibility'>${message.parentmessageid}</div>
                <div class='messageContent visibility'>${displayBlank(message.message)}</div>
            </div>`
        });

        // const sentMessage = displayContainer.querySelectorAll('.sentMessage');
        sentMessagesContainer.addEventListener('click', e => {
            if (e.target.closest('.sentMessage')) {
                e.target.closest('.sentMessage').style.backgroundColor = 'blue';

                setTimeout(() => {
                    e.target.closest('.sentMessage').style.backgroundColor = '';
                }, 0);

                displayContainer.innerHTML = '';
                // ID of the selected target
                // displayContainer.append(e.target.closest('.sentMessage').childrenElement);
                // e.target.closest('.sentMessage').lastElementChild.classList.toggle('visibility');

                displayContainer.innerHTML = `
                <div class='displaySentMessagesContainer'>
        <div class='spaceContent'><strong> To: </strong> ${(e.target.closest('.sentMessage').children[0].textContent)} </div>

        <div class='spaceContent'> <strong> Subject: </strong> ${e.target.closest('.sentMessage').children[1].textContent} </div>
        <div class='displaySentTime spaceContent'>
            <div class='displaySentHrs'><strong> Time: </strong> ${e.target.closest('.sentMessage').children[3].textContent} Hrs</div>
            <div class=''><strong> Date: </strong> ${e.target.closest('.sentMessage').children[4].textContent} </div>
        </div>
        <div class='spaceContent'> <strong> Message: </strong> <div class='theMessageDisplayed'> ${(e.target.closest('.sentMessage').lastElementChild.textContent)} </div> </div>
        <div class='spaceContent contentId visibility'> id: <strong id='contentId'> ${(e.target.closest('.sentMessage').children[2].textContent)} </strong></div>
        <div class='buttonContainer'>
        <button class='retract'>Retract message</button>
        <button class='deleteSentMessage'>Delete message</button>
        </div>
        <div class='sentMessageFeedbackContainer></div class='sentMessageFeedback'></div></div>
        </div>
        `;
                // console.log((e.target.closest('.sentMessage').children));
                const retract = document.querySelector('.retract');
                const deleteSentMessage = document.querySelector('.deleteSentMessage');
                retract.addEventListener('click', retractMessage);
                deleteSentMessage.addEventListener('click', deleteThisSentMessage);
            }
            return;
        });
}


const requestResponse = async (type, url) => {
    const fetchReponse = await fetch(url, {
        method: type,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `bearer ${localStorage.getItem('token')}`
        }
    });
    const responseContent = await fetchReponse.json();
    // console.log(responseContent)
    if (fetchReponse.ok) {
        return responseContent.data;
    }
    return responseContent;
}

const retractMessage = async () => {
    const contentId = document.querySelector('.contentId');
    const theId = Number(contentId.children[0].innerHTML);
    await requestResponse('DELETE', `${messagesUrl}/retract/${theId}`);
}

const deleteThisSentMessage = async () => {
    const contentId = document.querySelector('.contentId');
    const theId = Number(contentId.children[0].innerHTML);
    await requestResponse('DELETE', `${messagesUrl}/${theId}`);
}