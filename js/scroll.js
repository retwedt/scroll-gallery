//main.js


// get dom elements
var showHeader = document.querySelector(".show-header");
var img = showHeader.querySelector("img");
var rows = document.querySelectorAll(".row");
var cells = document.querySelectorAll(".cell");
//Global ID of mouse down interval
var mousedownID = -1;


// get current screen dimensions, update them when the window is resized
var winWidth = 0;
var winHeight = 0;
var headerHeight = 276; // this is set by default
var mediaRatio = img.width / img.height; // variable to calculate header image aspect ratio
window.onload = getDimensions;
window.onresize = getDimensions;


// get dimensions of page, and calculate appropriate 
// size for header image
function getDimensions() {
	winWidth = document.documentElement.clientWidth;
	winHeight = document.documentElement.clientHeight;

	var tempWidth = winWidth;
	var tempHeight = tempWidth * (1/mediaRatio);
	if (tempHeight < headerHeight) {
		tempHeight = headerHeight;
		tempWidth = tempHeight * mediaRatio;
	}
	img.style.width = tempWidth + "px";
	img.style.height = tempHeight + "px";
}






// when user has scrolled a certain distance, desaturate header
document.onscroll = function() {
	if (document.body.scrollTop <= 100) {
		showHeader.setAttribute("class", "show-header saturate");
	} else {
		showHeader.setAttribute("class", "show-header desaturate");
	}
}


// setup row elements
for (var i = 0; i < rows.length; i++) {
	// access the row-scroll element within each row
	var rowScroll = rows[i].querySelector(".row-scroll");
	// access the cells in each row-scroll element
	var currentCells = rowScroll.querySelectorAll(".cell");
	// set the width of the row-scroll element based on the number of cells
	var width = (currentCells.length * 254) + 24;
	rowScroll.style.width = width + "px";

	// add events to left and right buttons
	// from https://stackoverflow.com/questions/15505272/javascript-while-mousedown
	var rightBtn = rows[i].querySelector(".row-right");
	var leftBtn = rows[i].querySelector(".row-left");
	leftBtn.addEventListener("mousedown", function() { mouseDown(this); });
	rightBtn.addEventListener("mousedown", function() { mouseDown(this); });
	leftBtn.addEventListener("mouseup", mouseUp);
	rightBtn.addEventListener("mouseup", mouseUp);
	leftBtn.addEventListener("mouseout", mouseUp);
	rightBtn.addEventListener("mouseout", mouseUp);
}
function mouseDown(el) {
  if(mousedownID==-1) {
    mousedownID = setInterval(function() {
    	scroll(el)
    }, 75 /*ms*/);
  }
}
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
				this.parentElement.querySelector("img").setAttribute("class", "");
			} else {
				this.setAttribute("class", "cell-btn b-on");
				cellText.style.transform = "translate(0%, 0%)";
				this.parentElement.querySelector("img").setAttribute("class", "dim");
			}
		});
	}
}
