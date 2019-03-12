const resetButton = document.querySelector('#submit_button');

function checkValidity(input) {
    const regexCheck = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ig;
    const validInput = regexCheck.test(input);
    if (validInput) {
        indication.innerHTML = '';
        return location.href = './signin.html';
        // console.log(validInput);
    }
    indication.innerHTML = 'Please enter a valid email address';
    return ;
}

resetButton.addEventListener('click', e => {
    const userName = document.querySelector('#username').value;
    checkValidity(userName);
});