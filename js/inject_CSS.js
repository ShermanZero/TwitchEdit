/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

//injects the stylesheet into the DOM (makes it so that you can edit the stylesheet in the Chrome console)
function injectStyles(url) {
  var elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.setAttribute('href', url);
  document.body.appendChild(elem);
}

//inject
injectStyles(chrome.extension.getURL('css/styles.css'));
