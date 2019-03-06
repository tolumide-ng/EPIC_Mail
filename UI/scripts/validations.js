// >>> SIGN UP PAGE 
const formText = document.querySelectorAll('.form_text');
const signUp = document.querySelector('.sign_up');
const indication = document.querySelector('#indication');


// Email validity
function checkValidity(input) {
    const regexCheck = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ig;
    const validInput = regexCheck.test(input);
    if (validInput) {
        location.href = './mails.html';
        console.log(validInput);
        return;
    }
    indication.innerHTML = 'Please enter a valid email address';
    return ;
}

signUp.addEventListener('click', e => {
    const emptyValue = Array.from(formText).find(formInput => formInput.value.length < 1);
    if (emptyValue) {
        indication.innerHTML = `${emptyValue.id} cannot be blank`
        return false;
    }
    const userName = document.querySelector('#userName').value;
    checkValidity(userName)
});
