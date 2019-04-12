const groupsUrl = 'https://epicmail-ng.herokuapp.com/api/v2/groups';

const groupFlexContainer = document.querySelector('.groupFlexContainer');
const displayGroupContainer = document.querySelector('.displayGroupContainer');
// const specificGroup = document.querySelector('.specificGroup');
const modalGroup = document.querySelector('.modalGroup');
const groupName = document.querySelector('.groupName');
const indicateServerResponse = document.querySelector('.indicateServerResponse');
const serverResponseContainer = document.querySelector('.serverResponseContainer');

const requestServer = async (type, url) => {
    const theResponse = await fetch(url, {
        method: type,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `bearer ${localStorage.getItem('token')}`
        }
    });
    return theResponse;
}

const populateView = async () => {
    const response = await requestServer('GET', `${groupsUrl}/`);

    function reduceLength(element) {
        if (!element) {
            return element;
        }
        if (element.length > 35) {
            return element.substring(0, 35) + '...'
        }
        return element;
    }

    function reduceEmail(element) {
        if (!element) {
            return element;
        }
        if (element.length > 15) {
            return element.substring(0, 15) + '...'
        }
        return element;
    }

    const jsonResponse = await response.json();
    if (jsonResponse.status === 200) {
        groupFlexContainer.innerHTML = '';
        const data = jsonResponse.data;
        data.forEach((content) => {
            groupFlexContainer.innerHTML += `
            <div class='theGroup'>
                <div class='theGroupDetails'>
                    <p class='theGroupName'><strong>${reduceLength(content.name)}</strong></p>
                </div>
                <p class='theGroupRole'><em>${reduceLength(content.role)}</em></p>
                <p class='theGroupId visibility'>${content.id}</p>
                <div class='actionButtons'>
                    <button class='deleteGroup'>Delete</button>
                    <button class='editGroupName'>Edit Name</button>
                    <button class='sendMessage'>Send Broadcast</button>
                    <button class='members'>Members</button>
                </div>
                <p class='theGroupCreator'><strong>Created By: </strong>${reduceEmail(content.createdby)}</div>
            </div>`
        });

        const theGroup = Array.from(document.querySelectorAll('.theGroup'));
        const deleteGroup = Array.from(document.querySelectorAll('.deleteGroup'));
        const sendMessage = Array.from(document.querySelectorAll('.sendMessage'));
        const editName = Array.from(document.querySelectorAll('.editGroupName'));
        const members = Array.from(document.querySelectorAll('.members'));

        members.forEach((group) => editMembersFunction(group));

        editName.forEach((group) => editGroupFunction(group));
        deleteGroup.forEach((element) => { deletGroupFunction(element) });
        sendMessage.forEach((group) => sendBroadcastFunction(group));


        return;
    }
    return;
};

populateView();

const serverPostResponse = async (type, url, requestBody) => {
    const response = await fetch(url, {
        method: type,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
    });
    const jsonResponse = await response.json();
    return jsonResponse;
}



const createGroupFunction = async (e) => {
    const name = document.querySelector('#groupName').value;
    const role = document.querySelector('#groupRole').value;

    const createGroupDetails = { name, role };
    const createGroupResponse = await serverPostResponse('POST', `${groupsUrl}/`, createGroupDetails);
    indication.innerHTML = '';
    if (createGroupResponse.status === 201) {
        indication.innerHTML += `<p class='indicationText'>${createGroupResponse.message}</p>`
        setTimeout(() => {
            indication.innerHTML = '';
        }, 5000);
        populateView();
        return;
    }
    indication.innerHTML += `<p class='indicationText'>${createGroupResponse.error}</p>`

    setTimeout(() => {
        indication.innerHTML = '';
    }, 5000);
    return;
}

const createButton = document.querySelector('.createGroupButton');
createButton.addEventListener('click', createGroupFunction);
const indication = document.querySelector('.indication');


const hideModal = () => {
    if (!modalGroup.classList.contains('.visibility')) {
        modalGroup.classList.add('visibility');
    }
    return;
}


