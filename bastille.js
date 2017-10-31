var audio = document.getElementById('audio');

var segs = [];
segs.push.apply(segs, document.getElementsByClassName('seg'));
var numSegs = segs.length;

// Use IIFE as below or something else?
// Somehow do below while initially making segs array?

(function () {
  for (var i = 0; i < numSegs; i += 1) {
    segs[i].id = i;
  }
})();

var textSegs = [];
textSegs.push.apply(textSegs, document.getElementsByClassName('text-seg'));
var numTextSegs = textSegs.length;

var notes = [];
notes.push.apply(notes, document.getElementsByClassName('note'));
var numNotes = notes.length;

var currentIndex = -1;

var playAll = false;

// Temporary for playing with color

/*

var hue = 43;
var sat = 100;

var nps = []
nps.push.apply(nps, document.getElementsByClassName('np'));

*/

//

// For older browsers that don't have nextElementSibling
function getNextElementSibling(el) {
  if (el.nextElementSibling) {
    return el.nextElementSibling;
  } else {
    do {
      el = el.nextSibling;
    } while (el && el.nodeType !== 1);
    return el;
  }
}

// Should this go here or elsewhere?
function getNextSeg(el) {
  do {
    el = getNextElementSibling(el);
  } while (el && el.classList.contains('seg') !== true);
  return el;
}

// Indentation

// In FF, first rect empty if wrap pushes span to start on new line 
function getSegLeft(seg) {
  var rects = seg.getClientRects();
  for (var i = 0, j = rects.length; i < j; i += 1) {
    if (rects[i].width) {
      return rects[i].left;
    }
  }
}

function getTextLeft() {
  var textLeft = getSegLeft(textSegs[0]);
  return textLeft;
}

function indent(arrayOrSeg) {
  var segLeft;
  var segIndent;
  var textLeft = getTextLeft();
  var sgs = [].concat(arrayOrSeg || []).reverse(); // Bottom-up
  for (var i = 0, j = sgs.length; i < j; i += 1) { // Does top seg, no need
    segLeft = getSegLeft(sgs[i]);
    segIndent = segLeft - textLeft;
    if (segIndent) {
      sgs[i].style.marginLeft = segIndent + 'px';
    }
  }
}

// Show and hide notes

function hideNotes(arrayOrNote) {
  var nts = [].concat(arrayOrNote || []);
  for (var i = 0, j = nts.length; i < j; i += 1) {
    if (getNextSeg(nts[i])) {
      getNextSeg(nts[i]).style.marginLeft = '';
    }
    nts[i].classList.add('hide');
  }
}

function showNotes(arrayOrNote) {
  var nts = [].concat(arrayOrNote || []);
  hideNotes(notes);
  // For each note to be shown...
  for (var i = 0, j = nts.length; i < j; i += 1) {
    // ...indent seg underneath...
    indent(getNextSeg(nts[i]));
    // ...and show that note
    nts[i].classList.remove('hide');
  }
}

//

function getNextVisibleIndex() {
  var ndx = currentIndex + 1;
  while (ndx < numSegs) { //
    if (segs[ndx].offsetHeight) {
      return ndx;
    } else {
      ndx += 1;
    }
  }
}

function getPrevVisibleIndex() {
  var ndx = currentIndex - 1;
  while (ndx >= 0) { 
    if (segs[ndx].offsetHeight) {
      return ndx;
    } else {
      ndx -= 1;
    }
  }
}

//

/*

// Playing with color

function changeColor() {
  var cssText = 'hsla(' + hue + ', ' + sat + '%, 50%, 0.055)';
  console.log(cssText);
  for (var i = 0, j = nps.length; i < j; i += 1) {
    nps[i].style.background = cssText;
  }
}

// Playing with highlight

function highlight(targetIndex) {
  if (segs[currentIndex]) {
    segs[currentIndex].classList.remove('highlight');
  }
  segs[targetIndex].classList.add('highlight');
  currentIndex = targetIndex;
}

*/

// Event handlers

function handleClick(e) {
}

function handleKeydown(e) {
  switch(e.keyCode) {
    case 37:
      // prev();
      break;
    case 39:
      // next();
      break;
    case 32:
      e.preventDefault(); // So browser doesn't jump to bottom
      // togglePlayAll();
      break;
  }
}

/*

// Simple highlight mover

function handleKeydown(e) {
  var targetIndex;
  switch(e.keyCode) {
    case 37:
      targetIndex = currentIndex - 1;
      while (segs[targetIndex].parentNode.parentNode.classList.contains('hide')) {
        targetIndex -= 1;
        }
      highlight(targetIndex);
      break;
    case 39:
      targetIndex = currentIndex + 1;
      while (segs[targetIndex].parentNode.parentNode.classList.contains('hide')) {
        targetIndex += 1;
        }
      highlight(targetIndex);
      break;
  }
}

// Color changer

function handleKeydown(e) {
  switch(e.keyCode) {
    case 37:
      if (hue > 0) {
        hue -= 1;
      } else {
        hue = 359;
      }
      changeColor();
      break;
    case 38:
      e.preventDefault();
      if (sat < 100) {
        sat += 1;
      }
      changeColor();
      break;
    case 39:
      if (hue < 359) {
        hue += 1;
      } else {
        hue = 0;
      }
      changeColor();
      break;
    case 40:
      e.preventDefault();
      if (sat > 0) {
        sat -= 1;
      }
      changeColor();
      break;
  }
}
*/

// Event listeners

document.addEventListener('click', handleClick, false);
document.addEventListener('keydown', handleKeydown, false);
