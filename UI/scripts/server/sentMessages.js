const requestResponse = async (type, url) => {
    const fetchReponse = await fetch(url, {
        method: type,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `bearer ${localStorage.getItem('token')}`
        }
    });
    const responseContent = await fetchReponse.json();
    if (fetchReponse.ok) {
        return responseContent.data;
    }
    return;
}

const retractMessage = async () => {
    const contentId = document.querySelector('.contentId');
    const theId = Number(contentId.children[0].innerHTML);
    await requestResponse('DELETE', `${messagesUrl}/retract/${theId}`);
    // return to the sentMail page
    const sentMessagesDisplay = document.querySelector('#sent');
    const event = new Event('click');
    sentMessagesDisplay.dispatchEvent(event);
}