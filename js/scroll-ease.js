//main.js


// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


// get dom elements
var rows = document.querySelectorAll(".row");
var cells = document.querySelectorAll(".cell");


// setup row elements
for (var i = 0; i < rows.length; i++) {
	// get row elements from DOM
	var rowScrollWrap = rows[i].querySelector(".row-scroll-wrap");
	var rowScroll = rowScrollWrap.querySelector(".row-scroll");
	var currentCells = rowScroll.querySelectorAll(".cell");
	var rightBtn = rows[i].querySelector(".row-right");
	var leftBtn = rows[i].querySelector(".row-left");

	// set the width of the row-scroll element based on the number of cells
	var width = (currentCells.length * 254) + 24;
	rowScroll.style.width = width + "px";

	// add event to row-scroll-wrap
	rowScrollWrap.addEventListener("scroll", debounce(scrollTo, 200));

	// add events to left and right buttons
	leftBtn.addEventListener("click", scrollTo);
	rightBtn.addEventListener("click", scrollTo);
}


// set up description elements in each cell
for (var j=0; j<cells.length; j++) {
	var cellBtn = cells[j].querySelector(".cell-btn");
	// if there is a description/button inside the cell, add an event
	if (cellBtn) {
		// when a cell button is clicked, slide the description text into view
		// (by default it was hidden outside of the button bounds)
		cellBtn.addEventListener("click", function() {
			var cellText = this.parentElement.querySelector("p");
			if (this.classList.contains("b-on")) {
				this.setAttribute("class", "cell-btn b-off");
				cellText.style.transform = "translate(0%, 100%)";
				this.parentElement.querySelector(".theater").classList.remove("dim");
			} else {
				this.setAttribute("class", "cell-btn b-on");
				cellText.style.transform = "translate(0%, 0%)";
				this.parentElement.querySelector(".theater").classList.add("dim");
			}
		});
	}
}


// function to animate scrolling inside of the horizontal rows
// https://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery
function scrollTo() {
	var row = this.parentElement.querySelector(".row-scroll-wrap");
  var maxScroll = row.scrollWidth - row.clientWidth;
	var dir = this.className.slice(4);

  var scrollAmount = 0; // amount to scroll the element, equal to 'c' in the easing equation
  var dirMod = 0; // modify the scrollPos based on the direction of the scroll
	var scrollPos = 0; // calculated position of element at any given time


 // each cell is 254px wide, each button click moves 2 cells
	if (dir === "right") {
		scrollAmount = (254 * 2);
		dirMod = 1;
  } else if (dir === "left") {
		scrollAmount = (254 * 2);
		dirMod = -1;
  } else if (dir === "scroll-wrap") { // if dir=='scroll-wrap', the element was moved using the scrollbar instead of the buttons
	  // figure out which cell the current scroll position is closest too
		var mod = row.scrollLeft % 254;
		var num = row.scrollLeft / 254;
		num = Math.floor(num);
		if (mod >= 127) {
			num++;
			scrollAmount = (254 * num) - row.scrollLeft;
			dirMod = 1;
		} else {
			scrollAmount = row.scrollLeft - (254 * num);
			dirMod = -1;
		}
  } else {
  	console.log("direction error!");
  }


	var t = new Date().getTime(); // start time
	var b = row.scrollLeft; // start position
	var d = 1000; // duration, in ms

  // requestAnimationFrame(step);        
  step();
	function step() {
		var dT = new Date().getTime() - t; // time since start

		// easing functions from robert penner, http://robertpenner.com/easing/
		// linear easing
		// scrollPos = (scrollAmount * (dT/d))*dirMod + b;
		// quad ease out
		scrollPos = (-scrollAmount * (dT/d)* ((dT/d)-2))*dirMod + b;

		if (dir === "right") {
	    if ( dT < d && row.scrollLeft < maxScroll) {
	      requestAnimationFrame(step);
	      row.scrollLeft = scrollPos;
	    } else {
	    	cancelAnimationFrame(step);
	    }
		} else if (dir === "left") {
	    if ( dT < d && row.scrollLeft > 0) {
	      requestAnimationFrame(step);
	      row.scrollLeft = scrollPos;
	    } else {
	    	cancelAnimationFrame(step);
	    }
		} else if (dir === "scroll-wrap") {
	    if (dT < d && scrollAmount >= 12 && row.scrollLeft < maxScroll) {
	      requestAnimationFrame(step);
	      row.scrollLeft = scrollPos;
	    } else {
	    	cancelAnimationFrame(step);
	    }
		} else {
			console.log("scrolling error!");
		}
	};
}


// from https://john-dugan.com/javascript-debounce/
// the debounce function will return a function that stops a setTimeout method,
// resets the timeout variable, and calls a function using the setTimeout method.
// the debounce function will be bound to an event and called many times,
// very quickly (with something like 'scroll').  each time, it will reset the
// setTimeout, until the event has stopped firing. then, the function 'callback'
// will be executed after 'delay' ms
function debounce(callback, delay) {
  var timeout;
  return function() {
  	// arguments is a local variable within all functions, containing
  	// an array with any parameters passed to the function
  	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
    var self = this;
    var args = arguments;
	  // this function will be executed using setTimeout
    var later = function() {
      // remove the id stored in the timeout variable
      timeout = null;
      // use the JS 'apply' function to call the 'callback' function
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
      callback.apply(self, args);
    };
    // use the id stored in the timeout variable to stop the previous timeout
    clearTimeout(timeout);
    // use setTimeout to call the 'later' function after 'delay' ms
    // a new id will be created and stored in the timeout varible
    // this id can be used to reference the setTimeout later
    timeout = setTimeout(later, delay || 200);
  };
};

