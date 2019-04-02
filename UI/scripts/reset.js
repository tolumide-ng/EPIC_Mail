const resetButton = document.querySelector('#resetButton');
const indication = document.querySelector('#indication');
const signupButton = document.querySelector('#signupButton');

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
    const email = document.querySelector('#email').value;
    checkValidity(email);
});

signupButton.addEventListener('click', e => {
    return location.href = './index.html'
})