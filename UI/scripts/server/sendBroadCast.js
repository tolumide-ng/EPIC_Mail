const sendBroadcastFunction = async (group) => {
    return group.addEventListener('click', async e => {
        const groupContainer = e.target.closest('.theGroup');
        const groupId = Array.from(groupContainer.children).find(elem => elem.classList.contains('theGroupId')).innerHTML;
        const sendMessageTo = groupContainer.querySelector('.theGroupName').querySelector('strong').innerHTML;
        modalGroup.classList.remove('visibility');
        indicateServerResponse.innerHTML = '';
        indicateServerResponse.innerHTML = `
            <div class='sendBroadCastContainer'>
                <div class='headerContainer'>
                    <strong>To: </strong> ${sendMessageTo}
                </div>
                <div class='messageToSend'>
                    <div class='subjectContainer'>
                        <label class='subjectLabel'><strong>Subject: </strong></label>
                        <input type='text' class='subjectMessage'>
                    </div>
                    <div class='messageContainer'>
                        <label class='messageLabel'><strong>Message: </strong> </label>
                        <textarea rows='10' columns='50' class='theBroadCastMessage'></textarea>
                    </div>
                </div>
                <div class='sendBroadCastButtonContainer'>
                    <button class='sendBroadcast'>Send</button>
                    <button class='cancelBroadcast'>Cancel</button>
                </div>
            </div>`;
        const cancelBroadcast = document.querySelector('.cancelBroadcast');
        const sendBroadCast = document.querySelector('.sendBroadcast');
        cancelBroadcast.addEventListener('click', async e => {
            hideModal();
            document.location.href = 'http://127.0.0.1:5500/UI/create.html';
        });
        sendBroadCast.addEventListener('click', async e => {
            const subject = document.querySelector('.subjectMessage').value;
            const message = document.querySelector('.theBroadCastMessage').value;
            const broadcastMessage = { subject, message };

            const response = await serverPostResponse('POST', `${groupsUrl}/${groupId}/messages/`, broadcastMessage);
            if (response.status === 201) {
                indicateServerResponse.innerHTML = '';
                indicateServerResponse.innerHTML = response.message;
                window.addEventListener('click', hideModal);
                setTimeout(() => {
                    hideModal();
                }, 3000);
                return document.location.href = 'http://127.0.0.1:5500/UI/create.html';
            }
            indicateServerResponse.innerHTML = '';
            indicateServerResponse.innerHTML = response.error;
            window.addEventListener('click', e => {
                hideModal();
                return document.location.href = 'http://127.0.0.1:5500/UI/create.html';
            });
        })
    });
}