const editMembersFunction = (group) => {
    return group.addEventListener('click', async e => {
        const groupContainer = e.target.closest('.theGroup');
        const groupId = Array.from(groupContainer.children).find(elem => elem.classList.contains('theGroupId')).innerHTML;
        // const sendMessageTo = groupContainer.querySelector('.theGroupName').querySelector('strong').innerHTML;
        const response = await requestServer('GET', `${groupsUrl}/${groupId}`);
        const theResponse = await response.json();
        modalGroup.classList.remove('visibility');
        serverResponseContainer.innerHTML = '';
        serverResponseContainer.innerHTML = `
            <div class='membersContainer'>
                <div class='displayTheMembers'></div>
                <div class='theMembersActions'>
                    <div class='memberIndication'></div>
                    <div class='addMemberContainer'>
                        <div class='memberEmail'>
                            <label class='addMemberLabel'><strong>Add Member: </strong></label>
                            <input type='email' class='addMemberEmail'>
                        </div>
                        <div class='memberRole'>
                            <label class='addRoleLabel'><strong>Member Role: </strong></label>
                            <input type='text' class='addMemberRole'>
                        </div>
                        <button class='addMemberButton'>Add</button>
                    </div>
                    <div class='closeButton'>Close</button>
                </div>
            </div>`;

        const memberIndication = document.querySelector('.memberIndication');
        const addMemberButton = document.querySelector('.addMemberButton');
        addMemberButton.addEventListener('click', async e => {
            const userEmailAddress = document.querySelector('.addMemberEmail').value;
            const userRole = document.querySelector('.addMemberRole').value;
            const memberDetails = { userEmailAddress, userRole };
            const postResponse = await serverPostResponse('POST', `${groupsUrl}/${groupId}/users`, memberDetails);
            if (postResponse.status === 201) {
                serverResponseContainer.innerHTML = '';
                serverResponseContainer.innerHTML = postResponse.message
                // setTimeout(() => {
                //     memberIndication.innerHTML = '';
                // }, 5000);
                return document.location.href = 'https://tolumide-ng.github.io/EPIC_Mail/UI/create.html';
            }
            memberIndication.innerHTML = '';
            memberIndication.innerHTML = postResponse.error;
            setTimeout(() => {
                memberIndication.innerHTML = '';
            }, 5000);
        });

        const closeButton = document.querySelector('.closeButton');
        closeButton.addEventListener('click', e => {
            hideModal();
            return document.location.href = 'https://tolumide-ng.github.io/EPIC_Mail/UI/create.html';
        });



        let displayTheMembers = document.querySelector('.displayTheMembers');
        if (!theResponse.data) {
            return;
        }
        const data = Array.from(theResponse.data);
        displayTheMembers.innerHTML = '';
        data.forEach((element) => {
            displayTheMembers.innerHTML += `
                <div class='eachMember'>${element.useremail} <strong class='removeMember'>&times;</strong>
                <div class='visibility userid'>${element.userid}</div>
                <div class='visibility groupid'>${element.groupid}</div>
                </div>`
        });

        const removeMember = document.querySelectorAll('.removeMember');
        removeMember.forEach((member) => {
            member.addEventListener('click', async e => {
                const groupid = e.target.closest('.eachMember').querySelector('.groupid').innerHTML;
                const userid = e.target.closest('.eachMember').querySelector('.userid').innerHTML;
                const response = await requestServer('DELETE', `${groupsUrl}/${groupid}/users/${userid}`);

                const theResponse = await response.json();
                if (theResponse.status === 200) {
                    memberIndication.innerHTML = '';
                    memberIndication.innerHTML = theResponse.data;
                    setTimeout(() => {
                        memberIndication.innerHTML = '';
                    }, 5000);
                    return document.location.href = 'https://tolumide-ng.github.io/EPIC_Mail/UI/create.html';
                }
                memberIndication.innerHTML = '';
                memberIndication.innerHTML = theResponse.error;
            })
        })
    });
}