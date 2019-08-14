/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

var clipsRoot, clipHeader, clipLink, insertionPoint;
var clipHTML = "<div class='twitchedit twitchedit_tooltip tw-align-items-center tw-full-width tw-icon tw-icon--fill tw-inline-flex'> <span class='twitchedit_tooltiptext'>TwitchEdit</span> <a href='<link>' target='_blank'> <img src='https://i.ibb.co/Wf84T3K/icon-128-white.png' alt='edit' width='20' height='20'> </a> </div>"

console.log("{TwitchEdit} Twitch clips manager page has been loaded!");

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function (mutation) {
    //if nodes were added, start iterating through them
    if(mutation.addedNodes.length > 0) {
      for(var i = 0; i < mutation.addedNodes.length; i++) {
        //initialize the node variable
        var node = mutation.addedNodes[i];

        //if the node is for some reason null
        if(node == null) {
          continue
        } else
        //if the node has my class, ignore it
        if(node.hasAttribute('class') && node.getAttribute('class') == 'twitchedit') {
          continue;
        //if the node does not have the data-target attribute set to clips-manager-table-row, ignore it
        } else
        //if the child node happens to be a string
        if(node.hasChildNodes() && node.firstChild.nodeType == 3) {
          continue;
        } else
        //if all other tests pass, but if the node is not exactly what we are looking for, continue
        if(!(node.childNodes.length > 0 && node.firstChild.hasAttribute('data-target') && node.firstChild.getAttribute('data-target') == 'clips-manager-table-row')) {
          continue;
        }

        //log that the MutationObserver has noticed the added node
        console.log('{TwitchEdit} added node:', node);

        //if the clips container has been loaded in
        if(node.hasChildNodes() && node.firstChild.matches('.clmgr-table__row-expanded.tw-block.tw-c-background-base.tw-elevation-3.tw-mg-b-3.tw-relative')) {
          console.log('{TwitchEdit} ^found match^');

          //gets the header (icons)
          clipHeader = node.getElementsByClassName('tw-align-items-center tw-border-b tw-c-background-alt tw-flex tw-justify-content-between tw-pd-1')[0];
          console.log("{TwitchEdit} found header:", clipHeader);

          //gets the link container
          clipLinkContainer = node.getElementsByClassName('tw-inline-flex tw-tooltip-wrapper');
          console.log("{TwitchEdit} found link container:", clipLinkContainer);

          //marks the insertion point
          insertionPoint = clipLinkContainer[clipLinkContainer.length - 2];
          console.log("{TwitchEdit} marked insertion point:", insertionPoint);

          //iterate through container to find the link
          for(var j = 0; j < clipLinkContainer.length; j++) {
            var child = clipLinkContainer[j];
            console.log('{TwitchEdit} searching for link, testing (' + (j+1) + '/' + clipLinkContainer.length + '):', child);

            //if there exists a child with an 'a' tag, get the href value
            if(child.getElementsByTagName('a')[0] != null) {
              clipLink = child.children[0].getAttribute('href');
              console.log('{TwitchEdit} found full link:', clipLink);

              //cut the end of the link starting at '?'
              clipLink = clipLink.substring(0, clipLink.indexOf('?'))+"/edit";
              console.log("{TwitchEdit} modified clip link:", clipLink);
              break;
            }
          }

          //modify the clip and finish (no need to keep iterating through other additions)
          modifyClip();
          break;
        //if the node did not match our parameters
        } else {
          console.log('{TwitchEdit} ^did not match^')
        }
      }
    }
  })
});

//modify the clips to display new data
function modifyClip() {
  console.log("{TwitchEdit} beginning HTML injection");

  //replace <link> with the actual link
  clipHTML = clipHTML.replace('<link>', clipLink);

  //inject the HTML after the insertion point
  console.log("{TwitchEdit} injecting: ", clipHTML);
  insertionPoint.insertAdjacentHTML('afterend', clipHTML);

  //all done :)
  console.log("{TwitchEdit} HTML injection finished :) you can now click on the fancy icon to directly edit the clip!");
}

//root node to watch changes in, make sure to pay attention to the childlist and subtree
const root = document.getElementById('root');
observer.observe(root, {
  childList: true,
  subtree: true
});
