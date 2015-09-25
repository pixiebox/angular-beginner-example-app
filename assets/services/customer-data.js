angular.module('customerData', []).service('$shoppinglist', [
		'$http'
	, '$rootScope'
	, function($http, $rootScope) {
			var myData;
		// todo linebreaks in alle bestanden naar UNIX
			return {
				promise : function (params) {
					return $http({
						method 	: 'GET',
						//url 	: '/shop/api/cartitems',
						url 	: '/assets/services/data/cart-testdata.json',
					}).success(function (data) {
						myData = {data : data};
						return myData;
					}).error(function(data, status, headers, config) {
						//deferred.reject("Error: request returned status " + status); 
					});
				}
			};
		}
]).service('$savelist', [
		'$http'
	, '$rootScope'
	, function($http, $rootScope) {
			var myData;

			return {
				promise : function (params) {
					return $http({
						method 	: 'GET',
						//url 	: '/shop/api/saveditems',
						url 	: '/assets/services/data/saved-testdata.json',
					}).success(function (data) {
						myData = {data : data};
						return myData;
					}).error(function(data, status, headers, config) {
						//deferred.reject("Error: request returned status " + status); 
					});
				}
			};
		}
]).service('$reviews', [
		'$http'
	, '$rootScope'
	, function($http, $rootScope) {
			var myData;

			return {
					promise : function (params) {
						return $http({
								method 	: 'GET'
						//, url 	: '/shop/api/saveditems',
							, url 		: '/assets/services/data/reviews.json'
						}).success(function (data) {
							myData = {data : data};
							return myData;
						}).error(function(data, status, headers, config) {
							//deferred.reject("Error: request returned status " + status); 
						});
					}
				, review: function (id, stars) {
						console.log('review for ' + id + ' ' + stars + ' stars is send');
						/*return $http({
							'method': 'POST',
							'url': '/shop/api/review',
							'Content-type': 'application/json'
						});*/
					}
			};
		}
]);