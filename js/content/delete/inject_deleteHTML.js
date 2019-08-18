/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

console.log('{TwitchEdit-Delete} Content script loaded and started');

var iconSize = 16;
var copyright = "<!-- TwitchEdit COPYRIGHT (C) 2019 KIERAN SHERMAN | twitch.tv/shermanzero -->";

var linkReplace = "{link}";
var sizeReplace = "{size}";

var clipHeader, clipLink, insertionPoint, twitchDeleteButton, deleteButtonHTML = {contents: ""};

//mutation observer watching for added nodes
var rootObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function (mutation) {
    //if nodes were added, start iterating through them
    if(mutation.addedNodes.length > 0) {
      for(var i = 0; i < mutation.addedNodes.length; i++) {
        //initialize the node variable
        var node = mutation.addedNodes[i];

        //log that the MutationObserver has noticed the added node (DEV)
        console.log('{TwitchEdit-Delete-DEV} DOM added node:', node);

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

          //save the delete button for reference by function
          twitchDeleteButton = clipLinkContainer[clipLinkContainer.length-4].getElementsByTagName('button')[0];
          console.log("{TwitchEdit-Delete} storing delete button reference", twitchDeleteButton);

          //hide the original delete button
          clipLinkContainer[clipLinkContainer.length-4].style.visibility = 'hidden';
          console.log("{TwitchEdit-Delete} --setting delete button to hidden");

          //shrink the width of the original delete button to 0px
          clipLinkContainer[clipLinkContainer.length-4].style.width = '0px';
          console.log("{TwitchEdit-Delete} --setting delete button to width of 0px");

          //remove the "Watch on Clips Page" icon
          clipLinkContainer[clipLinkContainer.length-2].remove();
          console.log("{TwitchEdit-Delete} --removing Watch on Clips Page button");

          //marks the insertion point
          insertionPoint = clipLinkContainer[0];
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

//mutation observer watching for added nodes
var reactObserver = new MutationObserver(function(mutations) {
  var success = false;

  mutations.forEach(function (mutation) {
    //if nodes were added, start iterating through them
    if(mutation.addedNodes.length > 0) {
      for(var i = 0; i < mutation.addedNodes.length; i++) {
        //initialize the node variable
        var node = mutation.addedNodes[i];

        //log that the MutationObserver has noticed the added node (DEV)
        //console.log('{TwitchEdit-Delete-DEV} DOM added node to ReactModal:', node);

        //checks for a very specific node (the "Success!" node to appear)
        if(node.textContent == 'Success!') {
          //the success text has loaded
          success = true;

          //log that the clip has finished deleting
          console.log('{TwitchEdit-Delete} clip has finished deleting');
        } else
        //if the success text has loaded and the close button parent div is detected
        if (success && node.getElementsByClassName('tw-mg-x-1')[0] != undefined) {
          //click the "Close" button
          node.getElementsByClassName('tw-mg-x-1')[0].getElementsByTagName('button')[0].click();

          //log that we automatically clicked the close button
          console.log('{TwitchEdit-Delete} clip has finished deleting');
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
  console.log('{TwitchEdit-Delete} injected: ', rootNode.getElementsByClassName('twitchedit-delete')[0]);

  //set the new delete button to do the same thing as the old delete button
  document.getElementById('twitchedit-delete-button').onclick = function() {
    //click the original delete button
    twitchDeleteButton.click();

    //press the "delete" in the window that pops up
    document.getElementsByClassName('tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--border tw-core-button--destructive tw-core-button--padded tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative')[0].click();
  };

  //successfully injected!
  console.log('{TwitchEdit-Delete} !!- HTML injection COMPLETED | You can now click on the clip icon to clip without redirection -!!');
}

//root node to watch changes in
var rootNode = document.getElementById('root');
console.log('{TwitchEdit-Delete} found root node, observing for changes', rootNode)

//observe the childList and subtrees
rootObserver.observe(rootNode, {
  childList: true,
  subtree: true
});

//reaction node to watch changes in
var reactNode = document.getElementsByClassName('ReactModalPortal')[0];
console.log('{TwitchEdit-Delete} found reaction portal, observing for changes', reactNode);

//observe the childlist and subtrees
reactObserver.observe(reactNode, {
  childList: true,
  subtree: true
})

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
