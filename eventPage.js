var url="";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if( request.todo == "showPageAction") {
        chrome.tabs.query( {active: true, currentWindow: true}, function(tabs){
        chrome.pageAction.show(tabs[0].id);
        url = tabs[0].url;
        console.log(url);

        })
    }
})

