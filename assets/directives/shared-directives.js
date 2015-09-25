angular.module('bindHtmlDirective', ['ngSanitize']).directive("compileHtml", function($parse, $sce, $compile) {
	return {
		restrict: "A",
		link: function (scope, element, attributes) {
			var expression = $sce.parseAsHtml(attributes.compileHtml);

			element.html(expression(scope));
		}
	}
});
angular.module('inputFocus',[]).directive('focus', function() {
	return function(scope, element) {
		element[0].focus();
	}
});
angular.module('itemsReady',[]).directive('repeatDirective', ['$rootScope', '$timeout', function($rootScope, $timeout) {
	return function(scope, element, attrs) {
		// alertnative if (scope.$last){
		if ($rootScope.itemsPerPage % scope.$index === 1) {
			$timeout(function() {
				$rootScope.$broadcast('itemsReady', scope.$last);
			},100);
		}
	};
}]);
angular.module('login',[]).directive('passwordMatch', [function () {
	return {
		restrict: 'A',
		scope:true,
		require: 'ngModel',
		link: function (scope, elem , attrs,control) {
			var checker = function () {
				//get the value of the first password
				var e1 = scope.$eval(attrs.ngModel) 
				//get the value of the other password  
				  , e2 = scope.$eval(attrs.passwordMatch);

				if(e2 != null) return e1 == e2;
			};

			scope.$watch(checker, function (n) {
				//set the form control to valid if both 
				//passwords are the same, else invalid
				control.$setValidity('passwordNoMatch', n);
			});
		}
	};
}]);