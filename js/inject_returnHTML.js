/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

console.log('{TwitchEdit-Return} Content script loaded and started');

var copyright = "<!-- TwitchEdit COPYRIGHT (C) 2019 KIERAN SHERMAN | twitch.tv/shermanzero -->";
var injectionPoint, returnButtonHTML = {contents: ""};

//mutation observer watching for added nodes
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function (mutation) {
    //if nodes were added, start iterating through them
    if(mutation.addedNodes.length > 0) {
      for(var i = 0; i < mutation.addedNodes.length; i++) {
        //initialize the node variable
        var node = mutation.addedNodes[i];

        //log that the MutationObserver has noticed the added node (DEV)
        console.log('{TwitchEdit-DEV} DOM added node:', node);

        //if the node is null or does not match our parameters
        if(node == null || node.nodeName != "DIV" || node.nodeType != 1) {
          continue;
        } else
        //if the node has my class, ignore it
        if(node.hasAttribute('class') && node.getAttribute('class') == 'twitchedit') {
          continue;
        } else
        //if the element is exactly what we're looking for
        if(node.childElementCount == 2 && node.children[1].getAttribute('class') == 'tw-align-items-center tw-flex tw-justify-content-between tw-pd-t-1') {
          console.log('{TwitchEdit} DOM loaded injection point', node);
          modifyReturn();
        } else
        //check if the video is done publishing so we can exit the tab
        if(node.getAttribute('class') == 'clips-post-edit-share tw-border-b tw-border-l tw-border-r tw-border-t tw-c-background-base tw-pd-3') {
          //log what we've done
          console.log('{TwitchEdit} finished publishing clip - closing window');

          //reload the Clips Manager tab after this window is closed
          window.onunload = reload;
          function reload() {
            window.location.reload(true);
          }

          //close the tab
          window.close();
        }
      }
    }
  })
});

//adds a return button to the editting page
function modifyReturn() {
  //find the injection point for the HTML
  var rootInjectionPoint = document.getElementsByClassName("tw-align-items-center tw-flex tw-justify-content-between tw-pd-t-1")[0];

  //log the root injection point
  console.log('{TwitchEdit} found root injection point');

  //update the position of the root injection to be relative, so the publish button will be right-aligned
  rootInjectionPoint.style.position = 'relative';

  //log the changes
  console.log('{TwitchEdit} modified root injection to include position: relative', rootInjectionPoint);

  //remove the pesky "Clips with titles..." message
  var message = rootInjectionPoint.children[0];
  console.log('{TwitchEdit} removing pesky message', message)
  message.remove();

  //set the final injection point
  var injectionPoint = rootInjectionPoint.children[0];
  console.log('{TwitchEdit} found injection point', injectionPoint);

  //stores the submit button
  var publishButton = injectionPoint.getElementsByClassName('tw-align-items-center tw-align-middle tw-border-bottom-left-radius-large tw-border-bottom-right-radius-large tw-border-top-left-radius-large tw-border-top-right-radius-large tw-core-button tw-core-button--border tw-core-button--large tw-core-button--padded tw-core-button--primary tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative')[0];

  //adds an ID to the button so it can be referenced by the injection
  publishButton.setAttribute('id', 'publish');

  //hide the standard publish button
  publishButton.style.visibility = 'hidden';

  //log that we found and hid the publish button
  console.log('{TwitchEdit} found and hid the publish button', publishButton);

  //starting the injection
  console.log('{TwitchEdit} beginning HTML injection');

  //insert the submit button after the other submit button
  injectionPoint.insertAdjacentHTML('beforebegin', (copyright + returnButtonHTML.contents + copyright));

  //successfully injected!
  console.log('{TwitchEdit} !!- HTML injection COMPLETED | You can now click on the edit icon to go to the clip editor -!!');
}

//root node to watch changes in, make sure to pay attention to the childlist and subtree
var returnRoot = document.getElementById('root');
console.log('{TwitchEdit} found root node, observing for changes', returnRoot);

observer.observe(returnRoot, {
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
