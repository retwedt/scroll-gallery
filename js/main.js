//main.js


// get dom elements
var mainHeader = document.querySelector(".slide-show");

// when user has scrolled a certain distance, desaturate header
document.onscroll = function() {
	if (document.body.scrollTop <= 100) {
		mainHeader.setAttribute("class", "slide-show saturate");
	} else {
		mainHeader.setAttribute("class", "slide-show desaturate");
	}
}
