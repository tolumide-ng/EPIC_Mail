
const listOfUsers = document.querySelector('#list');
const addUser = document.querySelector('#add_user');

// ONLY EMAIL ADDRESS CAN BE ADDED AS USERS
function checkValidity(input) {
    const regexCheck = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ig;
    const validInput = regexCheck.test(input);
    if (!validInput || input.length < 1) {
        throw err;
    }
    return validInput;
}

// function to check that the user is not already on the list
function checkNameAlreadyExist(name) {
    const emailAddresses = [];
    const eachUser = document.querySelectorAll('.each_user');
    eachUser.forEach(theUser => emailAddresses.push(theUser.innerHTML));
    const foundEmailAddress = emailAddresses.find(email => email === name);

    if (foundEmailAddress) {
        throw err;
    }
    return;
}


// EVENT LISTENER TO ADD NAME
addUser.addEventListener('click', e => {
    // Content of the input element
    const newUser = document.querySelector('#add_new_user').value;

    checkValidity(newUser);

    checkNameAlreadyExist(newUser);
    // Create flex_container
    const flex_container = document.createElement('div');
    flex_container.classList.add('list_flex_container');

    // Create List
    const list = document.createElement('li');
    list.classList.add('each_user');
    list.innerHTML = newUser;

    //Create Button
    const button = document.createElement('button');
    button.classList.add('remove_name');
    button.innerHTML = 'Remove'

    // Append list and button to flex_container
    flex_container.prepend(list);
    flex_container.append(button);

    // append flex_container to the list of users
    listOfUsers.prepend(flex_container);
});


// EVENT LISTENER TO REMOVE NAME

listOfUsers.addEventListener('click', e => {
    if (e.target.classList.contains('remove_name')) {
        e.target.closest('.list_flex_container').remove();
    }
    return;
});












// Check if the name is a registered user
function checkEmailIsRegistered(name) {
    const emailAddresses = [];
    const eachUser = document.querySelectorAll('.each_user');
    eachUser.forEach(theUser => emailAddresses.push(theUser.innerHTML));
    const foundEmailAddress = emailAddresses.find(email => email === name);

    if (!foundEmailAddress) {
        information.innerHTML += 'Please register the userName first';
        throw err;
    }
    return;
}

// Create the group
function createTheGroup(group, name) {
    // Create the new group container 
    const groupContainer = document.createElement('div');
    groupContainer.classList.add('groupContainer');

    // Creat the Group name
    const groupName = document.createElement('p');
    groupName.classList.add('groupnameAndUsername');
    groupName.innerText = group;

    //create the select element
    const createSelectTag = document.createElement('select');
    createSelectTag.classList.add('userNameContainer');
    const selectId = group.match(/\w/g).join('').toLowerCase();
    createSelectTag.setAttribute('id', selectId);

    // Create the option and its content
    const createOption = new Option(name, name);
    createOption.classList.add('userNameInformation');
    createSelectTag.append(createOption);

    // Append the all to the groupContainer
    groupContainer.prepend(groupName);
    groupContainer.append(createSelectTag);


    // listContainer declared here to get full information about registered groups
    const listContainer = document.querySelector('.groupsAndUsersList');

    // Now attach to frontEnd body
    listContainer.prepend(groupContainer);

}


const nameOfTheGroup = document.querySelector('#groupNameInput');
const nameOfTheUser = document.querySelector('#groupUserNameInput');
const submitGroupAndName = document.querySelector('#submitGroupAndName');
const information = document.querySelector('#information');
const userNameInformation = document.querySelectorAll('.userNameInformation');

submitGroupAndName.addEventListener('click', e => {
    groupAndNameCheck(nameOfTheGroup.value, nameOfTheUser.value);
})


function groupAndNameCheck(group, name) {
    //Remove previous error message
    information.innerHTML = '';

    // Has the user input anything ?
    if (group.length === 0 || name.length === 0) {
        information.innerText += 'Username or groupname cannot be empty';
        return;
    }
    // Check the title of all the groupNames everytime this function is called
    const groupNameInformation = document.querySelectorAll('.groupnameAndUsername');
    // Check if the groupName has been registered
    const allGroupNames = [];
    console.log(allGroupNames);
    console.log(groupNameInformation);
    groupNameInformation.forEach(theGroup => allGroupNames.push(theGroup.textContent));
    const foundGroup = allGroupNames.find(theGroup => theGroup === group);
    if (foundGroup) {
        console.log('group exists');
        // Confirm if the user has been registered
        checkEmailIsRegistered(name);

        // does the user already exist in this group?
        console.log('WE ARE HERE NOW');
        //constant declared here to get an updated version of the variable;
        const userNameContainer = document.querySelector('.userNameContainer');
        const userExistInThisGroup = Array.from(userNameContainer.options).find(option => option.value === name);
        if (userExistInThisGroup) {
            console.log('THE USER ALREADY EXISTS HERE')
            information.innerHTML = 'This user already exists in the group';
            return;
        }
        let findTheSelect;
        // Get the group div to properly add the new option/name

        // Find the tag with this id attribute
        const idAttribute = foundGroup.match(/\w/g).join('').toLowerCase();
        // console.log(idAttribute);
        findTheSelect = document.querySelector(`#${idAttribute}`);

        // Add the user to the group 
        const newOption = new Option(name, name);
        newOption.classList.add('userNameInformation');
        findTheSelect.append(newOption);
        return;
    } else {
        //Create the group!
        createTheGroup(group, name);
        return;

    }


    // const validInputIntegers = input.match(/\d/g);
    // // all usernames already added to the group
    // const allUserNames = [];
    // userNameInformation.forEach(theUser => allUserNames.push(theUser.innerText));
    // console.log(allUserNames);
    // const userExistInGroup = allUserNames.find(theUser => theUser === name);
}

