const deletGroupFunction = (element) => {
    return element.addEventListener('click', async e => {
        const groupContainer = e.target.closest('.theGroup');
        const groupId = Array.from(groupContainer.children).find(elem => elem.classList.contains('theGroupId')).innerHTML;
        console.log(groupId);
        modalGroup.classList.remove('visibility');
        indicateServerResponse.innerHTML = '';
        indicateServerResponse.innerHTML = `
        <div class='confirmRequest'>
        <p>Are you sure you want to delete this group? </p>
        <div class='confirmButtonContainer'>
            <button class='yesDelete'>Yes</button>
            <button class='noDelete'>No</button>
        </div>
        </div>`;
        const affirmDelete = document.querySelector('.yesDelete');
        const retractDelete = document.querySelector('.noDelete');
        affirmDelete.addEventListener('click', async e => {
            const response = await requestServer('DELETE', `${groupsUrl}/${groupId}`);

            const theResponse = await response.json();
            console.log(theResponse);
            if (theResponse.status === 200) {
                console.log(indicateServerResponse);
                indicateServerResponse.innerHTML = '';
                indicateServerResponse.innerHTML = theResponse.data;
                modalGroup.classList.remove('visibility');
                window.addEventListener('click', hideModal);
                document.location.href = 'http://127.0.0.1:5500/UI/create.html';
                return;
            }
            indicateServerResponse.innerHTML = '';
            indicateServerResponse.innerHTML = theResponse.error;
            setTimeout(() => {
                modalGroup.classList.remove('visibility');
                document.location.href = 'http://127.0.0.1:5500/UI/create.html';

            }, 5000);
            window.addEventListener('click', e => {
                hideModal();
                document.location.href = 'http://127.0.0.1:5500/UI/create.html';
            });
            return;
        });

        retractDelete.addEventListener('click', async e => {
            modalGroup.classList.add('visibility');
        });
        return;
    });
}