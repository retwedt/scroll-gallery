// slide-show.js
// a scrolling image gallery clone


// constructor function for slide-show
function SlideShow(scrollEl) {
	this.scroller = scrollEl;

	this.imgWrap, this.scrollerRight, this.scrollerLeft, this.scrollerTitle, this.scrollerLink, this.timelineWrap, this.bigDot, this.smallDot;

	// get image list and set minimum scroller height
	this.imgList = this.scroller.querySelectorAll("img");

	// variables to store the currently selected image number in the group
	this.curImgNum = 0;
	this.curTime = new Date().getTime();
	this.delayTime = parseInt(this.scroller.dataset.slideShowDelay) || 5000; // default to 5s
	this.scrollerDirection = this.scroller.dataset.slideShowDirection || "right"; // default to right
	this.timelineMarkers = [];
	this.minHeight;
}

// create scroller elements and add to page
SlideShow.prototype.buildScroller = function() {
	// image wrap
	this.imgWrap = document.createElement("div");
	this.imgWrap.setAttribute("class", "img-wrap");
	this.scroller.appendChild(this.imgWrap);
	// right button
	this.scrollerRight = document.createElement("div");
	this.scrollerRight.setAttribute("class", "slide-show-right");
	this.scroller.appendChild(this.scrollerRight);
	// left button
	this.scrollerLeft = document.createElement("div");
	this.scrollerLeft.setAttribute("class", "slide-show-left");
	this.scroller.appendChild(this.scrollerLeft);
	// title
	this.scrollerTitle = document.createElement("p");
	this.scrollerLink = document.createElement("a");
	// timeline
	this.timelineWrap = document.createElement("div");
	this.timelineWrap.setAttribute("class", "timeline-wrap");
	this.scroller.appendChild(this.timelineWrap);
	// big and small dot templates
	this.bigDot = document.createElement("div");
	this.bigDot.setAttribute("class", "dot-big");
	this.smallDot = document.createElement("div");
	this.smallDot.setAttribute("class", "dot-small");
};

SlideShow.prototype.setup = function() {
	var self = this; // reference for timeout functions

	var mH = 100000;
	// determine height of smallest image, all images will be set to this height
	for (var i=0; i<this.imgList.length; i++ ) {
		if (this.imgList[i].height < mH) {
			mH = this.imgList[i].height;
		}
		// remove image from page
		this.scroller.removeChild(this.imgList[i]);
	}
	if (this.scroller.clientHeight != 0) {
		console.log(this.scroller.clientHeight);
		this.minHeight = this.scroller.clientHeight;
	} else {
		console.log("no scroll dimensions set!");
		this.minHeight = mH;
	}

	// setup scroller
	this.clearScroller();
  setTimeout(function() {
  	self.updateScroller("new");
  }, 500);
	// update scroller every 500ms
	setInterval(function() {
		self.checkTime()
	}, 500);


	// bind events
	window.onresize = function() {
		self.setImgDimensions(self.imgWrap.querySelector("img"));
	}
	this.scrollerRight.onclick = function() {
	  // prevent update when clicked too quickly
	  var newTime = new Date().getTime();
	  if ((newTime - self.curTime) > 800) {
	  	self.curTime = new Date().getTime();
			self.clearScroller();
		  setTimeout(function() {
		  	self.updateScroller("right");
		  }, 500);
	  } else {
	    console.log("clicking too quickly!");
	  }
	}
	this.scrollerLeft.onclick = function() {
	  // prevent update when clicked too quickly
	  var newTime = new Date().getTime();
	  if ((newTime - self.curTime) > 800) {
	  	self.curTime = new Date().getTime();
			self.clearScroller();
		  setTimeout(function() {
		  	self.updateScroller("left");
		  }, 500);
	  } else {
	    console.log("clicking too quickly!");
	  }
	}
};

SlideShow.prototype.updateScroller = function(dir) {
	// figure out direction of scroller, update the current number appropriately
	// dir can be right, left, new, or timeline
	if (dir == "new") {
		this.buildTimeline();
	}	else if (dir == "timeline") {
		this.updateTimeline(this.curImgNum);
	} else if (dir == "right") {
		if (this.curImgNum == (this.imgList.length - 1)) {
			this.curImgNum = 0;
		} else {
			this.curImgNum++;
		}
		this.updateTimeline(this.curImgNum);
	} else if (dir == "left") {
		if (this.curImgNum == 0) {
			this.curImgNum = (this.imgList.length - 1);
		} else {
			this.curImgNum--;
		}
		this.updateTimeline(this.curImgNum);
	} else {
		console.log("what direction is the scroller going?!!");
	}

  // create text element and add it to slide-show element
  var newTxt;
  if (this.imgList[this.curImgNum].dataset.slideShowLink != null) {
	  newTxt = this.scrollerLink.cloneNode(true);
	  newTxt.href = this.imgList[this.curImgNum].dataset.slideShowLink;
  } else {
	  newTxt = this.scrollerTitle.cloneNode(true);
  }
	newTxt.textContent = this.imgList[this.curImgNum].title;
  this.imgWrap.appendChild(newTxt);

	// create image element and add it to img-wrap
	var newImg = this.imgList[this.curImgNum].cloneNode(true);
	this.setImgDimensions(newImg); // set image dimensions

	// append image to image wrap
  this.imgWrap.appendChild(newImg);
  this.imgWrap.setAttribute("class", "img-wrap img-wrap-show");

	// update timeline
	this.updateTimeline(this.curImgNum);
};

