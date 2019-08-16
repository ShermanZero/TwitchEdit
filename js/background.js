/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

//listen for updates to tabs
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  //if the url is not undefined and includes clips.twitch.tv/create
  if(changeInfo.url !== undefined && changeInfo.url.includes('clips.twitch.tv/create')) {
    //inject the returnHTML javascript
    chrome.tabs.executeScript(null, {
      file: '/js/inject_returnHTML.js'
    });

    //insert the CSS
    chrome.tabs.insertCSS(tab.id, {
      file: "/css/styles.css"
    });
  }

});
