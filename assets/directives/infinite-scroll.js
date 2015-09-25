// http://binarymuse.github.io/ngInfiniteScroll/
angular.module('infinite-scroll', []).directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function ($rootScope, $window, $timeout) {

	return {
	  link: function(scope, elem, attrs) {
		var checkWhenEnabled
			, handler
			, scrollDistance
			, scrollEnabled
			, lastScrollTop
			, elTop
			, docViewTop
			, gapBottom;

		$window = angular.element($window);
		scrollDistance = lastScrollTop = 0;

		/*custom*/
		$rootScope.scrollDirection = 'down';
		/*end custom*/
		
		if (attrs.infiniteScrollDistance != null) {
			scope.$watch(attrs.infiniteScrollDistance, function(value) {
				return scrollDistance = parseInt(value, 10);
			});
		}

		scrollEnabled = true;
		checkWhenEnabled = false;

		if (attrs.infiniteScrollDisabled != null) {
			scope.$watch(attrs.infiniteScrollDisabled, function(value) {
				scrollEnabled = !value;

				if (scrollEnabled && checkWhenEnabled) {
					checkWhenEnabled = false;
					return handler();
				}
			});
		}

		handler = function() {
			var elementBottom
				, remaining
				, shouldScroll
				, windowBottom;

			/*custom*/
			elTop = elem.offset().top;
			gapBottom = $(document).height() - (elem.height() + elTop);
			docViewTop = $window.scrollTop();
			$rootScope.scrollDirection = docViewTop > lastScrollTop ? 'down' : 'up';
			lastScrollTop = docViewTop;
			/*end custom*/
			
			windowBottom = $window.height() + $window.scrollTop();
			elementBottom = elTop + elem.height();
			remaining = elementBottom - windowBottom - gapBottom;

			/*custom*/
			shouldScroll = $rootScope.scrollDirection == 'down'
				? remaining <= 0
				: elTop >= $window.scrollTop() && scope.currentPage > 1;
			/*end custom*/

			if (shouldScroll && scrollEnabled) {
				if ($rootScope.$$phase) {
					return scope.$eval(attrs.infiniteScroll);
				} else {
				  return scope.$apply(attrs.infiniteScroll);
				}
			} else if (shouldScroll) {
				return checkWhenEnabled = true;
			}
		};

		$window.on('scroll', handler);

		scope.$on('$destroy', function() {
			return $window.off('scroll', handler);
		});

		return $timeout((function() {
			if (attrs.infiniteScrollImmediateCheck) {
				if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
					return handler();
				}
			} else {
				return handler();
			}
		}), 0);
	  }
	};
  }
]);