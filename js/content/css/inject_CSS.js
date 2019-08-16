/* TWITCHEDIT COPYRIGHT © 2019 KIERAN (SHERMANZERO) SHERMAN */

//injects the stylesheet into the DOM (makes it so that you can edit the stylesheet in the Chrome console)
function injectStyles(url) {
  //create a <link> element
  var stylesElement = document.createElement('link');

  //set the rel attribute to stylesheet
  stylesElement.rel = 'stylesheet';

  //set the href attribute of the rel to the URL
  stylesElement.setAttribute('href', url);

  //append the element to the DOM
  document.body.appendChild(stylesElement);
}

//inject clip styles
injectStyles(chrome.extension.getURL('css/clip/clipButtonStyles.css'));

//inject edit styles
injectStyles(chrome.extension.getURL('css/edit/editButtonStyles.css'));

/* NOTE THAT THE PUBLISH BUTTON CSS IS INJECTED PROGRAMATICALLY WIHTHIN BACKGROUND.JS */
