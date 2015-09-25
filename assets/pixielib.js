var pixieLib = {
		createCookie: function createCookie (name, value, days) {
			var expires
						, domain = window.location.hostname !== 'localhost'
					? '; domain=' + window.location.hostname
					: '';

			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				expires = '; expires='+date.toGMTString();
			} else {
				expires = '';
			}

			document.cookie = name + '=' + value + expires + '; path=/' + domain;
    }

	, readCookie: function readCookie (name) {
			var nameEQ = name + '='
						, ca = document.cookie.split(';');

			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
    }

	, eraseCookie: function eraseCookie(name) {
			this.createCookie(name, '', -1);
    }

	, isTouchDevice : function isTouchDevice () {
			return 'ontouchstart' in window // works on most browsers 
        //|| 'onmsgesturechange' in window // works on ie10
        //|| !!('msmaxtouchpoints' in window.navigator)
    }

	, objSize: function objSize (obj) {
			var size = 0
				, key;

			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		}

	, scrollPos: function scrollPos () {
			var scrollTop = (window.pageYOffset !== undefined)
						? window.pageYOffset
						: (document.documentElement || document.body.parentNode || document.body).scrollTop
				, scrollLeft = (window.pageXOffset !== undefined)
						? window.pageXOffset
						: (document.documentElement || document.body.parentNode || document.body).scrollLeft;

			return [scrollTop, scrollLeft];
		}

  , offset: function offset (selector, position) {
			var rect = document.querySelector(selector);

			if (rect.length) {
				rect = rect.getBoundingClientRect();

				switch (position) {
					case 'left':
						return rect.left; // x position of #world relative to viewport
					case 'top':
						return rect.top; // y position of #world relative to viewport
					default:
						return 0;
				}
				/*
				rect.left // x position of #world relative to viewport
				rect.top // y position of #world relative to viewport
				rect.width // width of #world, including padding and borders
				rect.height // height of #world, including padding and borders
				rect.offsetWidth // width of #world - IE8 and below
				rect.offsetHeight // height of #world - IE8 and below
				*/
			} else {
				console.log('Element is not found.');
			}
    }
	, belowthefold: function belowthefold (element, settings) {
			var fold;

			if (settings.container === undefined || settings.container === window) {
					fold = (window.innerHeight
									? window.innerHeight
									: Math.max(document.documentElement.clientHeight, document.body.clientHeight)
								) + this.scrollPos()[0];
			} else {
				fold = this.offset(settings.container, 'top') + document.querySelector(settings.container).height;
			}

			return fold <= $(element).offset().top - settings.threshold;
    }

  , rightoffold: function rightoffold (element, settings) {
			var fold;

			if (settings.container === undefined || settings.container === window) {
				fold = (window.innerWidth
					? window.innerWidth
					: Math.max(document.documentElement.clientWidth, document.body.clientWidth)
				) + this.scrollPos()[1];
			} else {
				fold = this.offset(settings.container, 'left') + document.querySelector(settings.container).width;
			}

			return fold <= this.offset(element, 'left') - settings.threshold;
		}

	, abovethetop: function abovethetop (element, settings) {
			var fold;

			if (settings.container === undefined || settings.container === window) {
				fold = this.scrollPos();
			} else {
				fold = this.offset(settings.container, 'top');
			}

			return fold >= this.offset(element, 'top') + settings.threshold  + document.querySelector.height;
		}

	, leftofbegin: function leftofbegin (element, settings) {
			var fold;

			if (settings.container === undefined || settings.container === window) {
					fold = this.scrollPos()[1];
			} else {
				fold = this.offset(settings.container, 'left');
			}

			return fold >= this.offset(element, 'left') + settings.threshold + document.querySelector(element).width;
    }

	, inviewport: function inviewport (element, settings) {
		 return !this.rightoffold(element, settings) && !this.leftofbegin(element, settings) &&
						!this.belowthefold(element, settings) && !this.abovethetop(element, settings);
    }
	, localStorage : {
			set: function (key, value, expires) {
				if (typeof expires !== 'undefined') {
					var timespan;

					timespan = expires.split(' ');
					expires = (Date.now() / 1000 | 0);

					switch (timespan[1]) {
						case 'minute':
						case 'minutes':
							expires += timespan[0] * 60;
							break;
						case 'hour':
						case 'hours':
							expires += (timespan[0] * 60 * 60);
							break;
						case 'day':
						case 'days':
							expires += (timespan[0] * 60 * 60 * 24);
							break;
						case 'week':
						case 'weeks':
							expires += (timespan[0] * 60 * 60 * 24 * 7);
							break;
						case 'month':
						case 'months':
							expires += (timespan[0] * 60 * 60 * 24 * 31);
							break;
						case 'year':
						case 'years':
							expires += (timespan[0] * 60 * 60 * 24 * 365);
							break;
					}

					value.expires = expires;
				}
				window.localStorage.setItem( key, JSON.stringify(value) );
			},
			get: function (key) {
				storageItem = JSON.parse( window.localStorage.getItem(key) );

				if (storageItem !== null
				&& 'expires' in storageItem) {
					if (storageItem.expires >= (Date.now() / 1000 | 0)) {
						return storageItem;
					} else {
						localStorage.removeItem(key);
						return null;
					}
				}

				return storageItem;
			}
		}
	, getKeyByValue: function getKeyByValue (obj, value, key) {
			/**
				* get key by given value
				*/

			for(var prop in obj) {
				if (obj.hasOwnProperty(prop)){
					if (typeof key == 'undefined') {
						if (obj[prop] === value) return prop;
					} else if (obj[prop][key] === value) {
						return prop;
					}
				}
			}
    }
  , rawurlencode: function rawurlencode (str) {
			str = (str + '').toString();
			/**
				* Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
				* PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
				*/
			return encodeURIComponent(str)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A');
    }
  , rawurldecode: function rawurldecode (str) { // PHP equivelant
			return decodeURIComponent(str + '').replace(/&amp;/g, '&');
    }
  , escapeHtml: function escapeHtml (str) {
			return str
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
		}
	, timestampToDate: function timestampToDate(UNIX_timestamp, format) {
			var format = typeof(format) === 'undefined'
						? 'date month year hour:min:sec'
						: format
				, objDate = new Date(UNIX_timestamp*1000)
				, months = ['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec']
				, year = objDate.getFullYear()
				, month = months[objDate.getMonth()]
				, date = objDate.getDate()
				, hour = objDate.getHours()
				, min = objDate.getMinutes()
				, sec = objDate.getSeconds()
				, time = format.replace('date', date)
									.replace('month', month)
									.replace('year', year)
									.replace('hour', hour)
									.replace('min', min)
									.replace('sec', sec.length > 1 ? sec : '0' + sec);

			return time;
		}
};