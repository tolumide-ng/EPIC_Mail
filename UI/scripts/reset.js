const resetButton = document.querySelector('#resetButton');
const indication = document.querySelector('#indication');
const signupButton = document.querySelector('#signupButton');

// function checkValidity(input) {
//     const regexCheck = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ig;
//     const validInput = regexCheck.test(input);
//     if (validInput) {
//         indication.innerHTML = '';
//         return location.href = './signin.html';
//         // console.log(validInput);
//     }
//     indication.innerHTML = 'Please enter a valid email address';
//     return ;
// }

// resetButton.addEventListener('click', e => {
//     const email = document.querySelector('#email').value;
//     checkValidity(email);
// });

// signupButton.addEventListener('click', e => {
//     return location.href = './index.html'
// })


const resetPasswordFunction = async () => {
    const email = document.querySelector('.email').value;
    const resetDetails = { email };
    console.log(resetDetails);
    const fetchResponse = await fetch('http://localhost:3000/api/v2/auth/reset', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(resetDetails)
    });
    const response = await fetchResponse.json();
    console.log(response);
}


resetButton.addEventListener('click', resetPasswordFunction);
