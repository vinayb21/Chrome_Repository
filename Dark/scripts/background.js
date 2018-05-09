chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action == 'openPopUp') {
        chrome.windows.create({
            url: request.url,
            width: 640,
            height: 370,
            top: 500,
            left: 500,
            type: 'popup',
            focused: true,
            state: 'docked'
        }, function (win) {
            setTimeout(function() {
                chrome.tabs.executeScript(win.tabs[0].id, {
                    code: 'YouTubeToPopUp_pp_click.setVideoWatcher("'+ request.videoId +'")',
                    runAt: 'document_end'
                },
                function(results){

                });
            }, 1000);
        });
    }
});

chrome.manifest = (function() {
    var manifestObject = false;
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            manifestObject = JSON.parse(xhr.responseText);
        }
    };
    xhr.open("GET", chrome.extension.getURL('manifest.json'), false);

    try {
        xhr.send();
    } catch(e) {
        console.log('Couldn\'t load manifest.json');
    }

    return manifestObject;
})();

// We would like to see all the video's right, and not this message: http://prntscr.com/dms41v
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    var youtubeHeaders = details.requestHeaders, blockingResponse = {};

    if(details.url.indexOf("youtube.com/embed/") > -1) {
        youtubeHeaders.push({name: 'Referer', value: 'https://www.youtube.com/watch?v='});
    }

    blockingResponse.requestHeaders = youtubeHeaders;
    return blockingResponse;
}, {urls: ["<all_urls>"]}, ['requestHeaders', 'blocking']);

function install_notice() {
    chrome.storage.sync.get({
        installed_yet: false,
        last_version: 0,
        firstLoad: false
	}, function(items) {

        if(items.last_version < chrome.manifest.version) {
            chrome.storage.sync.set({
    			last_version: chrome.manifest.version
    		});
        }

        if(items.installed_yet == false) {
            chrome.storage.sync.set({
                installed_yet: true,
                last_version: chrome.manifest.version,
                firstLoad: true
            });
            return;
        }
    });
}
install_notice();
