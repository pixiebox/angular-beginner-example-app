angular.module('cartlist', []).service('$cartData', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
	var myData;

   return {
		promise : function (params) {
			return $http({
				method 	: 'GET',
				url 	: '/shop/api/cartitems',
			}).success(function (data) {
				myData = {data : data};
				return myData;
			}).error(function(data, status, headers, config) {
				//deferred.reject("Error: request returned status " + status); 
			});
		},
	};
}]);

angular.module('savedlist', []).service('$savedData', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
	var myData;

   return {
		promise : function (params) {
			return $http({
				method 	: 'GET',
				url 	: '/shop/api/saveditems',
			}).success(function (data) {
				myData = {data : data};
				return myData;
			}).error(function(data, status, headers, config) {
				//deferred.reject("Error: request returned status " + status); 
			});
		},
	};
}]);

angular.module('addresslist', []).service('$addressData', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
	var myData;

   return {
		promise : function (params) {
			return $http({
				method 	: 'GET',
				url 	: '/shop/api/addresslist',
			}).success(function (data) {
				myData = {data : data};
				return myData;
			}).error(function(data, status, headers, config) {
				//deferred.reject("Error: request returned status " + status); 
			});
		},
	};
}]);

angular.module('shippinglist', []).service('$shippingData', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
	var myData;

   return {
		promise : function (params) {
			return $http({
				method 	: 'GET',
				url 	: '/shop/api/shippinglist',
			}).success(function (data) {
				myData = {data : data};
				return myData;
			}).error(function(data, status, headers, config) {
				//deferred.reject("Error: request returned status " + status); 
			});
		},
	};
}]);