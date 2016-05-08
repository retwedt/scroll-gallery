// Slide Show, an Image Carousel Clone


// Wrap everything in an iffe to restrict variable scope
(function() {
	// global variables for slide-show elements
	var _allScrollEls;
	var _newScrollers = [];


	/**
	* Get all ".slide-show" elements from the dom, build a Slide-Show scroller for each one, and run the setup method.
	* 
	* @method _onLoad
	* @private
	*/
	var _onLoad = function() {
		// there can be multiple slide-shows on a page, so collect them in an array
		_allScrollEls = document.querySelectorAll(".slide-show");

		for (var i=0; i<_allScrollEls.length; i++) {
			_newScrollers.push(new SlideShow(_allScrollEls[i]));
			_newScrollers[i].buildScroller();
			_newScrollers[i].setup();
		}
	}


	/**
	* When the browser window is resized, adjust the Slide-Show dimensions
	* 
	* @method _onResize
	* @private
	*/
	var _onResize = function() {
		for (var i=0; i<_allScrollEls.length; i++) {
			_newScrollers[i]._setImgDimensions(_newScrollers[i].imgWrap.querySelector("img"));
		}
	}

	// Get current screen dimensions, update modal when the window is loaded and resized.
	window.addEventListener("load",  _onLoad );
	window.addEventListener("resize",  _onResize );



	/**
	* Create a Slide-Show image carousel for displaying images.
	*
	* @class
	* @constructor SlideShow
	* @param {element} [scrollEl] - the DOM element to use when setting up the Slide-Show
	*/
	function SlideShow(scrollEl) {
		/**
		* @property {element} scroller - stores the DOM element used to set up the Slide-Show
		*/
		this.scroller = scrollEl;
		/**
		* @property {array} imgList - list of all img elements from the ".slide-show" element
		*/
		this.imgList = this.scroller.querySelectorAll("img");
		/**
		* @property {int} curImgNum - the current image number
		*/
		this.curImgNum = 0;
		/**
		* @property {int} curTime - current time
		*/
		this.curTime = new Date().getTime();
		/**
		* @property {int} delayTime - amount of time each img is shown
		*/
		this.delayTime = parseInt(this.scroller.dataset.slideShowDelay) || 5000; // default to 5s
		/**
		* @property {string} scrollerDirection - direction the Slide-Show is scrolling
		*/
		this.scrollerDirection = this.scroller.dataset.slideShowDirection || "right"; // default to right
		/**
		* @property {array} timelineMarkers - stores all timeline elements
		*/
		this.timelineMarkers = [];
		/**
		* @property {int} minHeight - minimum image height
		*/
		this.minHeight;
		/**
		* @property {element} imgWrap
		* @property {element} scrollerRight
		* @property {element} scrollerLeft
		* @property {element} scrollerTitle
		* @property {element} scrollerLink
		* @property {element} timelineWrap
		* @property {element} bigDot
		* @property {element} smallDot
		*/
		this.imgWrap, this.scrollerRight, this.scrollerLeft, this.scrollerTitle, this.scrollerLink, this.timelineWrap, this.bigDot, this.smallDot;
	}


	/**
	* Create the Slide-Show and insert it into the dom, inside the ".slide-show" element.
	* 
	* @method SlideShow#buildScroller
	*/
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


	/**
	* Initial setup of the Slide-Show element.
	* Figure out the minimum image height, if no dimensions are set for the ".slide-show" element,
	* use the minimum image height.
	* Start the _checkTime method, which scrolls the Slide-Show.
	* Bind events to the Slide-Show control elements.
	* 
	* @method SlideShow#setup
	*/
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
			self._checkTime()
		}, 500);


		// bind events
		this.scrollerRight.addEventListener("click", function() {
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
		});
		this.scrollerLeft.addEventListener("click", function() {
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
		});
	};


	/**
	* Update the current image, text/link, and timeline for the Slide-Show.
	* 
	* @method SlideShow#updateScroller
	* @param {string} [dir] - direction the Slide-Show is scrolling.  Can be "new", "left", "right", or "timeline".
	*/
	SlideShow.prototype.updateScroller = function(dir) {
		// figure out direction of scroller, update the current number appropriately
		// dir can be right, left, new, or timeline
		if (dir == "new") {
			this._buildTimeline();
		}	else if (dir == "timeline") {
			this._updateTimeline(this.curImgNum);
		} else if (dir == "right") {
			if (this.curImgNum == (this.imgList.length - 1)) {
				this.curImgNum = 0;
			} else {
				this.curImgNum++;
			}
			this._updateTimeline(this.curImgNum);
		} else if (dir == "left") {
			if (this.curImgNum == 0) {
				this.curImgNum = (this.imgList.length - 1);
			} else {
				this.curImgNum--;
			}
			this._updateTimeline(this.curImgNum);
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
		this._setImgDimensions(newImg); // set image dimensions

		// append image to image wrap
	  this.imgWrap.appendChild(newImg);
	  this.imgWrap.setAttribute("class", "img-wrap img-wrap-show");

		// update timeline
		this._updateTimeline(this.curImgNum);
	};


	/**
	* Clear the contents of the Slide-Show.
	* 
	* @method SlideShow#clearScroller
	*/
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


	/**
	* Set the image dimensions based on the Slide-Show height and the "fill" option.
	* 
	* @method SlideShow#_setImgDimensions
	* @private
	* @param {element} [img] - set the dimensions of this element.
	*/
	SlideShow.prototype._setImgDimensions = function(img) {
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


	/**
	* Build a timeline in the Slide-Show, and bine events for Slide-Show navigation.
	* 
	* @method SlideShow#_buildTimeline
	* @private
	*/
	SlideShow.prototype._buildTimeline = function() {
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
						self._updateTimeline();
					}
			  } else {
			    console.log("clicking too quickly!");
			  }
			});
		}
	};


	/**
	* Update the timeline to highlight the newly selected image.
	* 
	* @method SlideShow#_updateTimeline
	* @private
	*/
	SlideShow.prototype._updateTimeline = function() {
		// remove all highlights from the timeline
		for (var i=0; i<this.timelineMarkers.length; i++) {
			this.timelineMarkers[i].id = "";
		}
		// highlight the correct timeline marker for the current poster
		this.timelineMarkers[this.curImgNum].id = "highlight";
	}


	/**
	* Clear the contents of the timeline.
	* 
	* @method SlideShow#_clearTimeline
	* @private
	*/
	SlideShow.prototype._clearTimeline = function() {
		// remove any elements currently in the timeline
		while (this.timelineWrap.firstChild) {
	    this.timelineWrap.removeChild(this.timelineWrap.firstChild);
		}
		// remove any elements in the timelineMarkers array
		this.timelineMarkers = [];
	};


	/**
	* Check how long it has been since the Slide-Show was updated.
	* If enough time has passed (delayTime), update the Slide-Show.
	* 
	* @method SlideShow#_checkTime
	* @private
	*/
	SlideShow.prototype._checkTime = function() {
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

	/**
	* Remove all Slide-Show elements and unbind all events.
	*
	* @method SlideShow#destroy
	* @param {bool} reset - if true, add the image elements originally contained in ".slide-show" back into the dom
	*/
	SlideShow.prototype.destroy = function(reset) {
		// remove events from the window
		window.removeEventListener("load",  _onLoad );
		window.removeEventListener("resize",  _onResize );

		var body = document.querySelector("body");
		body.removeChild(this.imgWrap);

		// if reset is true, add the img elements back into the dom
		if (reset) {
			for (var i=0; i<this.imgList.length; i++) {
				this.scroller.appendChild(this.imgList[i]);
			}
		} else {
			console.log("img destroyed!");
		}
	};

})();

