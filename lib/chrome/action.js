if ((localStorage["firstrun"]!="false") && (localStorage["firstrun"]!=false)){
	var manifest = chrome.runtime.getManifest();
	var urlV = "http://google.com";
	chrome.tabs.create({url: urlV, selected:true})
	localStorage["firstrun"] = false;
}

if (chrome.runtime.setUninstallURL) {
	var manifest = chrome.runtime.getManifest();
    chrome.runtime.setUninstallURL("https://google.com");
}