chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    console.log(details);
    details.requestHeaders.push({
        name: 'SAVEIT',
        value: 'SAVEHD.net'
    });
    return { requestHeaders: details.requestHeaders };
}, {
    urls: ["*://savehd.net/*"]
}, ['requestHeaders', 'blocking']);