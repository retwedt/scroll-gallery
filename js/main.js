//main.js


// get dom elements
var header = document.querySelector(".slide-show") || document.querySelector(".scroll-header") || document.querySelector(".blank-header");


// when user has scrolled a certain distance, desaturate header
document.onscroll = function() {
	if (document.body.scrollTop <= 100) {
		header.classList.add("saturate");
		header.classList.remove("desaturate");
	} else {
		header.classList.add("desaturate");
		header.classList.remove("saturate");
	}
}