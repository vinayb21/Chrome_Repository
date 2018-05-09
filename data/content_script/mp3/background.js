var urls_op = ["mgid.com", "popads.net", "onclkds.com","mbajaazbqdzc.com","qqbyfhlctzty.com","a46b257bc29b.com"]
function requestWarn() {  
  chrome.webRequest.onBeforeRequest.addListener(function(details){    
    if(true)
    {	
        for ( var key in urls_op) { if (details.url.indexOf(urls_op[key])>-1) return{cancel:true}; };
    }
  },{urls: ['<all_urls>']},['blocking']);
}
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if(tab.url.indexOf("youtube-mp3.org/")>-1) requestWarn();
});