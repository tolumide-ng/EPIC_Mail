const requestResponse = async (type, url) => {
    const fetchReponse = await fetch(url, {
        method: type,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `bearer ${localStorage.getItem('token')}`
        }
    });
    const responseContent = await fetchReponse.json();
    // console.log(responseContent)
    if (fetchReponse.ok) {
        return responseContent.data;
    }
    return responseContent;
}

const retractMessage = async () => {
    const contentId = document.querySelector('.contentId');
    const theId = Number(contentId.children[0].innerHTML);
    await requestResponse('DELETE', `${messagesUrl}/retract/${theId}`);
}

const deleteThisSentMessage = async () => {
    const contentId = document.querySelector('.contentId');
    const theId = Number(contentId.children[0].innerHTML);
    await requestResponse('DELETE', `${messagesUrl}/${theId}`);
}