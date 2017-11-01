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

var segData = [];

// Change below (and elsewhere) to allow for segs without audio data?

(function () {
  
  var seg;
  var audioData;
  
  for (var i = 0; i < numSegs; i += 1) {
    seg = segs[i];
    audioData = seg.getAttribute('data-audio').split(' ');
    segData.push({
      'sprite': audioData[0],
      'start': Number(audioData[1]),
      'stop': Number(audioData[2])
    });
  }
})();

var notes = [];
notes.push.apply(notes, document.getElementsByClassName('note'));
// var numNotes = notes.length; // Needed?

var currentIndex = -1;

var playAll = false;

var audioTimer;

var textSegs = []; // Needed? Only used in one place...
textSegs.push.apply(textSegs, document.getElementsByClassName('text-seg'));
var numTextSegs = textSegs.length; // Needed?

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

// Temporary

function moveHighlight(move) {
  if (segs[currentIndex]) {
    segs[currentIndex].classList.remove('highlight');
  }
  segs[move.targetIndex].classList.add('highlight');
}

//

function startSeg(move) {
  moveHighlight(move);
  currentIndex = move.targetIndex;
  if (move.skip) {
    audio.currentTime = segData[currentIndex].start;
    if (audio.paused) {
      playAudio();
  }
  }
}

function playAudio() {
  audio.play();
  audioTimer = window.setInterval(checkStop, 20);
}

function checkStop() {
  var nextVisibleIndex;
  
  if (audio.currentTime > segData[currentIndex].stop) {

    if (!playAll) {
      pauseAudio();
      
    } else {
      nextVisibleIndex = getNextVisibleIndex();
      
      if (nextVisibleIndex === undefined) {
        pauseAudio();
        playAll = false;
        
      } else if (segData[nextVisibleIndex].sprite !== segData[currentIndex].sprite) {
        startSeg({
          targetIndex: nextVisibleIndex,
          skip: true
        });
        
      } else if (audio.currentTime > segData[nextVisibleIndex].start) {
        startSeg({
          targetIndex: nextVisibleIndex,
          skip: false
        });
      }
    }
  }
}

function pauseAudio() {
  audio.pause();
  window.clearInterval(audioTimer);
}

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

function next() {
  var nextVisibleIndex = getNextVisibleIndex();
  if (nextVisibleIndex !== undefined) {
    startSeg({
      targetIndex: nextVisibleIndex,
      skip: true
    });
  }
}

function prev() {
  var prevVisibleIndex = getPrevVisibleIndex();
  var threshold = segData[currentIndex].start + 0.2;
  if (audio.currentTime > threshold || prevVisibleIndex === undefined) {
    startSeg({
      targetIndex: currentIndex,
      skip: true
    });
  } else {
    startSeg({
      targetIndex: prevVisibleIndex,
      skip: true
    });
  }
}

function togglePlayAll() {
  if (audio.paused) {
    playAll = true;
    next();
  } else {
    playAll = !playAll;
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
      prev();
      break;
    case 39:
      next();
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
