const populateViewWithGroup = async (id) => {
        displayGroupContainer.innerHTML = '';
        const groupInformation = {};
        const response = await requestServer('GET', `${groupsUrl}/`);

        const theResponse = await response.json();
        if (theResponse.status === 200) {
                const data = Array.from(theResponse.data);
                console.log(data);
                // Use the group id to choose which group to display
                groupInformation.theGroup = data.find(content => content.id === Number(id));
                console.log(groupInformation.theGroup);
                if (!groupInformation.theGroup) {
                        return 'this group does not exist'
                }
                //     return;
        }

        // Use destructuring to take the content of the groupInformation data
        const { theGroup } = groupInformation;

        const nd = (theDate) => {
                const date = new Date(theDate);
                return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        }

        displayGroupContainer.innerHTML = `
    <div class="specificGroup">
            <div class="specificGroupInformation">
                <div class='specificGroupName'><strong>Group Name: </strong> ${theGroup.name}</div>
                <div class='specificGroupRole'><strong>Group Role: </strong>${theGroup.role}</div>
                <div class='specificGroupCreatedBy'><strong>Created By: </strong>${theGroup.createdby}</div>
                <div class='specificGroupCreatedOn'><strong>Created On: </strong>${nd(theGroup.createdon)}</div>
            </div>

            <div class="specificGroupRandom">
                <div class='specificGroupButtons'>
                        <div class='specificEditContainer'>
                                <div class='editText'><strong>Edit the Group Name</strong></div>
                                <input type='text' class='specificNewName'>
                                <div class='editIndication'></div>
                                <input type='submit' class='specificNewNameButton button' value='Edit Name'>
                        </div>
                        <div class='deleteButtonContainer'>
                        <button class='deleteGroupButton button'>Delete Group</button>
                        </div>
                </div>
                <div class='specificNewMember'>
                        <div class='newMemberIndication'><strong>Add New Member</strong></div>
                        <div class='specificNewEmailContainer'>
                            <label for='specificNewEmail' class='specificNewEmailLabel'><strong>User Email</strong>
                            <input type='email' class='specificNewEmail'>
                        </div>
                            <label for='specificNewRole' class=specificNewRoleLabel'><strong>Role:</strong> 
                            <div class='specificNewRoleContainer'>
                        <input type='text' class='specificNewRole'>
                        </div>
                        <input type='submit' class='specificNewMemberButton button' value='Add'>
                </div>
            </div>
            <div class="specificGroupMembers"></div>
            <div class="specificGroupMessage">
                <form onsubmit="event.preventDefault()" class='specificComposeMessage'>
                        <div class='specificGroupRecipients'><strong>To: </strong> ${theGroup.name} </div>
                        <div class='specificGroupSubject'><strong>Subject: </strong>
                                <input type='text' class='specificSubject' placeholder='subject of the broadcase message'>
                        </div>
                        <div class='textareaContainer'>
                        <strong>Message: </strong>
                        <input type='text' class='specificMessage'>
                        <button class='specificSendButton button'>Send</button>

                        </div>
                </form>
            </div>
    </div>`;

    const editNameButton = document.querySelector('.specificNewNameButton');
    const newName = document.querySelector('.specificNewName').value;
    editNameButton.addEventListener('click', console.log('welcom here'));
}