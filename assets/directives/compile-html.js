angular.module('bindHtmlDirective', ['ngSanitize']).directive("compileHtml", function($parse, $sce, $compile) {
    return {
        restrict: "A",
        link: function (scope, element, attributes) {
			var expression = $sce.parseAsHtml(attributes.compileHtml);
			
			element.html(expression(scope));
        }
    }
});