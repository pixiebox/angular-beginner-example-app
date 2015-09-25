var sharedFilters = angular.module('sharedFilters', []);

sharedFilters.filter('offset', function() {
	return function(input, start) {
		if (input){
			start = parseInt(start, 10);
			return input.slice(start);
		}
	};
}).filter('singleQuotify', function () {
	return function(input) {
		return input.replace('"', "'");
	}
}).filter('urlEncode', function () {
	 return function (input) {
		return pixieLib.rawurlencode(input).replace(/\s/g, '-');
	}
}).filter('range', function() {
	return function(input, total) {
		total = total - 0;
	
		for (var i = 0; i < total; i++)	input.push(i);
		return input;
	};
});
angular.module('ListerAppFilters', ['sharedFilters']);

