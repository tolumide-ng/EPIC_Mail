// >>> LOGIN PAGE

const loginButton = document.querySelector('#submit_button');

function checkValidity(input) {
    const regexCheck = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ig;
    const validInput = regexCheck.test(input);
    if (validInput) {
        indication.innerHTML = '';
        location.href = './mails.html';
        console.log(validInput);
        return;
    }
    indication.innerHTML = 'Please enter a valid email address';
    return ;
}


loginButton.addEventListener('click', e => {
    console.log('button clciked')
    const userName = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    console.log(userName, password)
    if(userName.length < 1 || password.length < 1) {
        indication.innerHTML = `username or password cannot be empty`;
        return;
    }
    checkValidity(userName);
});
