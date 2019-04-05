const groupsUrl = 'http://localhost:3000/api/v2/groups';

const groupFlexContainer = document.querySelector('.groupFlexContainer');

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
                    <p class='theGroupName'><strong>${content.name}</strong></p>
                </div>
                <p class='theGroupRole'><em>${reduceLength(content.role)}</em></p>
                <p class='theGroupId visibility'>${content.id}</p>
                <p class='theGroupCreator'><strong>Created By: </strong>${reduceEmail(content.createdby)}</div>
            </div>`
        });

        const theGroup = Array.from(document.querySelectorAll('.theGroup'));
        theGroup.forEach((element) => {
            element.addEventListener('click', async (e) => {
                const children = Array.from(element.children);
                const theId = children.find(elem => elem.classList.contains('theGroupId'));
                console.log(`${groupsUrl}/${theId.innerHTML}`)
                const theResponse = await requestServer('GET', `${groupsUrl}/${theId.innerHTML}`);
                const theJsonResponse = await theResponse.json();
                console.log(theJsonResponse.data.length);
            });
        });
        return;
    }
    return;
};

populateView();



const serverResponse = async (type, url, requestBody) => {
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
    const createGroupResponse = await serverResponse('POST', `${groupsUrl}/`, createGroupDetails);
    console.log(createGroupResponse);
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
