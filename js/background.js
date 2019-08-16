chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  if(changeInfo.url !== undefined && changeInfo.url.includes('clips.twitch.tv/create')) {
    chrome.tabs.executeScript(null, {
      file: '/js/inject_returnHTML.js'
    });

    chrome.tabs.insertCSS(tab.id, {
      file: "/css/styles.css"
    });
  }

});
