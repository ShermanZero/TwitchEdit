/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

console.log('{TwitchEdit-Delete} Content script loaded and started');

var iconSize = 16;
var copyright = "<!-- TwitchEdit COPYRIGHT (C) 2019 KIERAN SHERMAN | twitch.tv/shermanzero -->";

var linkReplace = "{link}";
var sizeReplace = "{size}";

var clipHeader, clipLink, insertionPoint, deleteButtonHTML = {contents: ""};

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
        if(node.hasAttribute('class') && node.getAttribute('class') == 'twitchedit') {
          continue;
        } else
        //if all other tests pass, but if the node is not exactly what we are looking for, continue
        if(!(node.childNodes.length > 0 && node.firstChild.hasAttribute('data-target') && node.firstChild.getAttribute('data-target') == 'clips-manager-table-row')) {
          continue;
        }

        //log that the MutationObserver has noticed the added node
        console.log('{TwitchEdit-Delete} DOM added node:', node);

        //if the clips container has been loaded in
        if(node.hasChildNodes() && node.firstChild.matches('.clmgr-table__row-expanded.tw-block.tw-c-background-base.tw-elevation-3.tw-mg-b-3.tw-relative')) {
          console.log('{TwitchEdit-Delete} ^found match^');

          //gets the header (icons)
          clipHeader = node.getElementsByClassName('tw-align-items-center tw-border-b tw-c-background-alt tw-flex tw-justify-content-between tw-pd-1')[0];
          console.log("{TwitchEdit-Delete} found header:", clipHeader);

          //gets the link container
          clipLinkContainer = node.getElementsByClassName('tw-inline-flex tw-tooltip-wrapper');
          console.log("{TwitchEdit-Delete} found link container:", clipLinkContainer);

          var twitchDeleteButton = clipLinkContainer[1];
          twitchDeleteButton.style.visibility = 'hidden';

          //marks the insertion point
          insertionPoint = clipLinkContainer[1];
          console.log("{TwitchEdit-Delete} marked insertion point:", insertionPoint);

          //inject the delete button
          injectDelete();
          return;

        //if the node did not match our parameters
        } else {
          console.log('{TwitchEdit-Delete} ^did not match^')
        }
      }
    }
  })
});

//modify the clips to display new data
function injectDelete() {
  console.log('{TwitchEdit-Delete} beginning HTML injection');

  //replace <link> with the actual link
  console.log('{TwitchEdit-Delete} --setting link');
  deleteButtonHTML.contents = deleteButtonHTML.contents.replace(linkReplace, clipLink);

  //set the width and height of the icon
  console.log('{TwitchEdit-Delete} --setting icon size');
  deleteButtonHTML.contents = deleteButtonHTML.contents.replace(sizeReplace, iconSize);
  deleteButtonHTML.contents = deleteButtonHTML.contents.replace(sizeReplace, iconSize);

  //inject the HTML after the insertion point
  console.log('{TwitchEdit-Delete} --injecting HTML');
  insertionPoint.insertAdjacentHTML('afterend', deleteButtonHTML.contents);

  //display the injection in the console
  console.log('{TwitchEdit-Delete} injected: ', editRoot.getElementsByClassName('twitchedit-delete')[0]);

  //successfully injected!
  console.log('{TwitchEdit-Delete} !!- HTML injection COMPLETED | You can now click on the clip icon to clip without redirection -!!');
}

//root node to watch changes in, make sure to pay attention to the childlist and subtrees
var editRoot = document.getElementById('root');
console.log('{TwitchEdit-Delete} found root node, observing for changes', editRoot)

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
      console.log('{TwitchEdit-Delete} found and loaded HTML:', element.contents);
    })
  });
}

//load the editButton.html
loadFile('/html/delete/deleteButton.html', deleteButtonHTML);
