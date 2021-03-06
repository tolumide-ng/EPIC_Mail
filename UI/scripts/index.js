// FORM SUBMISSION FOR TOKEN STARTS HERE
const passwordContainer = document.querySelector('.passwordAlertContainer');
const inputValidation = document.querySelector('.inputValidation');
const passwordValidation = document.querySelector('.passwordValidation');
const passwordMatch = document.querySelector('.passwordAlert');
const signUpSelector = document.querySelector('.signUp');
const indication = document.querySelector('#indication');

const userName = document.querySelector('#userName');
const password = document.querySelector('#password');
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const confirmPassword = document.querySelector('#confirmPassword');
const secondaryEmail = document.querySelector('#secondaryEmail');



userName.addEventListener('input', event => {
    const regexCheck = /^([a-zA-Z0-9]+)$/ig;
    if (!inputValidation.classList.contains('invincible') && regexCheck.test(userName.value)) {
        inputValidation.classList.add('invincible');
        return;
    }
});
password.addEventListener('input', event => {
    if (!passwordValidation.classList.contains('invincible')) {
        passwordValidation.classList.add('invincible');
        return;
    }
    if(!passwordMatch.classList.contains('invincible') && (password.value === confirmPassword.value)) {
        passwordMatch.classList.add('invincible');
        return;
    }
    return;
})

confirmPassword.addEventListener('input', event => {
    if(!passwordMatch.classList.contains('invincible') && (password.value === confirmPassword.value)) {
        passwordMatch.classList.add('invincible');
        return;
    }
    return;
})

// Event on submit
signUpSelector.addEventListener('click', async (e) => {
    const regexCheck = /^([a-zA-Z0-9]+)$/ig;

    const validateUserName = regexCheck.test(userName.value);

    if (userName.value && !validateUserName) {
        inputValidation.classList.remove('invincible');
        return;
    }
    if (password.value.length <= 5) {
        passwordValidation.classList.remove('invincible');
        return;
    }
    if (password.value !== confirmPassword.value) {
        passwordMatch.classList.remove('invincible');
        return;
    }
    const epicUserName = `${userName.value}@epicmail.com`
    const newUser = {
        firstName: firstName.value, lastName: lastName.value, password: password.value,
        email: epicUserName, secondaryEmail: secondaryEmail.value,
    };
    // console.log(newUser);
    let response = await fetch('https://epicmail-ng.herokuapp.com/api/v2/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(newUser)
    });
    if (response.ok) {
        const bodyGuy= await response.json();
        console.log(bodyGuy.data[0].token);
        localStorage.setItem('token', bodyGuy.data[0].token);
        localStorage.setItem('firstname', bodyGuy.data[0].firstname);
        localStorage.setItem('lastname', bodyGuy.data[0].lastname);
        localStorage.setItem('email', bodyGuy.data[0].email);
        localStorage.setItem('id', bodyGuy.data[0].id);
        document.location.href = 'https://tolumide-ng.github.io/EPIC_Mail/UI/mails.html';
        return;
    }
    const errorBody = await response.json();
    console.log(errorBody);
    indication.innerHTML = errorBody.error;
    setTimeout(() => {
        indication.innerHTML ='';
    }, 5000);

});