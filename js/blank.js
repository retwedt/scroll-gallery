//main.js


// get dom elements
var showHeader = document.querySelector(".blank-header");


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