SlideShow.prototype.clearScroller = function() {
	var self = this; // reference for timeout functions

	// hide image wrap
	this.imgWrap.setAttribute("class", "img-wrap img-wrap-hide");

	var curTxt = this.imgWrap.querySelector("p") || this.imgWrap.querySelector("a");
	var curImg = this.imgWrap.querySelector("img");
	if (curImg && curTxt) {
    setTimeout(function() {
      self.imgWrap.removeChild(curTxt);
      self.imgWrap.removeChild(curImg);
    }, 500);
	}
};

SlideShow.prototype.setImgDimensions = function(img) {
	if (img) {
		var r = img.width / img.height;
		var nH = this.minHeight;
		var nW = r * nH;

		if (this.scroller.dataset.slideShowFill == "fill") {
			if (nW < this.scroller.offsetWidth) {
				nW = this.scroller.offsetWidth;
				nH = this.scroller.offsetWidth * (1/r);
			}
		}

		img.style.height = nH + "px";
		img.style.width = nW + "px";
		// set image wrap to correct height 
		this.imgWrap.style.height = this.minHeight + "px";

	} else {
		console.log("error no image!");
	}
};

SlideShow.prototype.buildTimeline = function() {
	var self = this; // reference for eventlistener

	// get current group length, this will be the number of markers (big dots)
	var tlLength = this.imgList.length;
	for (var i=0; i<tlLength; i++) {
		var newBigDot = this.bigDot.cloneNode(true);
		this.timelineMarkers.push(newBigDot);
		this.timelineWrap.appendChild(newBigDot);
		if (i != (tlLength-1)) {
			var smallDot1 = this.smallDot.cloneNode(true);
			var smallDot2 = this.smallDot.cloneNode(true);
			this.timelineWrap.appendChild(smallDot1);
			this.timelineWrap.appendChild(smallDot2);
		}
	}
	// calculate timelineWrap width and update element
	// dotWrap elements are 18px x 18px
	var timelineWidth = (20 * tlLength) + (20 * (tlLength-1) * 2);
	this.timelineWrap.style.width = timelineWidth + "px";
	// highlight the active timeline marker
	this.timelineMarkers[this.curImgNum].id = "highlight";
	// add click events to the timeline markers
	for (var j=0; j<this.timelineMarkers.length; j++) {
		this.timelineMarkers[j].addEventListener("click", function() {
			// check if the user is clicking too quickly on the timeline elements
		  var newTime = new Date().getTime();
		  if ((newTime - self.curTime) > 800) {
		  	self.curTime = new Date().getTime();
				// when a timeline marker is clicked, check if it is the current marker, 
				// then update the global current poster values and build a new modal
				var thisImgNum = self.timelineMarkers.indexOf(this);
				if (self.curImgNum != thisImgNum) {
					// update styling of previous poster timeline marker
					self.timelineMarkers[self.curImgNum].id = "";
					// update global current poster num
					self.curImgNum = thisImgNum;
					self.clearScroller();
				  setTimeout(function() {
				  	self.updateScroller("timeline");
				  }, 500);
					self.updateTimeline();
				}
		  } else {
		    console.log("clicking too quickly!");
		  }
		});
	}
};

SlideShow.prototype.updateTimeline = function() {
	// remove all highlights from the timeline
	for (var i=0; i<this.timelineMarkers.length; i++) {
		this.timelineMarkers[i].id = "";
	}
	// highlight the correct timeline marker for the current poster
	this.timelineMarkers[this.curImgNum].id = "highlight";
}

SlideShow.prototype.clearTimeline = function() {
	// remove any elements currently in the timeline
	while (this.timelineWrap.firstChild) {
    this.timelineWrap.removeChild(this.timelineWrap.firstChild);
	}
	// remove any elements in the timelineMarkers array
	this.timelineMarkers = [];
};

SlideShow.prototype.checkTime = function() {
	var self = this; // reference for timeout function

	var newTime = new Date().getTime();
	if ((newTime - this.curTime) >= this.delayTime) {
		this.curTime = newTime;
		this.clearScroller();
	  setTimeout(function() {
	  	self.updateScroller(self.scrollerDirection);
	  }, 500);
	}
};


window.onload = function() {

	// DOM ELEMENTS
	// there can be multiple slide-shows on a page, so collect them in an array
	var allScrollEls = document.querySelectorAll(".slide-show");
	var newScrollers = [];

	for (var i=0; i<allScrollEls.length; i++) {
		newScrollers.push(new SlideShow(allScrollEls[i]));
		newScrollers[i].buildScroller();
		newScrollers[i].setup();
	}

}
