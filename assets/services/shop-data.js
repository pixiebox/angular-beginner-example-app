angular.module('articles', []).service('$articlelist', [
		'$http'
	, '$rootScope'
	, function($http, $rootScope) {
			var myData = null;

			return {
					promise : function (params) {
						if (!myData || typeof params !== 'undefined') {
							var params = params || {}
								, page
								, pageInUrl = window.location.href.match(/page=(\d+)/);

							if (pageInUrl != null
							&& pageInUrl.length == 2){//make sure the url is not ?page=
								if (pageInUrl[1] - 0 > $rootScope.endmarkerSyncDataset) {
									params.page = $rootScope.endmarkerSyncDataset;
									$rootScope.endmarkerSyncDataset += $rootScope.endmarkerSyncDataset;
								} else {
									params.page = pageInUrl[1];
								}
							} else if (!params.hasOwnProperty('page')) {
								params.page = 1;
							}

							params.end = $rootScope.pagemarkerLeap;
							params.per_page = $rootScope.itemsPerPage;

							/*return $http({
								method : 'GET',
								url : '/shop/api/json',
								params : params
							})*/
							return $http({
								'method': 'GET',
								'url': '/assets/services/data/shop-data.json',
								'Content-type': 'application/json'
							}).success(function (data) {
								myData = {data : data};
								return myData;
							}).error(function(data, status, headers, config) {
								// todo
							});
						} else {
							return myData;
						}
					}
			};
		}
]);