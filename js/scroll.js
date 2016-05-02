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
//Global ID of mouse down interval
var mousedownID = -1;



// setup row elements
for (var i = 0; i < rows.length; i++) {
	var rowScrollWrap = rows[i].querySelector(".row-scroll-wrap");
	// access the row-scroll element within each row
	var rowScroll = rowScrollWrap.querySelector(".row-scroll");
	// access the cells in each row-scroll element
	var currentCells = rowScroll.querySelectorAll(".cell");
	// set the width of the row-scroll element based on the number of cells
	var width = (currentCells.length * 254) + 24;
	rowScroll.style.width = width + "px";

	// rowScrollWrap.addEventListener("scroll", fixScroll.debounce(adjustScroll, 500));

	// add events to left and right buttons
	var rightBtn = rows[i].querySelector(".row-right");
	var leftBtn = rows[i].querySelector(".row-left");
	// from https://stackoverflow.com/questions/15505272/javascript-while-mousedown
	leftBtn.addEventListener("mousedown", mouseDown);
	rightBtn.addEventListener("mousedown", mouseDown);
	leftBtn.addEventListener("mouseup", mouseUp);
	rightBtn.addEventListener("mouseup", mouseUp);
	leftBtn.addEventListener("mouseout", mouseUp);
	rightBtn.addEventListener("mouseout", mouseUp);
}


// when the mouse is down, use setInterval to run the scroll function every 75 ms
function mouseDown() {
	var self = this; // reference for passing to setInterval
  if(mousedownID==-1) {
    mousedownID = setInterval(function() {
    	scroll(self);
    }, 75);
  }
}
// when the mouse is up, use clearInterval to stop the scroll function 
function mouseUp() {
  if(mousedownID!=-1) {
    clearInterval(mousedownID);
    mousedownID=-1;
  }
}
function scroll(el) {
	var row = el.parentElement.querySelector(".row-scroll-wrap");
	var dir = el.className.slice(4);
	if (dir === "right") {
		row.scrollLeft += 25;
	} else if (dir === "left") {
		row.scrollLeft -= 25;
	} else {
		console.log("error!");
	}
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
				this.parentElement.querySelector("img").setAttribute("class", "un-dim");
			} else {
				this.setAttribute("class", "cell-btn b-on");
				cellText.style.transform = "translate(0%, 0%)";
				this.parentElement.querySelector("img").setAttribute("class", "dim");
			}
		});
	}
}
