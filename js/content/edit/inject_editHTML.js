/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

console.log('{TwitchEdit-Edit} Content script loaded and started');

var iconSize = 16;
var copyright = "<!-- TwitchEdit COPYRIGHT (C) 2019 KIERAN SHERMAN | twitch.tv/shermanzero -->";

var linkReplace = "{link}";
var sizeReplace = "{size}";

var clipHeader, clipLink, insertionPoint, editButtonHTML = {contents: ""};

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
        if(!(node.childNodes.length > 0 && node.firstChild.hasAttribute('data-target') && node.firstChild.getAttribute('data-target') == 'clips-manager-table-row')) {
          continue;
        }

        //log that the MutationObserver has noticed the added node
        console.log('{TwitchEdit-Edit} DOM added node:', node);

        //if the clips container has been loaded in
        if(node.hasChildNodes() && node.firstChild.matches('.clmgr-table__row-expanded.tw-block.tw-c-background-base.tw-elevation-3.tw-mg-b-3.tw-relative')) {
          console.log('{TwitchEdit-Edit} ^found match^');

          //gets the header (icons)
          clipHeader = node.getElementsByClassName('tw-align-items-center tw-border-b tw-c-background-alt tw-flex tw-justify-content-between tw-pd-1')[0];
          console.log("{TwitchEdit-Edit} found header:", clipHeader);

          //gets the link container
          clipLinkContainer = node.getElementsByClassName('tw-inline-flex tw-tooltip-wrapper');
          console.log("{TwitchEdit-Edit} found link container:", clipLinkContainer);

          //marks the insertion point
          insertionPoint = clipLinkContainer[clipLinkContainer.length - 2];
          console.log("{TwitchEdit-Edit} marked insertion point:", insertionPoint);

          //iterate through container to find the link
          for(var j = 0; j < clipLinkContainer.length; j++) {
            var child = clipLinkContainer[j];
            console.log('{TwitchEdit-Edit} searching for link, testing (' + (j+1) + '/' + clipLinkContainer.length + '):', child);

            //if there exists a child with an 'a' tag, get the href value
            if(child.getElementsByTagName('a')[0] != null) {
              clipLink = child.children[0].getAttribute('href');
              console.log('{TwitchEdit-Edit} found full link:', clipLink);

              //display how many searches we do not need to do anymore since we have found the link
              console.log("{TwitchEdit-Edit} discarded " + (clipLinkContainer.length - (j+1)) + " search(es)");

              //cut the end of the link starting at '?'
              clipLink = clipLink.substring(0, clipLink.indexOf('?'))+"/edit";
              console.log("{TwitchEdit-Edit} modified clip link:", clipLink);

              //found the link, so break out of the loop
              break;
            }
          }

          //modify the clip and finish (no need to keep iterating through other additions)
          modifyClip();
          break;

        //if the node did not match our parameters
        } else {
          console.log('{TwitchEdit-Edit} ^did not match^')
        }
      }
    }
  })
});

//modify the clips to display new data
function modifyClip() {
  console.log('{TwitchEdit-Edit} beginning HTML injection');

  //set the width and height of the icon
  console.log('{TwitchEdit-Edit} --setting icon size');
  editButtonHTML.contents = editButtonHTML.contents.replace(sizeReplace, iconSize);
  editButtonHTML.contents = editButtonHTML.contents.replace(sizeReplace, iconSize);

  //inject the HTML after the insertion point
  console.log('{TwitchEdit-Edit} --injecting HTML');
  insertionPoint.insertAdjacentHTML('afterend', editButtonHTML.contents);

  //display the injection in the console
  console.log('{TwitchEdit-Edit} injected: ', editRoot.getElementsByClassName('twitchedit-edit')[0]);

  //get the new edit button and add an onclick function
  document.getElementById('twitchedit-edit-button').onclick = function() {
    //open the clip edit link in a new tab and create a new entry in the history list
    window.open(clipLink, "_blank", "", false);
  };

  //log that we have set the button to open a link
  console.log('{TwitchEdit-Edit} set edit button onclick event to open link');

  //successfully injected!
  console.log('{TwitchEdit-Edit} !!- HTML injection COMPLETED | You can now click on the clip icon to clip without redirection -!!');
}

//root node to watch changes in, make sure to pay attention to the childlist and subtrees
var editRoot = document.getElementById('root');
console.log('{TwitchEdit-Edit} found root node, observing for changes', editRoot)

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
      console.log('{TwitchEdit-Edit} found and loaded HTML:', element.contents);
    })
  });
}

//load the editButton.html
loadFile('/html/edit/editButton.html', editButtonHTML);
