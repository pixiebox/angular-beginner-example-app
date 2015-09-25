angular.module('itemsReady',[]).directive('myRepeatDirective', ['$rootScope', '$timeout', function($rootScope, $timeout) {
	return function(scope, element, attrs) {
		// alertnative for non-infinite if (scope.$last){
		if ($rootScope.itemsPerPage % scope.$index === 1) {
			$timeout(function() {
				$rootScope.$broadcast('itemsReady', scope.$last);
			},100);
		}
	};
}]);