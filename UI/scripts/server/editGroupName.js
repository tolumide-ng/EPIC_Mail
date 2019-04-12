const editGroupFunction = (group) => {
    return group.addEventListener('click', e => {
        const groupContainer = e.target.closest('.theGroup');
        const groupId = Array.from(groupContainer.children).find(elem => elem.classList.contains('theGroupId')).innerHTML;
        modalGroup.classList.remove('visibility');
        indicateServerResponse.innerHTML = '';
        indicateServerResponse.innerHTML = `
            <div class='theEditContainer'>
                <div class='editGroupNameContainer'>
                    <label for='inputEditName'> <strong>Group's New Name: </strong></label>
                    <input type='text' class='inputEditName' placeholder='e.g Group Name'>
                </div>
                <div class='editGroupNameButtonContainer'>
                    <button class='editNameButton'>Edit</button>
                    <button class='cancelEdit'>Cancel</button>
                </div>
            </div>`
        const cancelAction = document.querySelector('.cancelEdit');
        cancelAction.addEventListener('click', hideModal);
        const editAction = document.querySelector('.editNameButton');
        editAction.addEventListener('click', async e => {
            const name = document.querySelector('.inputEditName').value;
            const nameDetails = { name }
            const response = await serverPostResponse('PATCH', `${groupsUrl}/${groupId}/name`, nameDetails);
            if (response.status === 200) {
                indicateServerResponse.innerHTML = '';
                indicateServerResponse.innerHTML = response.message;
                return document.location.href = 'https://tolumide-ng.github.io/EPIC_Mail/UI/create.html';
            }
            indicateServerResponse.innerHTML = '';
            indicateServerResponse.innerHTML = response.error;
            window.addEventListener('click', e => {
                hideModal();
                return document.location.href = 'https://tolumide-ng.github.io/EPIC_Mail/UI/create.html';
            });
            setTimeout(() => {
                hideModal();
                return document.location.href = 'https://tolumide-ng.github.io/EPIC_Mail/UI/create.html';
            }, 5000);
        })
        return;
    })
}