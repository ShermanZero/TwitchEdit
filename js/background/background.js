/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

//listen for updates to tabs
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  //if the url is not undefined and includes clips.twitch.tv/create
  if(changeInfo.url !== undefined && changeInfo.url.includes('clips.twitch.tv/create')) {
    //inject the submitHTML javascript
    chrome.tabs.executeScript(null, {
      file: '/js/content/publish/inject_publishHTML.js'
    });

    //insert the CSS
    chrome.tabs.insertCSS(tab.id, {
      file: "/css/publish/publishButtonStyles.css"
    });
  }
});


chrome.runtime.onMessage.addListener (
  function(request, sender, sendResponse) {
    //if we receive the command to closeTab
    if(request.cmd == "closeTab") {
      //queries the active tabs
      chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
          //close the only tab returned in the array
          chrome.tabs.remove(tabs[0].id);

          //log that we receieved the message
          console.log("{TwitchEdit-BG} recieved message to close tab");
      });
    }

    return true;
  });
