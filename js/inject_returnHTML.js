/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

var copyright = "<!-- TwitchEdit COPYRIGHT (C) 2019 KIERAN SHERMAN | twitch.tv/shermanzero -->";
var injectionPoint, returnButtonHTML = {contents: ""};

//mutation observer watching for added nodes
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function (mutation) {
    //if nodes were added, start iterating through them
    if(mutation.addedNodes.length > 0) {
      for(var i = 0; i < mutation.addedNodes.length; i++) {
        //initialize the node variable
        var node = mutation.addedNodes[i];

        //log that the MutationObserver has noticed the added node (DEV)
        console.log('{TwitchEdit-DEV-clips} DOM added node:', node);
      }
    }
  })
});

injectionPoint = document.getElementsByClassName("tw-align-items-center tw-flex tw-justify-content-between tw-pd-t-1")[0].children[1];

//adds a return button to the editting page
function modifyReturn() {
  //starting the injection
  console.log('{TwitchEdit} beginning HTML injection');

  //insert the submit button before the other submit button
  insertionPoint.insertBefore('beforestart', returnButtonHTML.contents);

  //successfully injected!
  console.log('{TwitchEdit} !!- HTML injection COMPLETED | You can now click on the edit icon to go to the clip editor -!!');
}

//root node to watch changes in, make sure to pay attention to the childlist and subtree
const root = document.getElementById('root');
console.log('{TwitchEdit-clips} found root node, observing for changes', root);
observer.observe(root, {
  childList: true,
  subtree: true
});

//loads a file into a variable under .contents
function loadFile(fileSource, variable) {
  var url = chrome.runtime.getURL(fileSource);
  fetch(url).then(function(response) {
    response.text().then(function(text) {
      variable.contents = (copyright + text + copyright);
    })
  });
}

loadFile('/html/returnButton.html', returnButtonHTML);
modifyReturn();
