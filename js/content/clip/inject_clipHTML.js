/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

console.log('{TwitchEdit-Clip} Content script loaded and started');

var iconSize = 16;
var copyright = "<!-- TwitchEdit COPYRIGHT (C) 2019 KIERAN SHERMAN | twitch.tv/shermanzero -->";
var sizeReplace = "{size}";

var insertionPoint, clipButtonHTML = {contents: ""};

//mutation observer watching for added nodes
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function (mutation) {
    //if nodes were added, start iterating through them
    if(mutation.addedNodes.length > 0) {
      for(var i = 0; i < mutation.addedNodes.length; i++) {
        //initialize the node variable
        var node = mutation.addedNodes[i];

        //log that the MutationObserver has noticed the added node (DEV)
        //console.log('{TwitchEdit-DEV} DOM added node:', node);

        //if the node is null or does not match our parameters
        if(node == null || node.nodeName != "DIV" || node.nodeType != 1 ) {
          continue;
        } else
        //if the node has my class, ignore it
        if(node.hasAttribute('class') && node.getAttribute('class').includes('twitchedit')) {
          continue;
        } else
        //if all other tests pass, but if the node is not exactly what we are looking for, continue
        if(!(node.getAttribute('id') == 'default-player')) {
          continue;
        }

        //log that the MutationObserver has noticed the added node
        console.log('{TwitchEdit-Clip} DOM added node:', node);

        //if the clips container has been loaded in
        if(node.hasChildNodes()) {
          console.log('{TwitchEdit-Clip} ^found match^');

          //marks the insertion point
          insertionPoint = node.getElementsByClassName('player-buttons-right')[0].children[0].children[0];
          console.log("{TwitchEdit-Clip} marked insertion point:", insertionPoint);

          //modify the viewer and finish (no need to keep iterating through other additions)
          modifyViewer();
          break;

        } else {
          //if the node did not match our parameters
          console.log('{TwitchEdit-Clip} ^did not match^')
        }
      }
    }
  })
});

//modify the clips to display new data
function modifyViewer() {
  console.log('{TwitchEdit-Clip} beginning HTML injection');

  //set the width and height of the icon
  console.log('{TwitchEdit-Clip} --setting icon size');
  clipButtonHTML.contents = clipButtonHTML.contents.replace(sizeReplace, iconSize);
  clipButtonHTML.contents = clipButtonHTML.contents.replace(sizeReplace, iconSize);

  //inject the HTML after the insertion point
  console.log('{TwitchEdit-Clip} --injecting HTML');
  insertionPoint.insertAdjacentHTML('afterend', clipButtonHTML.contents);

  //display the injection in the console
  console.log('{TwitchEdit-Clip} injected: ', editRoot.getElementsByClassName('twitchedit-clip')[0]);

  //add an svg to the button (svg imported)
  var img = document.getElementById('twitchedit-clip-button').appendChild(document.createElement('img'));
  img.src = chrome.runtime.getURL('/icons/clip/svg/clip_128.svg');
  console.log('{TwitchEdit-Clip} modified button to include image', img);

  //successfully injected!
  console.log('{TwitchEdit-Clip} !!- HTML injection COMPLETED | You can now click on the edit icon to go to the clip editor -!!');
}

//root node to watch changes in, make sure to pay attention to the childlist and subtrees
var editRoot = document.getElementById('root');
console.log('{TwitchEdit-Clip} found root node, observing for changes', editRoot)

//observe the childList and subtrees
observer.observe(editRoot, {
  childList: true,
  subtree: true
});

//loads a file into a variable under .contents
function loadFile(fileSource, element) {
  var url = chrome.runtime.getURL(fileSource);
  fetch(url).then(function(response) {
    response.text().then(function(text) {
      //set the contents and append copyright to before and after
      element.contents = (copyright + text + copyright);

      //log the file was loaded
      console.log('{TwitchEdit-Clip} found and loaded HTML: ', element.contents);
    })
  });
}

//load the clipButton.html
loadFile('/html/clip/clipButton.html', clipButtonHTML);
