// Theater - a Lightbox Clone


// Wrap everything in an iffe to restrict variable scope
(function() {
	// global variables
	var _newTheater;
	var _winWidth = 0;
	var _winHeight = 0;


	/**
	* Create a new instance of TheaterLightbox, create the modal, and setup the page.
	* 
	* @method _onLoad
	* @private
	*/
	var _onLoad = function() {
		_newTheater = new TheaterLightbox();
		_newTheater.buildModal();
		_newTheater.setup();
		_newTheater._getDimensions();
	};


	/**
	* Get the dimensions of the window
	* 
	* @method _onResize
	* @private
	*/
	var _onResize = function() {
		_newTheater._getDimensions();
	};


	// Get current screen dimensions, update modal when the window is loaded and resized.
	window.addEventListener("load",  _onLoad );
	window.addEventListener("resize",  _onResize );


	/**
	* Create a Lightbox for displaying images, videos, and YouTube videos.
	*
	* @class
	* @constructor TheaterLightbox
	*/
	function TheaterLightbox() {
		/**
		* @property {array} posters - stores all .theater elements from the dom
		*/
		this.posters = document.querySelectorAll(".theater");
		/**
		* @property {array} groupNames - store a list of the group names
		*/
		this.groupNames = [];
		/**
		* @property {object} groups - store a list of .theater elements under their respective group names
		*/
		this.groups = {};
		/**
		* @property {int} currentPosterNum - store the number of the currently selected poster within a group
		*/
		this.currentPosterNum = 0;
		/**
		* @property {string} currentPosterGroup - store the name of the group of the currently selected poster
		*/
		this.currentPosterGroup = "null";
		/**
		* @property {array} timelineMarkers - store all of the timeline markers in an array
		*/
		this.timelineMarkers = [];
		/**
		* @property {int} mediaWidth - width in px of the media inside of the modal
		*/
		this.mediaWidth = 0;
		/**
		* @property {int} mediaHeight - height in px of the media inside of the modal
		*/
		this.mediaHeight = 0;
		/**
		* @property {int} ytWidth - width in px of a youtube element in a modal
		*/
		this.ytWidth = 560;
		/**
		* @property {int} ytHeight - height in px of a youtube element in a modal
		*/
		this.ytHeight = 315;
		/**
		* @property {element} modalWrap
		* @property {element} modal
		* @property {element} modalRight
		* @property {element} modalLeft
		* @property {element} modalClose
		* @property {element} modalContent
		* @property {element} modalText
		* @property {element} image
		* @property {element} iframe
		* @property {element} timelineWrap
		* @property {element} bigDot
		* @property {element} smallDot
		*/
		this.modalWrap, this.modal, this.modalRight, this.modalLeft, this.modalClose, this.modalContent, this.modalText, this.image, this.iframe, this.timelineWrap, this.bigDot, this.smallDot;
	};

	/**
	* Create the modal box and insert it into the dom.
	* 
	* @method TheaterLightbox#buildModal
	*/
	TheaterLightbox.prototype.buildModal = function() {
		// wrapper for dimming background
		this.modalWrap = document.createElement("div");
		this.modalWrap.setAttribute("class", "modal-wrap theater-bg-inactive");
		// modal
		this.modal = document.createElement("div");
		this.modal.setAttribute("class", "modal theater-modal-inactive");
		this.modalWrap.appendChild(this.modal);
		// controls
		// right button
		this.modalRight = document.createElement("div");
		this.modalRight.setAttribute("id", "modal-right");
		this.modal.appendChild(this.modalRight);
		// left button
		this.modalLeft = document.createElement("div");
		this.modalLeft.setAttribute("id", "modal-left");
		this.modal.appendChild(this.modalLeft);
		// close button
		this.modalClose = document.createElement("div");
		this.modalClose.setAttribute("id", "modal-close");
		this.modal.appendChild(this.modalClose);
		// content
		this.modalContent = document.createElement("div");
		this.modalContent.setAttribute("class", "modal-content");
		this.modal.appendChild(this.modalContent);
		// text
		this.modalText = document.createElement("div");
		this.modalText.setAttribute("class", "modal-description");
		this.modal.appendChild(this.modalText);
		// media
		this.image = document.createElement("img");
		this.iframe = document.createElement("iframe");
		// timeline
		this.timelineWrap = document.createElement("div");
		this.timelineWrap.setAttribute("class", "timeline-wrap");
		this.modal.appendChild(this.timelineWrap);
		// big and small dot templates
		this.bigDot = document.createElement("div");
		this.bigDot.setAttribute("class", "dot-big");
		this.smallDot = document.createElement("div");
		this.smallDot.setAttribute("class", "dot-small");
		// insert the modal-wrap before the first child of the body
		var body = document.querySelector("body");
		body.insertBefore(this.modalWrap, body.firstChild);
	};

	/**
	* Initial setup of the lightbox.
	* Create an object to keep track of all of the groups on the page.  
	* Bind events to the modal box buttons and all of the ".theater" elements on the page.
	* 
	* @method TheaterLightbox#setup
	*/
	TheaterLightbox.prototype.setup = function() {
		var self = this; // reference for binding events

		// bind events to any element with the theater class
		for (var i=0; i<this.posters.length; i++ ) {
			// collect posters in an object, group names in a list
			var curName = this.posters[i].dataset.theaterGroup;
			var add = false;
			if (this.groupNames.length === 0) {
				this.groups[curName] = [];
				add = true;
			} else {
				for (var j=0; j<this.groupNames.length; j++) {
					if (curName === this.groupNames[j]) {
						add = false;
						break;
					}
					add = true;
				}
			}
			if (add) {
				this.groups[curName] = [];
				this.groupNames.push(curName);
			}
			this.groups[curName].push(this.posters[i]);

			// add events to poster elements
			this.posters[i].addEventListener("click", function() {
				// figure out what # poster was clicked on
				self.currentPosterGroup = this.dataset.theaterGroup;
				// self.currentPosterNum = self.groups[self.currentPosterGroup].indexOf(this);
				self.currentPosterNum = self.groups[self.currentPosterGroup].indexOf(this);

				// build modal using current poster info
				self.updateModal(self.currentPosterGroup, self.currentPosterNum, "new");
				// show the modal
				self.modalWrap.setAttribute("class", "modal-wrap theater-bg-active");
				self.modal.setAttribute("class", "modal theater-modal-active");
			});
		}

		// modal button events
		this.modalClose.addEventListener("click", function() {
			self.modalWrap.setAttribute("class", "modal-wrap theater-bg-inactive");
			self.modal.setAttribute("class", "modal theater-modal-inactive");
			// reset global current poster info
			self.currentPosterGroup = "";
			self.currentPosterNum = 0;
			// clear contents of modal
			self.clearModal();
			self._clearTimeline();
		});
		this.modalRight.addEventListener("click", function() {
			if (self.groups[self.currentPosterGroup].length>1) {
				// clear contents of modal
				self.clearModal();
				// wait 500ms, then build modal using current poster info
				setTimeout(function() {self.updateModal(self.currentPosterGroup, self.currentPosterNum, "right")}, 500);
			}
		});
		this.modalLeft.addEventListener("click", function() {
			if (self.groups[self.currentPosterGroup].length>1) {
				// clear contents of modal
				self.clearModal();
				// wait 500ms, then build modal using current poster info
				setTimeout(function() {self.updateModal(self.currentPosterGroup, self.currentPosterNum, "left")}, 500);
			}
		});
	};

	/**
	* Update the modal box with a new image, update the timeline.
	*
	* @method TheaterLightbox#updateModal
	* @param {array} [posterGroup] - the group name of the currently selected poster.
	* @param {int} [posterNum] - the number of the currently selected poster within the group.
	* @param {string} [dir] - direction, can be right, left, new, or timeline.
	*/
	TheaterLightbox.prototype.updateModal = function(posterGroup, posterNum, dir) {
		var self = this; // reference for settimeout
		
		// figure out direction of modal
		// ** dir can be right, left, new, or timeline
		if (dir == "new") {
			this.currentPosterGroup = posterGroup;
			this._buildTimeline(posterGroup);
		}	else if (dir == "timeline") {
			this._updateTimeline(posterNum);
		} else if (dir == "right") {
			if (posterNum == (this.groups[posterGroup].length - 1)) {
				posterNum = 0;
			} else {
				posterNum++;
			}
			this._updateTimeline(posterNum);
		} else if (dir == "left") {
			if (posterNum == 0) {
				posterNum = (this.groups[posterGroup].length - 1);
			} else {
				posterNum--;
			}
			this._updateTimeline(posterNum);
		} else {
			console.log("error!!");
		}

		// update global current poster values
		this.currentPosterGroup = posterGroup;
		this.currentPosterNum = posterNum;
		var src = this.groups[this.currentPosterGroup][this.currentPosterNum].querySelector("img").alt;
		var txt = this.groups[this.currentPosterGroup][this.currentPosterNum].querySelector("img").title;

		// use poster info to update the modal box before showing it
		var newEl;
		var type;
		if (this.groups[this.currentPosterGroup][this.currentPosterNum].dataset.theaterType === "img") {
			newEl = this.image.cloneNode(true);
			type = "img";
		} else if (this.groups[this.currentPosterGroup][this.currentPosterNum].dataset.theaterType === "vid") {
			newEl = this.iframe.cloneNode(true);
			type = "vid";
		} else if (this.groups[this.currentPosterGroup][this.currentPosterNum].dataset.theaterType === "youTube") {
			newEl = this.iframe.cloneNode(true);
			type = "youTube";
		} else {
			console.log("wrong media type!");
		}
		newEl.setAttribute("src", src);
		this.modalContent.appendChild(newEl);
		// calculate maximum image size
		// use a delay to check current image size so dom can load
		setTimeout(function() {
			if (type == "img") {
				self.mediaWidth = newEl.width;
				self.mediaHeight = newEl.height;
			} else if (type == "vid") {
				self.mediaWidth = self.ytWidth;
				self.mediaHeight = self.ytHeight;
			} else if (type == "youTube") {
				self.mediaWidth = self.ytWidth;
				self.mediaHeight = self.ytHeight;
			} else {
				console.log("another wrong media type!");
			}
			self._setModalDimesions(newEl);
		}, 10);

		this.modalText.textContent = txt;
		// show modal
		this.modal.setAttribute("class", "modal theater-modal-active");
	};

	/**
	* Update the size of the media and modal box based on the browser dimensions.
	*
	* @method TheaterLightbox#_setModalDimensions
	* @param {element} [el] - image or iframe element in the modal.
	* @private
	*/
	TheaterLightbox.prototype._setModalDimesions = function(el) {
		var imgRatio = this.mediaWidth / this.mediaHeight;

		// calculate width based on height
		var newHeight = (_winHeight * 0.9) - 80;
		var newWidth = newHeight * imgRatio;

		// if the width is wider than the screen, calculate ratio based on width instead
		if ((newWidth+48) >= _winWidth) {
			newWidth = (_winWidth * 0.9);
			newHeight = newWidth * (1/imgRatio);
		}

		// set new height and width of image and modalContent
		el.style.height = newHeight + "px";
		el.style.width = newWidth + "px";
		this.modalContent.style.height = newHeight + "px";
		this.modalContent.style.width = newWidth + "px";
	};

	/**
	* Clear the current media from the modal.
	*
	* @method TheaterLightbox#clearModal
	*/
	TheaterLightbox.prototype.clearModal = function() {
		var self = this; // reference for settimeout

		this.modal.setAttribute("class", "modal theater-modal-inactive");
		// remove media from the modalContent element
		var curImg = this.modalContent.querySelector("img") || this.modalContent.querySelector("iframe");
		if (curImg) {
	    setTimeout(function() {
		    self.modalContent.removeChild(curImg);
	    }, 500);
		}
	};

	/**
	* Build a timeline inside the modal, bind events to timeline for modal navigation.
	*
	* @method TheaterLightbox#_buildTimeline
	* @param {string} [posterGroup] - the name of the current poster group.
	* @private
	*/
	TheaterLightbox.prototype._buildTimeline = function(posterGroup) {
		var self = this; // reference for binding events

		// get current group length, this will be the number of markers (big dots)
		var tlLength = this.groups[posterGroup].length;
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
		this.timelineMarkers[this.currentPosterNum].id = "highlight";
		// add click events to the timeline markers
		for (var j=0; j<this.timelineMarkers.length; j++) {
			this.timelineMarkers[j].addEventListener("click", function() {
				// when a timeline marker is clicked, check if it is the current marker, 
				// then update the global current poster values and build a new modal
				var thisPosterNum = self.timelineMarkers.indexOf(this);
				if (self.currentPosterNum != thisPosterNum) {
					// update styling of previous poster timeline marker
					self.timelineMarkers[self.currentPosterNum].id = "";
					// update global current poster num
					self.currentPosterNum = thisPosterNum;
					self.clearModal();
					setTimeout(function() {self.updateModal(self.currentPosterGroup, self.currentPosterNum, "timeline")}, 500);
					// update the active timeline marker
					self.timelineMarkers[self.currentPosterNum].id = "highlight";
				}
			});
		}
	};

	/**
	* Update the timeline to highlight the newly selected poster.
	*
	* @method TheaterLightbox#_updateTimeline
	* @param {int} [posterNum] - the number of the current poster inside the group.
	* @private
	*/
	TheaterLightbox.prototype._updateTimeline = function(posterNum) {
		// remove all highlights from the timeline
		for (var i=0; i<this.timelineMarkers.length; i++) {
			this.timelineMarkers[i].id = "";
		}
		// highlight the correct timeline marker for the current poster
		this.timelineMarkers[posterNum].id = "highlight";
	};

	/**
	* Remove all elements from the timeline.
	*
	* @method TheaterLightbox#_clearTimeline
	* @private
	*/
	TheaterLightbox.prototype._clearTimeline = function() {
		// remove any elements currently in the timeline
		while (this.timelineWrap.firstChild) {
	    this.timelineWrap.removeChild(this.timelineWrap.firstChild);
		}
		// remove any elements in the timelineMarkers array
		this.timelineMarkers = [];
	};

	/**
	* Get the dimensions of the browser and update the modal dimensions.
	*
	* @method TheaterLightbox#_getDimensions
	* @private
	*/
	TheaterLightbox.prototype._getDimensions = function() {
		_winWidth = document.documentElement.clientWidth;
		_winHeight = document.documentElement.clientHeight
		var curMedia = this.modalContent.querySelector("img") || this.modalContent.querySelector("iframe");
		if (curMedia) {
			this._setModalDimesions(curMedia);
		}
	};

	/**
	* Remove all Theater Lightbox elements and unbind all events.
	*
	* @method TheaterLightbox#destroy
	*/
	TheaterLightbox.prototype.destroy = function() {
		// remove events from the window
		window.removeEventListener("load",  _onLoad );
		window.removeEventListener("resize",  _onResize );

		var body = document.querySelector("body");
		body.removeChild(this.modalWrap);
	};

})();
