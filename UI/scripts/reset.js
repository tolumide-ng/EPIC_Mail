const resetButton = document.querySelector('#resetButton');
const indication = document.querySelector('#indication');
const signupButton = document.querySelector('#signupButton');
const modalContainer = document.querySelector('.modalContainer');
const modalContent = document.querySelector('.modalContent');

const hideModal = () => {
    if(!modalContainer.classList.contains('visibility')) {
        return modalContainer.classList.add('visibility');
    }
    return;
}

const resetPasswordFunction = async () => {
    const email = document.querySelector('.email').value;
    const resetDetails = { email };
    const fetchResponse = await fetch('https://epicmail-ng.herokuapp.com/api/v2/auth/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(resetDetails)
    });
    const response = await fetchResponse.json();
    if (response.status === 200) {
        modalContainer.classList.remove('visibility');
        modalContent.innerHTML = '';
        modalContent.innerHTML = response.data;
        setTimeout(() => {
            return window.addEventListener('click', hideModal)
        }, 3000);
        return;
    }
    modalContainer.classList.remove('visibility');
    modalContent.innerHTML = '';
    modalContent.innerHTML = response.error;
    setTimeout(() => {
        return window.addEventListener('click', hideModal)
    }, 3000);
    return;
};

const signupPageFunction = async () => {
    return document.location.href = 'https://tolumide-ng.github.io/EPIC_Mail/UI/index.html';
}


resetButton.addEventListener('click', resetPasswordFunction);
signupButton.addEventListener('click', signupPageFunction)