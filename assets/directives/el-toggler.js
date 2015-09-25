angular.module('el-toggler', ['ngSanitize']).directive("elToggler", function($parse, $sce, $compile) {
	return {
		restrict: "A",
		link: function (scope, element, attributes) {
			element.bind('click', function () {
				var target = $(attributes.elToggler);
				
				if (!target.hasClass('open')) {
					target.addClass('open').slideDown();
				} else {
					target.removeClass('open').slideUp();
				}
			});
		}
	}
});