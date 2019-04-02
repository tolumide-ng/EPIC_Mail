// >>> LOGIN PAGE

const loginButton = document.querySelector('#loginButton');
const indication = document.querySelector('#indication');
const resetPassword = document.querySelector('#resetButton');
const signupButton = document.querySelector('#signupButton');

const checkValidity = async (input, password) => {
    const regexCheck = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ig;
    const validInput = regexCheck.test(input);
    if (validInput) {
        const loginDetails = { email: input, password };
        indication.innerHTML = '';
        const fetchResponse = await fetch('http://localhost:3000/api/v2/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(loginDetails)
        });

        const serverResponse = await fetchResponse.json();
        if (fetchResponse.ok) {
            localStorage.setItem('token', serverResponse.data[0].token);
            localStorage.setItem('firstname', serverResponse.data[0].firstname);
            localStorage.setItem('lastname', serverResponse.data[0].lastname);
            localStorage.setItem('email', serverResponse.data[0].email);
            document.location.href = 'http://127.0.0.1:5500/UI/mails.html';
            return indication.innerHTML = 'success'
        }
        return indication.innerHTML = serverResponse.error;
    }
    indication.innerHTML = 'Please enter a valid email address';
    return;
}


loginButton.addEventListener('click', e => {
    const userName = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    if (userName.length < 1 || password.length < 1) {
        indication.innerHTML = `username or password cannot be empty`;
        return;
    }
    checkValidity(userName, password);
});

resetPassword.addEventListener('click', e => {
    document.location.href = 'http://127.0.0.1:5500/UI/reset.html';
})

signupButton.addEventListener('click', e => {
    document.location.href = 'http://127.0.0.1:5500/UI/index.html'
})

const email = document.querySelector('#email');
const password = document.querySelector('#password');
const emailLabel = document.querySelector('.emailLabel');
const passwordLabel = document.querySelector('.passwordLabel');

const controlVisibility = (content, label) => {
    return function (e) {
        if (label.classList.contains('visibility') && content.value.length > 1) {
            label.classList.remove('visibility');
            return;
        }
        if (!label.classList.contains('visibility') && content.value.length < 1) {
            label.classList.add('visibility');
            return;
        }
    }
}

email.addEventListener('blur', controlVisibility(email, emailLabel));
password.addEventListener('blur', controlVisibility(password, passwordLabel));


