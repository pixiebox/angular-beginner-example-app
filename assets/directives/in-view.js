(function() {
	'use strict';
	var addWindowInViewItem
	  , bindWindowEvents
	  , checkInView
	  , debounce
	  , getBoundingClientRect
	  , getViewportHeight
	  , removeWindowInViewItem
	  , trackInViewContainer
	  , triggerInViewCallback
	  , unbindWindowEvents
	  , untrackInViewContainer
	  , windowCheckInViewDebounced
	  , windowEventsHandler
	  , _containersControllers
	  , _windowEventsHandlerBinded
	  , _windowInViewItems,

    __slice = [].slice;

	angular.module('angular-inview', [])
	.directive('inView', [
		'$parse', function($parse) {
			return {
				restrict: 'A',
				require: '?^inViewContainer',
				link: function(scope, element, attrs, containerController) {
					var inViewFunc, item, performCheckDebounced;
					if (!attrs.inView) return;

					inViewFunc = $parse(attrs.inView);
					item = {
						element: element,
						wasInView: false,
						offset: 0,
						callback: function($event, $inview, $inviewpart) {
							if ($event == null) {
								$event = {};
							}

							return scope.$apply((function(_this) {
								return function() {
									$event.inViewTarget = element[0];

									return inViewFunc(scope, {
										'$event': $event,
										'$inview': $inview,
										'$inviewpart': $inviewpart
									});
								};
							})(this));
						}
					};

					if (attrs.inViewOffset != null) {
						attrs.$observe('inViewOffset', function(offset) {
							item.offset = scope.$eval(offset) || 0;
							return performCheckDebounced();
						});
					}

					performCheckDebounced = windowCheckInViewDebounced;

					if (containerController != null) {
						containerController.addItem(item);
						performCheckDebounced = containerController.checkInViewDebounced;
					} else {
						addWindowInViewItem(item);
					}

					performCheckDebounced();

					return scope.$on('$destroy', function() {
						if (containerController != null) {
							containerController.removeItem(item);
						}
						return removeWindowInViewItem(item);
					});
				}
			};
		}
	]).directive('inViewContainer', function() {
		return {
			restrict: 'AC',
			controller: [
				'$element', function($element) {
					this.items = [];
					this.addItem = function(item) {
						return this.items.push(item);
					};
					this.removeItem = function(item) {
						var i;

						return this.items = (function() {
							var _i
							  , _len
							  , _ref
							  , _results;

							_ref = this.items;
							_results = [];

							for (_i = 0, _len = _ref.length; _i < _len; _i++) {
								i = _ref[_i];

								if (i !== item) {
									_results.push(i);
								}
							}

							return _results;
						}).call(this);
			  };
			  this.checkInViewDebounced = debounce((function(_this) {
				return function(event) {
				  return checkInView(_this.items, $element[0], event);
				};
			  })(this));
			  return this;
			}
		  ],
		  link: function(scope, element, attrs, controller) {
			element.bind('scroll', controller.checkInViewDebounced);
			trackInViewContainer(controller);
			return scope.$on('$destroy', function() {
			  element.unbind('scroll', controller.checkInViewDebounced);
			  return untrackInViewContainer(controller);
			});
		  }
		};
	});

	_windowInViewItems = [];

	addWindowInViewItem = function(item) {
		_windowInViewItems.push(item);
		return bindWindowEvents();
	};

	removeWindowInViewItem = function(item) {
		var i;

		_windowInViewItems = (function() {
			var _i, _len, _results;

			_results = [];

			for (_i = 0, _len = _windowInViewItems.length; _i < _len; _i++) {
				i = _windowInViewItems[_i];

				if (i !== item) {
					_results.push(i);
				}
			}

			return _results;
		})();

		return unbindWindowEvents();
	};

	_containersControllers = [];

	trackInViewContainer = function(controller) {
		_containersControllers.push(controller);
		return bindWindowEvents();
	};

	untrackInViewContainer = function(container) {
		var c;

		_containersControllers = (function() {
			var _i
			  , _len
			  , _results = [];

			for (_i = 0, _len = _containersControllers.length; _i < _len; _i++) {
				c = _containersControllers[_i];

				if (c !== container) {
					_results.push(c);
				}
			}
      
			return _results;
		})();

		return unbindWindowEvents();
	};

  _windowEventsHandlerBinded = false;

  windowEventsHandler = function(event) {
    var c, _i, _len;
    for (_i = 0, _len = _containersControllers.length; _i < _len; _i++) {
      c = _containersControllers[_i];
      c.checkInViewDebounced(event);
    }
    if (_windowInViewItems.length) {
      return windowCheckInViewDebounced(event);
    }
  };

  bindWindowEvents = function() {
    if (_windowEventsHandlerBinded) {
      return;
    }
    _windowEventsHandlerBinded = true;
    return angular.element(window).bind('checkInView click ready scroll resize', windowEventsHandler);
  };

  unbindWindowEvents = function() {
    if (!_windowEventsHandlerBinded) {
      return;
    }
    if (_windowInViewItems.length || _containersControllers.length) {
      return;
    }
    _windowEventsHandlerBinded = false;
    return angular.element(window).unbind('checkInView click ready scroll resize', windowEventsHandler);
  };

  triggerInViewCallback = function(event, item, inview, isTopVisible, isBottomVisible) {
    var elOffsetTop, inviewpart;
    if (inview) {
      elOffsetTop = getBoundingClientRect(item.element[0]).top + window.pageYOffset;
      inviewpart = (isTopVisible && 'top') || (isBottomVisible && 'bottom') || 'both';
      if (!(item.wasInView && item.wasInView === inviewpart && elOffsetTop === item.lastOffsetTop)) {
        item.lastOffsetTop = elOffsetTop;
        item.wasInView = inviewpart;
        return item.callback(event, true, inviewpart);
      }
    } else if (item.wasInView) {
      item.wasInView = false;
      return item.callback(event, false);
    }
  };

  checkInView = function(items, container, event) {
    var bounds, boundsBottom, boundsTop, element, item, viewport, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _results;
    viewport = {
      top: 0,
      bottom: getViewportHeight()
    };
    if (container && container !== window) {
      bounds = getBoundingClientRect(container);
      if (bounds.top > viewport.bottom || bounds.bottom < viewport.top) {
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          triggerInViewCallback(event, item, false);
        }
        return;
      }
      if (bounds.top > viewport.top) {
        viewport.top = bounds.top;
      }
      if (bounds.bottom < viewport.bottom) {
        viewport.bottom = bounds.bottom;
      }
    }
    _results = [];
    for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
      item = items[_j];
      element = item.element[0];
      bounds = getBoundingClientRect(element);
      boundsTop = bounds.top + parseInt((_ref = (_ref1 = item.offset) != null ? _ref1[0] : void 0) != null ? _ref : item.offset);
      boundsBottom = bounds.bottom + parseInt((_ref2 = (_ref3 = item.offset) != null ? _ref3[1] : void 0) != null ? _ref2 : item.offset);
      if (boundsTop < viewport.bottom && boundsBottom >= viewport.top) {
        _results.push(triggerInViewCallback(event, item, true, boundsBottom > viewport.bottom, boundsTop < viewport.top));
      } else {
        _results.push(triggerInViewCallback(event, item, false));
      }
    }
    return _results;
  };

  getViewportHeight = function() {
    var height, mode, _ref;
    height = window.innerHeight;
    if (height) {
      return height;
    }
    mode = document.compatMode;
    if (mode || !(typeof $ !== "undefined" && $ !== null ? (_ref = $.support) != null ? _ref.boxModel : void 0 : void 0)) {
      height = mode === 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight;
    }
    return height;
  };

  getBoundingClientRect = function(element) {
    var el, parent, top;
    if (element.getBoundingClientRect != null) {
      return element.getBoundingClientRect();
    }
    top = 0;
    el = element;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent;
    }
    parent = element.parentElement;
    while (parent) {
      if (parent.scrollTop != null) {
        top -= parent.scrollTop;
      }
      parent = parent.parentElement;
    }
    return {
      top: top,
      bottom: top + element.offsetHeight
    };
  };

  debounce = function(f, t) {
    var timer = null
      , args;

    return function() {
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];

      if (timer != null) {
			clearTimeout(timer);
      }

      return timer = setTimeout((function() {
			return f.apply(null, args);
      }), t != null ? t : 100);
    };
  };

  windowCheckInViewDebounced = debounce(function(event) {
    return checkInView(_windowInViewItems, null, event);
  });

}).call(this);